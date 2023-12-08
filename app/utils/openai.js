import axios from 'axios';
import { REACT_APP_OPENAI_API_KEY, REACT_APP_POSTHOG_API_KEY } from '@env';
import _ from 'lodash';
import call from './call';

const sendToPosthog = async (type, message, userId) => {
  const data = {
    event: 'openai_error',
    properties: {
      type,
      message,
    },
    api_key: REACT_APP_POSTHOG_API_KEY,
    distinct_id: userId,
  };

  try {
    await axios.post('https://eu.posthog.com/capture/', data);
    console.log('Error reported to PostHog');
  } catch (posthogError) {
    console.error('Failed to report error to PostHog:', posthogError);
  }
};

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
      content: 'Hey Sabio!',
    },
  ],
});

export const extractFunctionData = (res, userId) => {
  try {
    const { tool_calls } = res.required_action.submit_tool_outputs;
    const { arguments: args, name } = tool_calls[0].function;
    return { name, args, id: tool_calls[0].id };
  } catch (error) {
    console.log(`Error extracting function data: ${error.message}`);
    sendToPosthog('extract_function_data', error.message, userId);
  }
};

const sortMessagesByDate = (messages) => {
  return _.orderBy(messages, ['created_at'], ['asc']);
};

export const retrieveAssistant = async (type, userId) => {
  let retryCount = 0;
  const maxRetries = 3;

  while (retryCount < maxRetries) {
    try {
      let assistant;
      if (type === 'onboarding') {
        assistant = await axios.get('https://api.openai.com/v1/assistants/asst_2dIzoiqvI7mSqU8iEpvVBUxW', config);
      } else if (type === 'main') {
        assistant = await axios.get('https://api.openai.com/v1/assistants/asst_WI46ok4oWekUzErXAouxuP7e', config);
      }

      return assistant?.data;
    } catch (error) {
      console.log(`Attempt ${retryCount + 1} failed: Error retrieving assistant: ${error.message}`);
      retryCount++;
      if (retryCount === maxRetries) {
        console.log(`Failed to retrieve assistant after ${maxRetries} attempts.`);
        const msg = error.response?.data?.error?.message || error.message;
        sendToPosthog('retrieve_assistant', msg, userId);
        return null; // or throw new Error('Failed to retrieve assistant');
      }
    }
  }
};

export const retrieveThread = async (thread_id, userId) => {
  let retryCount = 0;
  const maxRetries = 3;

  while (retryCount < maxRetries) {
    try {
      const thread = await axios.get(`https://api.openai.com/v1/threads/${thread_id}`, config);
      return thread.data;
    } catch (error) {
      console.log(`Attempt ${retryCount + 1} failed: Error retrieving thread: ${error.message}`);
      retryCount++;
      if (retryCount === maxRetries) {
        console.log(`Failed to retrieve thread after ${maxRetries} attempts.`);
        const msg = error.response?.data?.error?.message || error.message;
        sendToPosthog('retrieve_thread', msg, userId);
        return null; // or throw new Error('Failed to retrieve thread');
      }
    }
  }
};

export const createThread = async (type, activity, userId) => {
  let retryCount = 0;
  const maxRetries = 3;

  while (retryCount < maxRetries) {
    try {
      let thread;
      if (type === 'onboarding') {
        thread = await axios.post('https://api.openai.com/v1/threads', initial_chat_messages, config);
      } else if (type === 'main') {
        const initMessages = activity
          ? JSON.stringify({
              messages: [
                {
                  role: 'user',
                  content: `Hey Sabio! I want to chat about my ${activity.title} today.`,
                },
              ],
            })
          : initial_chat_messages;

        thread = await axios.post('https://api.openai.com/v1/threads', initMessages, config);
      }
      return thread.data;
    } catch (error) {
      console.log(`Attempt ${retryCount + 1} failed: Error creating thread: ${error.message}`);
      retryCount++;
      if (retryCount === maxRetries) {
        console.log(`Failed to create thread after ${maxRetries} attempts.`);
        const msg = error.response?.data?.error?.message || error.message;
        sendToPosthog('create_thread', msg, userId);
        return null; // or throw new Error('Failed to create thread');
      }
    }
  }
};

