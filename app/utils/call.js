import axios from 'axios';
import { Mixpanel } from 'mixpanel-react-native';
import { apiBase } from '../config';
import { REACT_APP_MIXPANEL_API_KEY } from '@env';

const mixpanel = new Mixpanel(REACT_APP_MIXPANEL_API_KEY, false);
mixpanel.init();

// TODO: throw error if response has error code
export default async (method, path, data) => {
  try {
    const url = `${apiBase}/${path}`;

    const response = await axios({ method, url, data });
    // mixpanel.track('APP_ACTION', { action: 'Call', method, path, data });
    return response.data;
  } catch (error) {
    // mixpanel.track('APP_ERROR', { action: 'Call', method, path, data, error: error.message });
    console.log(error.message);
  }
};
