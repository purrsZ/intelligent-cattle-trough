/**
 * 基于fetch的HTTP客户端
 * - 统一设置 baseURL、超时与通用头
 * - 请求/响应拦截：附加鉴权、处理错误
 */

/**
 * HTTP请求配置接口
 */
export interface RequestConfig {
  /** 请求URL */
  url: string;
  /** 请求方法 */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** 请求头 */
  headers?: Record<string, string>;
  /** 请求体数据 */
  data?: any;
  /** 请求超时时间（毫秒） */
  timeout?: number;
}

/**
 * HTTP响应接口
 */
export interface HttpResponse<T = any> {
  /** 响应数据 */
  data: T;
  /** 响应状态码 */
  status: number;
  /** 响应状态文本 */
  statusText: string;
  /** 响应头 */
  headers: Headers;
  /** 原始Response对象 */
  config: RequestConfig;
}

/**
 * HTTP错误类
 */
export class HttpError extends Error {
  public response?: {
    status: number;
    statusText: string;
    data: any;
  };
  
  public config?: RequestConfig;

  constructor(message: string, config?: RequestConfig, response?: { status: number; statusText: string; data: any }) {
    super(message);
    this.name = 'HttpError';
    this.config = config;
    this.response = response;
  }
}

/**
 * 创建基于fetch的HTTP客户端
 */
class FetchClient {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_BASE_URL || '/api';
    this.defaultTimeout = 30000; // 30秒超时
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * 请求拦截器：添加认证头和日志
   */
  private interceptRequest = (config: RequestConfig): RequestConfig => {
    // 开发环境打印请求信息
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: `${this.baseURL}${config.url}`,
        data: config.data,
      });
    }

    // 添加认证头
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  };

  /**
   * 响应拦截器：处理响应和错误
   */
  private interceptResponse = async <T>(
    response: Response, 
    config: RequestConfig
  ): Promise<HttpResponse<T>> => {
    const contentType = response.headers.get('content-type');
    let data: any;

    // 根据内容类型解析响应
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    const httpResponse: HttpResponse<T> = {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config,
    };

    // 开发环境打印响应信息
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ API Response:', {
        status: response.status,
        url: config.url,
        data: httpResponse.data,
      });
    }

    // 检查响应状态
    if (!response.ok) {
      // 开发环境打印错误信息
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ API Error:', {
          status: response.status,
          url: config.url,
          data: httpResponse.data,
        });
      }

      // 统一错误处理
      switch (response.status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('权限不足');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        default:
          console.error('请求失败:', data?.msg || response.statusText);
      }

      throw new HttpError(
        data?.msg || response.statusText || `HTTP Error ${response.status}`,
        config,
        {
          status: response.status,
          statusText: response.statusText,
          data: httpResponse.data,
        }
      );
    }

    return httpResponse;
  };

  /**
   * 处理请求超时
   */
  private createTimeoutPromise = (timeout: number): Promise<never> => {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new HttpError('请求超时', undefined, undefined));
      }, timeout);
    });
  };

  /**
   * 发送HTTP请求
   */
  private async request<T = any>(config: RequestConfig): Promise<HttpResponse<T>> {
    // 请求拦截
    const interceptedConfig = this.interceptRequest(config);
    
    // 构建完整URL
    const url = `${this.baseURL}${interceptedConfig.url}`;
    
    // 构建请求选项
    const fetchOptions: RequestInit = {
      method: interceptedConfig.method || 'GET',
      headers: {
        ...this.defaultHeaders,
        ...interceptedConfig.headers,
      },
      credentials: 'same-origin',
    };

    // 添加请求体（仅对非GET请求）
    if (interceptedConfig.data && interceptedConfig.method !== 'GET') {
      if (typeof interceptedConfig.data === 'string') {
        fetchOptions.body = interceptedConfig.data;
      } else {
        fetchOptions.body = JSON.stringify(interceptedConfig.data);
      }
    }

    try {
      // 发送请求（带超时处理）
      const timeout = interceptedConfig.timeout || this.defaultTimeout;
      const fetchPromise = fetch(url, fetchOptions);
      const timeoutPromise = this.createTimeoutPromise(timeout);
      
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      
      // 响应拦截
      return await this.interceptResponse<T>(response, interceptedConfig);
    } catch (error: any) {
      // 开发环境打印错误信息
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ API Error:', {
          message: error.message,
          url: interceptedConfig.url,
        });
      }

      if (error instanceof HttpError) {
        throw error;
      }

      // 网络错误处理
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('网络连接失败 - 可能是CORS问题或服务器无响应');
        throw new HttpError('网络连接失败', interceptedConfig);
      }

      console.error('请求配置错误:', error.message);
      throw new HttpError(error.message || '请求失败', interceptedConfig);
    }
  }

  /**
   * GET请求
   */
  public async get<T = any>(url: string, config: Partial<RequestConfig> = {}): Promise<HttpResponse<T>> {
    return this.request<T>({
      ...config,
      url,
      method: 'GET',
    });
  }

  /**
   * POST请求
   */
  public async post<T = any>(url: string, data?: any, config: Partial<RequestConfig> = {}): Promise<HttpResponse<T>> {
    return this.request<T>({
      ...config,
      url,
      method: 'POST',
      data,
    });
  }

  /**
   * PUT请求
   */
  public async put<T = any>(url: string, data?: any, config: Partial<RequestConfig> = {}): Promise<HttpResponse<T>> {
    return this.request<T>({
      ...config,
      url,
      method: 'PUT',
      data,
    });
  }

  /**
   * DELETE请求
   */
  public async delete<T = any>(url: string, config: Partial<RequestConfig> = {}): Promise<HttpResponse<T>> {
    return this.request<T>({
      ...config,
      url,
      method: 'DELETE',
    });
  }

  /**
   * PATCH请求
   */
  public async patch<T = any>(url: string, data?: any, config: Partial<RequestConfig> = {}): Promise<HttpResponse<T>> {
    return this.request<T>({
      ...config,
      url,
      method: 'PATCH',
      data,
    });
  }
}

// 创建并导出客户端实例
const client = new FetchClient();

export default client;


