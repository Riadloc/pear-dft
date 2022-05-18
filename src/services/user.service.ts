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

export function getUserInfo() {
  return request.get('/user')
}

export function updateUserInfo(userId: string | number, data: any) {
  return request.put(`/user/info/${userId}`, data)
}

export function forgotPassword(data: any) {
  return request.put('/user/password', data)
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

export function setPayPassword(data: any) {
  return request.post('/user/paysafety/set', data)
}

export function checkPayPassword(params: any) {
  return request.get('/user/paysafety/check', { params })
}
