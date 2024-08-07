import axios from 'axios';
import _ from 'lodash';
import { REACT_APP_OPENAI_API_KEY } from '@env';
import call from './call';

export const config = {
    headers: {
        Authorization: `Bearer ${REACT_APP_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
    },
};

const sortMessagesByDate = (messages) => {
    return _.orderBy(messages, ['created_at'], ['asc']);
};

export const retrieveMessages = async (thread_id) => {
    try {
        const messages = await axios.get(`https://api.openai.com/v1/threads/${thread_id}/messages`, config);
        return { response: sortMessagesByDate(messages.data.data) };
    } catch (error) {
        return { error: error.response.data || error.message };
    }
};

export const retrieveAssistant = async () => {
    let retryCount = 0;
    let maxRetries = 3;
    let error_message = '';

    while (retryCount < maxRetries) {
        try {
            const assistant = await axios.get('https://api.openai.com/v1/assistants/asst_D1iDklUU9aNKRSJDYr64hHrD', config);
            return { response: assistant.data };
        } catch (error) {
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
            return { response: thread.data };
        } catch (error) {
            retryCount++;
            error_message = error.response.data || error.message;
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait a second before the next retry
        }
    }

    return { error: error_message };
};

export const createThread = async (messages) => {
    let retryCount = 0;
    let maxRetries = 3;
    let error_message = '';

    while (retryCount < maxRetries) {
        try {
            const thread = await axios.post('https://api.openai.com/v1/threads', messages, config);
            return { response: thread.data };
        } catch (error) {
            retryCount++;
            error_message = error.response.data || error.message;
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait a second before the next retry
        }
    }

    return { error: error_message };
};

export const run = async (thread_id, assistant_id, day, week, userId) => {
    let retryCount = 0;
    let maxRetries = 3;
    let error_message = '';

    while (retryCount < maxRetries) {
        try {
            // TODO: Build instructions and route
            let instructions = await call('POST', `users/retrieveInstructions`, { day, week, userId });

            const body = JSON.stringify({
                assistant_id,
                instructions,
            });

            const response = await axios.post(`https://api.openai.com/v1/threads/${thread_id}/runs`, body, config);
            return { response: response.data };
        } catch (error) {
            retryCount++;
            error_message = error.response.data || error.message;
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait a second before the next retry
        }
    }
    return { error: error_message };
};

export const addUserMessage = async (thread_id, message) => {
    const body = JSON.stringify({ role: 'user', content: message });
    await axios.post(`https://api.openai.com/v1/threads/${thread_id}/messages`, body, config);
};

export const retrieveRun = async (thread_id, run_id) => {
    try {
        const response = await axios.get(`https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}`, config);
        return { response: response.data };
    } catch (error) {
        return { error: error.response.data || error.message };
    }
};