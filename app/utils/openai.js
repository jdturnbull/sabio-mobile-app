import axios from 'axios';
import { REACT_APP_OPENAI_API_KEY } from '@env';
import _ from 'lodash';

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

// const { tool_calls } = runResponse.data.required_action.submit_tool_outputs;
//         const { arguments: args } = tool_calls[0].function;

//         const { _goal } = JSON.parse(args);

export const extractFunctionData = (res) => {
  const { tool_calls } = res.required_action.submit_tool_outputs;
  const { arguments: args } = tool_calls[0].function;

  console.log(tool_calls);

  return { name: '', args };
};

const sortMessagesByDate = (messages) => {
  return _.orderBy(messages, ['created_at'], ['asc']);
};

export const retrieveAssistant = async (type) => {
  if (type === 'goal') {
    try {
      const assistant = await axios.get('https://api.openai.com/v1/assistants/asst_2dIzoiqvI7mSqU8iEpvVBUxW', config);
      return assistant.data;
    } catch (error) {
      console.log(`Error retrieving assistant: ${error.message}`);
    }
  }
};

export const createThread = async (type) => {
  if (type === 'goal') {
    try {
      const thread = await axios.post('https://api.openai.com/v1/threads', initial_goal_chat_messages, config);
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

export const run = async (thread_id, assistant_id) => {
  const body = JSON.stringify({ assistant_id });

  try {
    const runRequest = await axios.post(`https://api.openai.com/v1/threads/${thread_id}/runs`, body, config);
    return runRequest.data.id;
  } catch (error) {
    console.log(`Error running assistant: ${error.message}`);
    console.log(`thread_id: ${thread_id}, assistant_id: ${assistant_id}`);
  }
};

export const addUserMessage = async (thread_id, message) => {
  try {
    const body = JSON.stringify({ role: 'user', content: message });
    await axios.post(`https://api.openai.com/v1/threads/${thread_id}/messages`, body, config);
    return true;
  } catch (error) {
    console.log(`Error adding user message: ${error.message}`);
    return false;
  }
};
