import axios from '../../src/index'

// 请求拦截器返回结果中config.headers.test应为321，因为请求拦截器执行顺序与添加顺序相反
axios.interceptors.request.use(config => {
  config.headers.test += '1'
  return config
})
axios.interceptors.request.use(config => {
  config.headers.test += '2'
  return config
})
axios.interceptors.request.use(config => {
  config.headers.test += '3'
  return config
})

// 响应拦截器返回结果中res.data应为hello13，因为响应拦截器执行顺序与添加顺序相同
axios.interceptors.response.use(res => {
    res.data += '1'
    return res
})
let interceptor = axios.interceptors.response.use(res => {
    res.data += '2'
    return res
})
axios.interceptors.response.use(res => {
    res.data += '3'
    return res
})

// 根据id删除拦截器
axios.interceptors.response.eject(interceptor)

axios({
  url: '/interceptor/get',
  method: 'get',
  headers: {
    test: ''
  }
}).then((res) => {
  console.log(res.data)
})