import axios from '../../src/index'
import qs from 'qs'

axios.defaults.headers.common['test2'] = 123

axios({
  url: '/config/post',
  method: 'post',
  // 将对象格式化为querystring通过formdata的方式提交
  data: qs.stringify({
    a: 1
  }),
  headers: {
      test: '321'
  }
}).then((res) => {
  console.log(res.data)
})