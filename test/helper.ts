export function getAjaxRequest(): Promise<JasmineAjaxRequest> {
  return new Promise(function(resolve) {
    setTimeout(() => {
      // 拿到最近一次请求的request对象
      // 该request对象是jasmine-ajax库伪造的xhr对象，模拟了xhr对象上的方法
      // 如request.respondWith方法返回一个响应
      return resolve(jasmine.Ajax.requests.mostRecent())
    }, 0)
  })
}
