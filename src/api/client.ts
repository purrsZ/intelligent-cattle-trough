import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * Axios 实例（带拦截器）
 * - 统一设置 baseURL、超时与通用头
 * - 请求/响应拦截：附加鉴权、处理错误
 */
const client: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 这里可按需从本地存储/Redux 读取 token
    const token = localStorage.getItem('token');
    if (token) {
      const headers: any = config.headers;
      if (headers && typeof headers.set === 'function') {
        headers.set('Authorization', `Bearer ${token}`);
      } else {
        (config.headers as any) = {
          ...(config.headers as any),
          Authorization: `Bearer ${token}`,
        };
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // 统一错误处理，可按状态码分支
    return Promise.reject(error);
  }
);

export default client;


