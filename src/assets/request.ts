import { genSignature } from '@/constants/utils'
import axios, { AxiosResponse } from 'axios'
import Qs from 'qs'
import { Toast } from 'vant'

interface Response {
  code: number;
  data: Record<string, any>;
  msg: string;
}

const request = axios.create({
  baseURL: window.location.protocol + (import.meta.env.PROD ? import.meta.env.VITE_BASEURL_PROD : import.meta.env.VITE_BASEURL_DEV) + '/api',
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
  const { data } = config
  if (data && typeof data === 'object') {
    const sign = genSignature(data);
    (config.headers as any).common.Authorization = sign
  }
  return config
}, function(error) {
  return Promise.reject(error)
})

request.interceptors.response.use(function(response: AxiosResponse<Response>) {
  const { data: res } = response
  switch (response.status) {
    case 401:
      Toast('还未登录')
      location.replace('/login')
      break
    case 403:
      Toast('被禁止的请求')
      break
    case 429:
      Toast('请求太过频繁，请稍后重试')
      break
  }
  let { data } = res
  try {
    data = data && typeof data === 'string' ? JSON.parse(decodeURIComponent(window.atob(data))) : data
  } catch (error) {
    //
  }
  return {
    ...res,
    data
  }
}, function(error) {
  return Promise.reject(error)
})

export default request
