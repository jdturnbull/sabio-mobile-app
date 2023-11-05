import axios from 'axios';
import { apiBase } from '../config';

// TODO: throw error if response has error code
export default async (method, path, data) => {
  const url = `${apiBase}/${path}`;

  const response = await axios({ method, url, data });
  return response.data;
};
