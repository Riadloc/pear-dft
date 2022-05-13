import request from '@/assets/request'

export function postLogin(data: any) {
  return request.post('/user/login', data)
}

export function postSignup(data: any) {
  return request.post('/user/singup', data)
}

export function postSendSms(data: any) {
  return request.post('/user/send_sms', data)
}

export function certifyUser(data: any) {
  return request.post('/user/certify', data)
}

export function getUserInfo(userId: string) {
  return request.get('/user', {
    params: {
      userId
    }
  })
}

export function updateUserInfo(userId: string | number, data: any) {
  return request.put(`/user/${userId}`, data)
}

export function getMyInvitaions() {
  return request.get('/user/invitation')
}

export function getCaptchaSvg() {
  return request.get('/user/captcha')
}

export function validateCaptcha(code: string) {
  return request.post('/user/captcha/validate', { captchaCode: code })
}

export function sendEmailCode(data: any) {
  return request.post('/user/mail/code', data)
}

export function verifyEmailCode(data: any) {
  return request.post('/user/mail/verify', data)
}
