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
  // transformRequest允许在将请求数据发送到服务器之前对其进行修改，只适用于请求方法put、post和patch
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  // transformResponse允许在把响应数据传递给then或者catch之前对它们进行修改
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  // 添加cancelToken属性，传入时可取消请求
  cancelToken?: CancelToken
  // 跨域请求携带cookie时为true
  withCredentials?: boolean
  // 存储token的cookie名称
  xsrfCookieName?: string
  // 请求headers中token对应的header名称
  xsrfHeaderName?: string
  // 下载进度监控
  onDownloadProgress?: (e: ProgressEvent) => void
  // 上传进度监控
  onUploadProgress?: (e: ProgressEvent) => void
  // 授权
  auth?: AxiosBasicCredentials
  // 验证状态码是否合法
  validateStatus?: (status: number) => boolean
  // 自定义参数序列化
  paramsSerializer?: (params: any) => string
  // 若配置baseURL则后续传入的相对路径会与之拼接成为绝对路径
  baseURL?: string

  [propName: string]: any
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
  defaults: AxiosRequestConfig
  // 接口定义添加interceptors定义
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }

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

  // getUri方法在不发送请求的前提下根据传入的配置返回一个 url
  getUri(config: AxiosRequestConfig): string
}

// 混合对象，既有属性方法又为函数类型
export interface AxiosInstance extends Axios {
  // 参数为AxiosRequestConfig类型的config，返回值为AxiosPromise类型
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  // 函数重载，第一个参数为url，第二个为可选的config
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

// 创建Axios对象的静态方法
export interface AxiosClassStatic {
  new (config: AxiosRequestConfig): Axios
}

// Axios静态方法接口类型，创建Axios实例
export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance

  // 扩展静态方法
  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (value: any) => boolean
  // all方法一次调用多个请求函数（是Promise.all的封装，它返回的是一个Promise数组）
  all<T>(promises: Array<T | Promise<T>>): Promise<T[]>
  // spread方法接收一个函数，返回一个新的函数，新函数的结构满足 `then` 函数的参数结构
  // T为参数类型，R为返回值类型
  spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R
  // 返回Axios对象的静态方法
  Axios: AxiosClassStatic
}

// 拦截器接口类型
export interface AxiosInterceptorManager<T> {
  // 创建一个拦截器时，返回的是其id
  // rejected为可选参数
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number
  // 根据id删除拦截器
  eject(id: number): void
}

// resolved函数类型，可能为请求AxiosRequest或响应AxiosResponse的拦截
export interface ResolvedFn<T> {
  // 同步返回类型为T，异步返回类型为Promise<T>
  (val: T): T | Promise<T>
}

// rejected函数类型
export interface RejectedFn {
  (error: any): any
}

// transformRequest和transformResponse的接口类型
export interface AxiosTransformer {
  (data: any, headers?: any): any
}

// CancelToken实例类型的接口定义
export interface CancelToken {
  promise: Promise<Cancel>
  // reason是传递给promise中resolve函数的参数值
  reason?: Cancel

  throwIfRequested(): void
}

// 取消方法的接口定义
export interface Canceler {
  (message?: string): void
}

// CancelToken类构造函数参数的接口定义
export interface CancelExecutor {
  (cancel: Canceler): void
}

// CancelToken类静态方法source函数的返回值类型
export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

// CancelToken类的类类型
export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken
  source(): CancelTokenSource
}

// 实例类型的接口定义
export interface Cancel {
  message?: string
}

// 类类型的接口定义
export interface CancelStatic {
  new (message?: string): Cancel
}

export interface AxiosBasicCredentials {
  username: string
  password: string
}
