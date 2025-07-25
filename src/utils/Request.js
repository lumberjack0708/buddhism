/* global axios */
import { API_CONFIG } from '../config';

const Request = () => {
  const instance = axios.create({
    baseURL: API_CONFIG.baseURL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  instance.interceptors.request.use((config) => {
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.error('API 請求錯誤:', error);
      return Promise.reject(error);
    }
  );

  return instance;
};

export default Request; 