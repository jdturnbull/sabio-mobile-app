import axios from 'axios';
import { Mixpanel } from 'mixpanel-react-native';
import { apiBase } from '../config';
import { REACT_APP_MIXPANEL_API_KEY } from '@env';

const mixpanel = new Mixpanel(REACT_APP_MIXPANEL_API_KEY, false);

// TODO: throw error if response has error code
export default async (method, path, data) => {
  try {
    const url = `${apiBase}/${path}`;

    try {
      const response = await axios({ method, url, data });
      mixpanel.track('APP_ACTION', { action: 'Call', method, path, data, response });
      return response.data;
    } catch (error) {
      console.log('There has been an error');
      console.log(error.code);
    }
  } catch (error) {
    mixpanel.track('ERROR', { action: 'Call', error: error.message });
  }
};
