import axios, { AxiosResponse } from 'axios'
import Qs from 'qs'
import { Toast } from 'vant'
import { BASE_URL } from './config'

interface Response {
  code: number;
  data: Record<string, any>;
  msg: string;
}

const request = axios.create({
  baseURL: (import.meta.env.PROD ? BASE_URL.PROD : BASE_URL.DEV) + '/api',
  paramsSerializer: function(params) {
    return Qs.stringify(params, { arrayFormat: 'brackets' })
  },
  withCredentials: true,
  validateStatus: function(status) {
    return status >= 200 && status < 500
  },
  timeout: 30000
})

request.interceptors.request.use(function(config) {
  return config
}, function(error) {
  return Promise.reject(error)
})

request.interceptors.response.use(function(response: AxiosResponse<Response>) {
  const { data } = response
  console.log(response.status)
  switch (response.status) {
    case 401:
      Toast('还未登录')
      history.replaceState(null, '', '/login')
      break
    case 403:
      Toast('被禁止的请求')
      break
  }
  return data
}, function(error) {
  return Promise.reject(error)
})

export default request
