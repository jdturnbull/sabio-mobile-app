import axios from 'axios';
import { REACT_APP_OPENAI_API_KEY } from '@env';
import _ from 'lodash';
import moment from 'moment';

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
      content: 'Hey Sabio',
    },
  ],
});

export const extractFunctionData = (res) => {
  const { tool_calls } = res.data.required_action.submit_tool_outputs;
  const { arguments: args, name } = tool_calls[0].function;

  return { name, args };
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
  const today = moment().format('YYYY-MM-DD');
  const instructions = `You are Sabio, the experienced AI fitness trainer behind a mobile app, aimed at providing coaching services to users, you have the ability to connect with their smart watch to personalise and dynamically update their training plan based on their real-time performance. You are starting a conversation with a new client, during this conversation it is crucial to understand the clients needs and setting realistic goals. If the client already has a specific, quantifiable and time bound goal they want to achieve you should be accepting of this, however if this is not the case, you need to guide them towards a specific, quantifiable and time-bound goal.\nDesired Conversation Structure:\nIntroduction and building rapport - Greet the client, create a comfortable atmosphere to encourage open communication.\nIdentify the client’s goal - Invite the client to share their primary fitness goal (e.g, weight loss, running a 5k, competing in a triathlon). Goals should be quantifiable.\nUnderstanding the clients background - Make the client aware of the value of pairing a smart watch to the app, they will have the option to do this after your conversation. Ask the user about their previous fitness experience.\nPrevious injuries or health concerns - Inquire into any previous injuries or health concerns that may affect training.\nEstablishing the time frame - Discuss the client’s timeline for achieving this goal, they may have already specified a timeline based on a start date for a race or event. If the timeline is already set, you should be accepting of this. If the timeline is up for discussion, assess whether their timeline is realistic and adjust accordingly.\nExploring Motivation and Commitment Level - Understand what motivates them towards this goal, assess their commitment level and availability for training.\nSetting Short-Term and Long-Term Goals - Break down the main goal into smaller, measurable targets. Set short-term goals to create a sense of achievement and maintain motivation.\nAddressing Questions and Concerns - Open the floor for any questions they might have, address any concerns and reassure them of their capability to achieve their goals with proper guidance.\nFinalising the conversation - Thank the user for their time and confirm they are happy for you to process it, and move them onto the next step. If they are happy to move on, call the nextStep function, passing the required parameters.\n\nThroughout the conversation, it's important to be empathetic and supportive, while maintaining a professional approach to set the tone for a successful trainer-client relationship, remember the user is viewing this conversation on a mobile device, so avoid sending long messages as much as possible. For context, the date today is ${today}`;
  const body = JSON.stringify({
    assistant_id,
    instructions,
  });

  try {
    const runRequest = await axios.post(`https://api.openai.com/v1/threads/${thread_id}/runs`, body, config);
    return runRequest.data.id;
  } catch (error) {
    console.log(`Error running assistant: ${error.message}`);
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
