import axios from 'axios';
import { REACT_APP_OPENAI_API_KEY, REACT_APP_POSTHOG_API_KEY } from '@env';
import _ from 'lodash';
import call from './call';

export const config = {
  headers: {
    Authorization: `Bearer ${REACT_APP_OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
    'OpenAI-Beta': 'assistants=v1',
  },
};

const initial_chat_messages = JSON.stringify({
  messages: [
    {
      role: 'user',
      content: "Hey Sabio! I have a fitness goal I'd like to discuss.",
    },
  ],
});

const initial_main_chat_messages = JSON.stringify({
  messages: [
    {
      role: 'user',
      content: 'Hey Sabio!',
    },
  ],
});

export const extractFunctionData = (res) => {
  const { tool_calls } = res.required_action.submit_tool_outputs;

  const response = [];

  for (let i = 0; i < tool_calls.length; i++) {
    const call = tool_calls[i];
    const { arguments: args, name } = call.function;
    response.push({ name, args, id: call.id });
  }

  return response;
};

const sortMessagesByDate = (messages) => {
  return _.orderBy(messages, ['created_at'], ['asc']);
};

export const retrieveMessages = async (thread_id) => {
  const messages = await axios.get(`https://api.openai.com/v1/threads/${thread_id}/messages`, config);
  return sortMessagesByDate(messages.data.data);
};

export const retrieveAssistant = async (type) => {
  let retryCount = 0;
  let maxRetries = 3;

  while (retryCount < maxRetries) {
    try {
      let assistant;
      if (type === 'onboarding') {
        assistant = await axios.get('https://api.openai.com/v1/assistants/asst_2dIzoiqvI7mSqU8iEpvVBUxW', config);
      } else if (type === 'main') {
        assistant = await axios.get('https://api.openai.com/v1/assistants/asst_WI46ok4oWekUzErXAouxuP7e', config);
      }

      return { response: assistant.data };
    } catch (error) {
      console.log('error retrieving the assistant, retrying...', error);
      retryCount++;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait a second before the next retry
    }
  }

  return { error: 'There was an error retrieving the assistant, please try again later' };
};

export const retrieveThread = async (thread_id) => {
  let retryCount = 0;
  let maxRetries = 3;

  while (retryCount < maxRetries) {
    try {
      const thread = await axios.get(`https://api.openai.com/v1/threads/${thread_id}`, config);
      return { response: thread.data };
    } catch (error) {
      console.log('error retrieving the thread, retrying...', error);
      retryCount++;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait a second before the next retry
    }
  }

  return { error: 'There was an error retrieving your thread' };
};

export const moveMessagesToNewThread = async (old_thread_id) => {
  try {
    const cleaned_thread_id = old_thread_id.replace('error-', '');

    const messages = await retrieveMessages(cleaned_thread_id);

    let formatted_messages = messages.map((message) => {
      return {
        role: message.role,
        content: message.content[0].text.value || '',
      };
    });

    formatted_messages = formatted_messages.filter((message) => message.role === 'user');

    // Reverse the order of the messages
    formatted_messages = formatted_messages.reverse();

    const old_messages = JSON.stringify({
      messages: formatted_messages,
    });

    const new_thread = await axios.post('https://api.openai.com/v1/threads', old_messages, config);

    console.log({ new_thread });
    return { response: new_thread.data };
  } catch (error) {
    console.log(error.response.data);
    console.log('error moving messages to a new thread', error);
    return { error: 'There was an error moving your messages to a new thread' };
  }
};

export const createThread = async (type) => {
  let retryCount = 0;
  let maxRetries = 3;

  while (retryCount < maxRetries) {
    try {
      let messages;

      if (type === 'onboarding') {
        messages = initial_chat_messages;
      } else if (type === 'main') {
        messages = initial_main_chat_messages;
      }

      const thread = await axios.post('https://api.openai.com/v1/threads', messages, config);

      return { response: thread.data };
    } catch (error) {
      console.log('error creating the thread, retrying...', error);
      retryCount++;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait a second before the next retry
    }
  }

  return { error: 'There was an error creating the thread, please try again later' };
};

export const run = async (thread_id, assistant_id, userId, hasResetThread) => {
  let retryCount = 0;
  let maxRetries = 3;

  while (retryCount < maxRetries) {
    try {
      let instructions = await call('GET', `users/instructions/${userId}`);

      if (hasResetThread) {
        instructions +=
          '\n\nAdditional Instructions: The conversation with the user experienced an error. Unfortunately only messages from the user were able to be saved. Before you do anything else, please inform the user of this.';
      }

      const body = JSON.stringify({
        assistant_id,
        instructions,
      });

      const runRequest = await axios.post(`https://api.openai.com/v1/threads/${thread_id}/runs`, body, config);
      return { response: runRequest.data };
    } catch (error) {
      console.log('error running the assistant, retrying...', error);
      retryCount++;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait a second before the next retry
    }
  }

  return { error: 'There was an error running the assistant, please try again later' };
};

export const addUserMessage = async (thread_id, message, userId) => {
  const body = JSON.stringify({ role: 'user', content: message });
  await axios.post(`https://api.openai.com/v1/threads/${thread_id}/messages`, body, config);
};

export const submitToolResponse = async ({ thread_id, run_id, body }) => {
  let retryCount = 0;
  let maxRetries = 3;

  while (retryCount < maxRetries) {
    try {
      await axios.post(
        `https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}/submit_tool_outputs`,
        body,
        config,
      );

      return { response: 'success' };
    } catch (error) {
      console.log('error submitting tool response, retrying...', error);
      retryCount++;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait a second before the next retry
    }
  }

  return { error: 'There was an error submitting the tool response, please try again later' };
};

export const retrieveRun = async (thread_id, run_id) => {
  try {
    const response = await axios.get(`https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}`, config);
    return { response: response.data };
  } catch (error) {
    console.log('error retrieving run', error);
    return { error: 'There was an error retrieving the run' };
  }
};
