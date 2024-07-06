import axios from 'axios';
import { REACT_APP_OPENAI_API_KEY } from '@env';

// gpt-4o, gpt-3.5-turbo
export default async ({ prompt, model }) => {
  const body = { model, messages: [{ role: 'user', content: prompt }] };

  console.log(prompt);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${REACT_APP_OPENAI_API_KEY}`,
  };

  try {
    const completion = await axios.post('https://api.openai.com/v1/chat/completions', body, { headers });
    return completion.data.choices[0].message.content;
  } catch (error) {
    console.log(error);
    return null;
  }
};
