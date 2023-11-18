import axios from 'axios';
import { REACT_APP_OPENAI_API_KEY } from '@env';
import _ from 'lodash';
import moment from 'moment';
import call from './call';

export const config = {
  headers: {
    Authorization: `Bearer ${REACT_APP_OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
    'OpenAI-Beta': 'assistants=v1',
  },
};

const initial_goal_chat_messages = JSON.stringify({
  messages: [
    {
      role: 'user',
      content: 'Hey Sabio!',
    },
  ],
});

export const extractFunctionData = (res) => {
  const { tool_calls } = res.required_action.submit_tool_outputs;
  const { arguments: args, name } = tool_calls[0].function;
  return { name, args, id: tool_calls[0].id };
};

const sortMessagesByDate = (messages) => {
  return _.orderBy(messages, ['created_at'], ['asc']);
};

export const retrieveAssistant = async (type) => {
  if (type === 'onboarding') {
    try {
      const assistant = await axios.get('https://api.openai.com/v1/assistants/asst_2dIzoiqvI7mSqU8iEpvVBUxW', config);
      return assistant.data;
    } catch (error) {
      console.log(`Error retrieving assistant: ${error.message}`);
    }
  }
};

export const createThread = async (type, id) => {
  if (type === 'onboarding') {
    try {
      const thread = await axios.post('https://api.openai.com/v1/threads', initial_goal_chat_messages, config);
      return thread.data;
    } catch (error) {
      console.log(`Error creating thread: ${error.message}`);
    }
  }

  if (type === 'chat') {
    try {
      const thread = await axios.post('https://api.openai.com/v1/threads', initial_chat_messages, config);
      return thread.data;
    } catch (error) {
      console.log(`Error creating thread: ${error.message}`);
    }
  }
};

export const retrieveMessages = async (thread_id) => {
  try {
    const messages = await axios.get(`https://api.openai.com/v1/threads/${thread_id}/messages`, config);
    return sortMessagesByDate(messages.data.data);
  } catch (error) {
    console.log(`Error retrieving messages: ${error.message}`);
  }
};

export const run = async (thread_id, assistant_id, extraInstructions, userId) => {
  let instructions = await call('GET', `users/instructions/${userId}`);

  if (extraInstructions !== '') {
    instructions += extraInstructions;
  }

  const body = JSON.stringify({
    assistant_id,
    instructions,
  });

  try {
    const runRequest = await axios.post(`https://api.openai.com/v1/threads/${thread_id}/runs`, body, config);
    return runRequest.data?.id;
  } catch (error) {
    console.log(`Error running assistant: ${error.message}`);
    console.log(error.response.data);
  }
};

export const addUserMessage = async (thread_id, message) => {
  try {
    const body = JSON.stringify({ role: 'user', content: message });
    await axios.post(`https://api.openai.com/v1/threads/${thread_id}/messages`, body, config);
    return true;
  } catch (error) {
    console.log(`Error adding user message: ${error.message}`);
    console.log(error.response.data);
    return false;
  }
};

export const submitToolResponse = async (thread_id, run_id, tool_id, output) => {
  const body = JSON.stringify({
    tool_outputs: [{ tool_call_id: tool_id, output }],
  });

  try {
    await axios.post(`https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}/submit_tool_outputs`, body, config);
  } catch (error) {
    console.log(`Error submitting tool response: ${error.message}`);
    console.log(error.response.data);
  }
};

export const retrieveRun = async (thread_id, run_id) => {
  try {
    const response = await axios.get(`https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}`, config);
    return response.data;
  } catch (error) {
    console.log(`Error retrieving run: ${error.message}`);
    console.log(error.response.data);
  }
};
