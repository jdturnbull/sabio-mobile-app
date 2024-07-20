const CONFIG_DEV = {
  API_BASE: 'http://localhost:7074',
};

const CONFIG_PROD = {
  API_BASE: 'https://api.heysabio.com',
};

const CONFIG_NGROK = {
  API_BASE: 'https://sabio.ngrok.app',
};

const CONFIG = process.env.NODE_ENV === 'production' ? CONFIG_PROD : CONFIG_DEV;

export const apiBase = CONFIG.API_BASE;
