import axios, { Cancel, Canceler } from '../../src/index'

const CancelToken = axios.CancelToken
const source = CancelToken.source()

// 每个路由都需要1秒才能响应请求
axios.get('/cancel/get', {
  cancelToken: source.token
}).catch(function(e) {
  // 通过Promise的reject函数将message传递出去，catch中可捕获到
  if(axios.isCancel(e)) {
    console.log('Request canceled get1', e.message)
  }
})


setTimeout(() => {
  // 取消get请求
  source.cancel('Operation canceled by the user.')

  setTimeout(() => {
    // cancel方法已执行过，该post请求发不出去
  axios.post('/cancel/post', {a: 1}, {
    cancelToken: source.token 
  }).catch(function(e) {
    if(axios.isCancel(e)) {
      console.log(e.message, 'post')
    }
  })
  }, 100)
}, 100)

let cancel: Canceler

axios
  .get('/cancel/get', {
    // 实例化CancelToken，将executor赋值给cancel
    cancelToken: new CancelToken(c => {
      cancel = c
    })
  })
  .catch(function(e) {
    if (axios.isCancel(e)) {
      console.log('Request canceled get2')
    }
  })

// 调用cancel方法取消请求
setTimeout(() => {
  cancel()
}, 500)