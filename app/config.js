const CONFIG_DEV = {
  API_BASE: 'http://localhost:7074',
};

const CONFIG_PROD = {
  API_BASE: 'https://api.heysabio.com',
};

const CONFIG_NGROK = {
  API_BASE: 'https://8a64-2a00-23c7-b280-9801-4469-931b-5d55-50e.ngrok-free.app',
};

const CONFIG = process.env.NODE_ENV === 'production' ? CONFIG_NGROK : CONFIG_DEV;

export const apiBase = CONFIG.API_BASE;
