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
      content: "Hi Sabio, I'd like to set a goal",
    },
  ],
});

const sortMessagesByDate = (messages) => {
  return _.orderBy(messages, ['created_at'], ['asc']);
};

export const retrieveAssistant = async (type) => {
  if (type === 'goal') {
    const assistant = await axios.get('https://api.openai.com/v1/assistants/asst_2dIzoiqvI7mSqU8iEpvVBUxW', config);
    return assistant.data;
  }
};

export const createThread = async (type) => {
  if (type === 'goal') {
    const thread = await axios.post('https://api.openai.com/v1/threads', initial_goal_chat_messages, config);
    return thread.data;
  }
};

export const retrieveMessages = async (thread_id) => {
  const messages = await axios.get(`https://api.openai.com/v1/threads/${thread_id}/messages`, config);
  return sortMessagesByDate(messages.data.data);
};

export const run = async (thread_id, assistant_id, instructions) => {
  const body = instructions ? JSON.stringify({ assistant_id, instructions }) : JSON.stringify({ assistant_id });

  try {
    const runRequest = await axios.post(`https://api.openai.com/v1/threads/${thread_id}/runs`, body, config);
    return runRequest.data.id;
  } catch (error) {
    console.log(error);
  }
};
