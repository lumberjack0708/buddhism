/* global axios */
import { API_CONFIG } from '../config';

/**
 * 建立一個 Axios 實例用於佛法網站 API 呼叫
 * 參考 Example/front/Request.js
 * @returns {axios.AxiosInstance}
 */
const Request = () => {
  const instance = axios.create({
    baseURL: API_CONFIG.baseURL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  instance.interceptors.request.use((config) => {
    // 可以在這裡添加認證或其他請求頭
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      // 成功響應處理
      return response;
    },
    (error) => {
      // 處理錯誤響應
      console.error('API 請求錯誤:', error);
      return Promise.reject(error);
    }
  );

  return instance;
};

export default Request; 