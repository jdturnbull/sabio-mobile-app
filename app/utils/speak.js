import axios from 'axios';
import Sound from 'react-native-sound';

global.Buffer = require('buffer').Buffer;

// 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

// {
//     model: 'tts-1',
//     input: text,
//     voice: 'echo',
//     response_format: 'mp3',
//   },

export const speak = async (text) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer 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`,
        'Content-Type': 'application/json',
        accept: 'audio/mp3',
      },
    };

    const mp3 = await axios.post(
      'https://api.openai.com/v1/audio/speech',
      JSON.stringify({
        model: 'tts-1',
        input: 'Today is a wonderful day to build something people love!',
        voice: 'echo',
        response_format: 'mp3',
      }),
      config,
    );
  } catch (error) {
    console.log(error.message);
  }
};
