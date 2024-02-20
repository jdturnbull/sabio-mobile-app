const CONFIG_DEV = {
  API_BASE: 'http://localhost:7074',
};

const CONFIG_PROD = {
  API_BASE: 'https://api.heysabio.com',
};

const CONFIG_NGROK = {
  API_BASE: 'https://c7ac-2a00-23c7-b280-9801-7d82-b949-c3c4-ad18.ngrok-free.app',
};

const CONFIG = process.env.NODE_ENV === 'production' ? CONFIG_NGROK : CONFIG_DEV;

export const apiBase = CONFIG.API_BASE;
