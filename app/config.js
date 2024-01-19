const CONFIG_DEV = {
  API_BASE: 'http://localhost:7074',
};

const CONFIG_PROD = {
  API_BASE: 'https://api.heysabio.com',
};

const CONFIG_NGROK = {
  API_BASE: 'https://9caf-2a00-23c7-b2a1-8201-6557-7f6b-dd04-b03d.ngrok-free.app',
};

const CONFIG = process.env.NODE_ENV === 'production' ? CONFIG_PROD : CONFIG_DEV;

export const apiBase = CONFIG.API_BASE;
