import { AxiosTransformer } from '../types'

// 第三个参数fns代表一个或者多个转换函数
export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  // 若fns不存在直接返回data
  if (!fns) {
    return data
  }
  // 若fns不为数组将其转换为数组，方便后续的遍历
  if (!Array.isArray(fns)) {
    fns = [fns]
  }
  // 遍历转换函数数组，将每个转换函数的处理结果返回作为下一个函数的参数传入，实现管道式和链式调用
  fns.forEach(fn => {
    data = fn(data, headers)
  })
  return data
}
