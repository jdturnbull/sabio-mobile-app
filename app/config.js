const CONFIG_DEV = {
  API_BASE: 'http://localhost:7074',
};

const CONFIG_PROD = {
  API_BASE: 'https://api.heysabio.com',
};

const CONFIG_NGROK = {
  API_BASE: 'https://48f4-2a00-23c7-b280-9801-51de-5b8f-f3ca-e7ff.ngrok-free.app',
};

const CONFIG = process.env.NODE_ENV === 'production' ? CONFIG_PROD : CONFIG_NGROK;

export const apiBase = CONFIG.API_BASE;
