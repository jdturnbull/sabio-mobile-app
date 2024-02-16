import axios from 'axios';
import { REACT_APP_OPENAI_API_KEY } from '@env';
import _ from 'lodash';
import call from './call';
import { REACT_APP_MIXPANEL_API_KEY } from '@env';
import { Mixpanel } from 'mixpanel-react-native';

const mixpanel = new Mixpanel(REACT_APP_MIXPANEL_API_KEY, false);

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

  mixpanel.track('OpenAI', { action: 'Extract function data', info: response });

  return response;
};

const sortMessagesByDate = (messages) => {
  return _.orderBy(messages, ['created_at'], ['asc']);
};

export const retrieveMessages = async (thread_id) => {
  try {
    const messages = await axios.get(`https://api.openai.com/v1/threads/${thread_id}/messages`, config);
    mixpanel.track('OpenAI', { action: 'Retrieve messages', threadId: thread_id });
    return { response: sortMessagesByDate(messages.data.data) };
  } catch (error) {
    return { error: error.response.data || error.message };
  }
};

export const retrieveAssistant = async (type) => {
  let retryCount = 0;
  let maxRetries = 3;
  let error_message = '';

  while (retryCount < maxRetries) {
    try {
      let assistant;
      if (type === 'onboarding') {
        assistant = await axios.get('https://api.openai.com/v1/assistants/asst_2dIzoiqvI7mSqU8iEpvVBUxW', config);
        mixpanel.track('OpenAI', { action: 'Retrieve assistant', type: 'onboarding' });
      } else if (type === 'main') {
        assistant = await axios.get('https://api.openai.com/v1/assistants/asst_WI46ok4oWekUzErXAouxuP7e', config);
        mixpanel.track('OpenAI', { action: 'Retrieve assistant', type: 'main' });
      }

      return { response: assistant.data };
    } catch (error) {
      mixpanel.track('OpenAI', {
        action: 'retry',
        type: 'Retrieve assistant',
        error: error.response.data || error.message,
      });
      retryCount++;
      error_message = error.response.data || error.message;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait a second before the next retry
    }
  }

  return { error: error_message };
};

export const retrieveThread = async (thread_id) => {
  let retryCount = 0;
  let maxRetries = 3;
  let error_message = '';

  while (retryCount < maxRetries) {
    try {
      const thread = await axios.get(`https://api.openai.com/v1/threads/${thread_id}`, config);
      mixpanel.track('OpenAI', { action: 'Retrieve thread', threadId: thread_id });
      return { response: thread.data };
    } catch (error) {
      error_message = error.response.data || error.message;
      mixpanel.track('OpenAI', {
        action: 'retry',
        type: 'Retrieve thread',
        error: error.response.data || error.message,
      });

      retryCount++;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait a second before the next retry
    }
  }

  return { error: error_message };
};

export const createThread = async (type, userId) => {
  let retryCount = 0;
  let maxRetries = 3;
  let error_message = '';

  while (retryCount < maxRetries) {
    try {
      let messages;

      if (type === 'onboarding') {
        messages = initial_chat_messages;
      } else if (type === 'main') {
        messages = initial_main_chat_messages;
      } else {
        messages = initial_main_chat_messages;
      }

      const thread = await axios.post('https://api.openai.com/v1/threads', messages, config);

      mixpanel.track('OpenAI', { action: 'Create thread', type });

      await call('POST', 'users/update', { userId, data: { threadId: thread.data.id } });

      return { response: thread.data };
    } catch (error) {
      error_message = error.response.data || error.message;
      retryCount++;
      mixpanel.track('OpenAI', {
        action: 'retry',
        type: 'Create thread',
        error: error.response.data || error.message,
      });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait a second before the next retry
    }
  }

  return { error: error_message };
};

export const run = async (thread_id, assistant_id, userId) => {
  let retryCount = 0;
  let maxRetries = 3;
  let error_message = '';

  while (retryCount < maxRetries) {
    try {
      let instructions = await call('GET', `users/instructions/${userId}`);

      const body = JSON.stringify({
        assistant_id,
        instructions,
      });

      const runRequest = await axios.post(`https://api.openai.com/v1/threads/${thread_id}/runs`, body, config);
      mixpanel.track('OpenAI', { action: 'Run', threadId: thread_id, assistantId: assistant_id });

      return { response: runRequest.data };
    } catch (error) {
      retryCount++;
      mixpanel.track('OpenAI', {
        action: 'retry',
        type: 'Run',
        error: error.response.data || error.message,
      });
      error_message = error.response.data || error.message;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait a second before the next retry
    }
  }

  return { error: error_message };
};

export const addUserMessage = async (thread_id, message) => {
  const body = JSON.stringify({ role: 'user', content: message });
  await axios.post(`https://api.openai.com/v1/threads/${thread_id}/messages`, body, config);
  mixpanel.track('OpenAI', { action: 'Add user message', threadId: thread_id, message });
};

export const submitToolResponse = async ({ thread_id, run_id, body }) => {
  let retryCount = 0;
  let maxRetries = 3;
  let error_message = '';

  while (retryCount < maxRetries) {
    try {
      await axios.post(
        `https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}/submit_tool_outputs`,
        body,
        config,
      );

      mixpanel.track('OpenAI', { action: 'Submit tool response', threadId: thread_id, runId: run_id });

      return { response: 'success' };
    } catch (error) {
      error_message = error.response.data || error.message;
      retryCount++;
      mixpanel.track('OpenAI', {
        action: 'retry',
        type: 'Submit tool response',
        error: error.response.data || error.message,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait a second before the next retry
    }
  }

  return { error: error_message };
};

export const retrieveRun = async (thread_id, run_id) => {
  try {
    const response = await axios.get(`https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}`, config);
    mixpanel.track('OpenAI', { action: 'Retrieve run', threadId: thread_id, runId: run_id });
    return { response: response.data };
  } catch (error) {
    return { error: error.response.data || error.message };
  }
};
