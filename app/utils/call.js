import axios from 'axios';
import { REACT_APP_SECRET_KEY } from '@env';
import { apiBase } from '../config';

// TODO: throw error if response has error code
export default async (method, path, data) => {
  try {
    const url = `${apiBase}/${path}`;

    const data_with_key = { ...data, sabio_secret: REACT_APP_SECRET_KEY };

    try {
      const response = await axios({ method, url, data: data_with_key });
      return response.data;
    } catch (error) {
      console.log(error.code);
    }
  } catch (error) {
    console.log(error);
  }
};
