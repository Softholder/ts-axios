// 通过定义字符串字面量来约束method的值
export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

// 请求配置类型
export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
}

// 响应类型，通过泛型的方式支持多种类型,泛型的默认类型为any
export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

// axios函数返回对象类型
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

// Axios错误类型
export interface AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
}

// Axios接口
export interface Axios {
  // request方法进行了重载，但对外的接口保持一致；实现可兼容不同的接口调用
  // 泛型，请求值为什么类型，返回值均可拿到该类型
  // 通过泛型可以让自定义请求参数的类型，使其多样化
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

// 混合对象，既有属性方法又为函数类型
export interface AxiosInstance extends Axios {
  // 参数为AxiosRequestConfig类型的config，返回值为AxiosPromise类型
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  // 函数重载，第一个参数为url，第二个为可选的config
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}
