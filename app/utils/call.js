import axios from 'axios';
import { REACT_APP_SECRET_KEY } from '@env';
import { apiBase } from '../config';

// TODO: throw error if response has error code
export default async (method, path, data) => {
  try {
    const url = `${apiBase}/${path}`;

    const data_with_key = { ...data, sabio_secret: REACT_APP_SECRET_KEY };

    console.log(url, data_with_key);

    console.log('Making the axios request');

    try {
      const response = await axios({ method, url, data: data_with_key });
      console.log('Completed the axios request');
      return response.data;
    } catch (error) {
      console.log(error.code);
    }
  } catch (error) {
    console.log(error);
  }
};
