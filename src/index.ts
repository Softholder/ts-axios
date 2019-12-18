import { AxiosRequestConfig } from './types'
import xhr from './xhr'

// 通过AxiosRequestConfig接口来约束config的类型
function axios(config: AxiosRequestConfig): void {
  xhr(config)
}

export default axios