export const retrieveMessages = async (thread_id, userId) => {
  let retryCount = 0;
  const maxRetries = 3;

  while (retryCount < maxRetries) {
    try {
      const messages = await axios.get(`https://api.openai.com/v1/threads/${thread_id}/messages`, config);
      return sortMessagesByDate(messages.data.data);
    } catch (error) {
      console.log(`Attempt ${retryCount + 1} failed: Error retrieving messages: ${error.message}`);
      retryCount++;
      if (retryCount === maxRetries) {
        console.log(`Failed to retrieve messages after ${maxRetries} attempts.`);
        const msg = error.response?.data?.error?.message || error.message;
        sendToPosthog('retrieve_messages', msg, userId);
        return null; // or throw new Error('Failed to retrieve messages');
      }
    }
  }
};

export const run = async (thread_id, assistant_id, userId) => {
  let retryCount = 0;
  const maxRetries = 3;

  while (retryCount < maxRetries) {
    try {
      let instructions = await call('GET', `users/instructions/${userId}`);
      const body = JSON.stringify({
        assistant_id,
        instructions,
      });

      const runRequest = await axios.post(`https://api.openai.com/v1/threads/${thread_id}/runs`, body, config);
      return runRequest.data?.id;
    } catch (error) {
      console.log(`Attempt ${retryCount + 1} failed: Error running assistant: ${error.message}`);
      console.log(error.response?.data);
      retryCount++;
      if (retryCount === maxRetries) {
        console.log(`Failed to run assistant after ${maxRetries} attempts.`);
        const msg = error.response?.data?.error?.message || error.message;
        sendToPosthog('run', msg, userId);
        return null; // or throw new Error('Failed to run assistant');
      }
    }
  }
};

export const addUserMessage = async (thread_id, message, userId) => {
  let retryCount = 0;
  const maxRetries = 3;

  while (retryCount < maxRetries) {
    try {
      const body = JSON.stringify({ role: 'user', content: message });
      await axios.post(`https://api.openai.com/v1/threads/${thread_id}/messages`, body, config);
      return true;
    } catch (error) {
      console.log(`Attempt ${retryCount + 1} failed: Error adding user message: ${error.message}`);
      console.log(error.response?.data);
      retryCount++;
      if (retryCount === maxRetries) {
        console.log(`Failed to add user message after ${maxRetries} attempts.`);
        const msg = error.response?.data?.error?.message || error.message;
        sendToPosthog('add_user_message', msg, userId);
        return false;
      }
    }
  }
};

export const submitToolResponse = async (thread_id, run_id, tool_id, output, userId) => {
  let retryCount = 0;
  const maxRetries = 3;

  while (retryCount < maxRetries) {
    try {
      const body = JSON.stringify({
        tool_outputs: [{ tool_call_id: tool_id, output }],
      });

      await axios.post(
        `https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}/submit_tool_outputs`,
        body,
        config,
      );
      return true;
    } catch (error) {
      console.log(`Attempt ${retryCount + 1} failed: Error submitting tool response: ${error.message}`);
      console.log(error.response?.data);
      retryCount++;
      if (retryCount === maxRetries) {
        console.log(`Failed to submit tool response after ${maxRetries} attempts.`);
        const msg = error.response?.data?.error?.message || error.message;
        sendToPosthog('submit_tool_response', msg, userId);
        return false;
      }
    }
  }
};

export const retrieveRun = async (thread_id, run_id, userId) => {
  let retryCount = 0;
  const maxRetries = 3;

  while (retryCount < maxRetries) {
    try {
      const response = await axios.get(`https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}`, config);
      return response.data;
    } catch (error) {
      console.log(`Attempt ${retryCount + 1} failed: Error retrieving run: ${error.message}`);
      console.log(error.response?.data);
      retryCount++;
      if (retryCount === maxRetries) {
        console.log(`Failed to retrieve run after ${maxRetries} attempts.`);
        const msg = error.response?.data?.error?.message || error.message;
        sendToPosthog('retrieve_run', msg, userId);
        return null; // or throw new Error('Failed to retrieve run');
      }
    }
  }
};
