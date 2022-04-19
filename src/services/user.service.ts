import request from '@/assets/request'

export function postLogin(data) {
  return request.post('/user/login', data)
}

export function postSignup(data) {
  return request.post('/user/singup', data)
}

export function postSendSms(data) {
  return request.post('/user/send_sms', data)
}

export function getUserInfo(userId: string) {
  return request.get('/user', {
    params: {
      userId
    }
  })
}
