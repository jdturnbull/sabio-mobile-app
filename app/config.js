const CONFIG_DEV = {
  API_BASE: 'http://localhost:7074',
};

const CONFIG_PROD = {
  API_BASE: 'https://api.heysabio.com',
};

const CONFIG_NGROK = {
  API_BASE: 'https://c14b-2a00-23c7-b2a1-8201-692f-d3d-d110-eff6.ngrok-free.app',
};

const CONFIG = process.env.NODE_ENV === 'production' ? CONFIG_PROD : CONFIG_NGROK;

export const apiBase = CONFIG.API_BASE;
