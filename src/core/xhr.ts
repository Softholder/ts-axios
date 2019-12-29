import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/util'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  // 返回Promise对象，使得调用时可以使用then方法
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config

    // 创建request实例
    const request = new XMLHttpRequest()

    // 打开url，做初始化，默认async参数为true，即异步请求
    request.open(method.toUpperCase(), url!, true)

    // 配置请求
    configureRequest()

    // 添加事件
    addEvents()

    // 处理请求headers
    processHeaders()

    // 处理取消请求逻辑
    processCancel()

    // 发送请求数据
    request.send(data)

    // 配置request的函数
    function configureRequest(): void {
      // 若请求配置中responseType存在，将其赋值给请求头
      if (responseType) {
        request.responseType = responseType
      }

      // 设置超时时间
      if (timeout) {
        request.timeout = timeout
      }

      // 设置跨域请求是否携带cookie
      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }

    // 添加事件的函数
    function addEvents(): void {
      request.onreadystatechange = function handleLoad() {
        // readyState为4表示能正确接收，不是4直接return
        if (request.readyState !== 4) {
          return
        }

        // 当放生网络错误或超时错误时，status为0
        if (request.status === 0) {
          return
        }

        // 解析响应头
        const responseHeaders = parseHeaders(request.getAllResponseHeaders())
        // 响应数据
        const responseData = responseType !== 'text' ? request.response : request.responseText
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        }
        handleResponse(response)
      }

      // 处理网络错误
      request.onerror = function handleError() {
        // error事件触发时获取不到response，因此不传
        reject(createError('Network Error', config, null, request))
      }

      // 处理超时
      request.ontimeout = function handleTimeout() {
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
      }

      // 在发送请求前，给xhr对象添加属性
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      // 通过xhr对象提供的progress事件对数据的下载进度做监控
      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    // 处理headers的函数
    function processHeaders(): void {
      // 如果请求的数据是FormData类型，应主动删除请求headers中的Content-Type字段，让浏览器自动根据请求数据设置
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      // 通过xhr.uplaod对象提供的progress事件对上传进度做监控
      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)
        // 若读取到token将其添加到请求headers中
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }

      // 如果存在auth，将其加密后添加到headers上
      if (auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }

      Object.keys(headers).forEach(name => {
        // 当data为null时不设置content-type
        if (data === null && name.toLocaleLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          // 根据传入的配置参数设置请求头格式
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    // 处理取消请求的函数
    function processCancel(): void {
      // config中存在cancelToken时取消请求
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          // 取消请求
          request.abort()
          // 通过promise的reject函数将reason传出，catch时可捕获到错误
          reject(reason)
        })
      }
    }

    function handleResponse(response: AxiosResponse): void {
      // status介于200到300之间，表示成功的请求
      // if (response.status >= 200 && response.status < 300) {
      // 如果没有validateStatus规则认为所有响应都是正确的响应
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
