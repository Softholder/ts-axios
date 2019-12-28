import { CancelExecutor, CancelTokenSource, Canceler } from '../types'

interface ResolvePromise {
  (reason?: string): void
}

export default class CancelToken {
  promise: Promise<string>
  reason?: string

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    // 先实例化一个pending状态的Promise
    this.promise = new Promise<string>(resolve => {
      resolvePromise = resolve
    })

    executor(message => {
      // 当this.reason存在时退出执行，保证只执行一次
      if (this.reason) {
        return
      }
      this.reason = message
      // 将Promise从pending状态改变为resolved状态
      resolvePromise(this.reason)
    })
  }

  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      token
    }
  }
}
