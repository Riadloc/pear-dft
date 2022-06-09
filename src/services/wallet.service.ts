import request from '@/assets/request'

export function topUpService(data: any) {
  return request.post('/wallet/lianlian/topup', data)
}

export function createPayAccount(data: any) {
  return request.post('/wallet/account/create', data)
}

export function checkBankCardStat(cardNo: string) {
  return request.get('https://ccdcapi.alipay.com/validateAndCacheCardInfo.json', {
    params: {
      cardNo,
      cardBinCheck: 'true',
      // eslint-disable-next-line camelcase
      _input_charset: 'utf-8'
    },
    withCredentials: false,
    headers: {
      origin: 'https://ccdcapi.alipay.com',
      referer: 'https://ccdcapi.alipay.com'
    }
  })
}

export function onTrade(data: any) {
  return request.post('/wallet/trade', data)
}

export function onDrawcash(data: any) {
  return request.post('/wallet/drawcash', data)
}

export function getWalletRecords(params: any) {
  return request.get('/wallet/records', { params })
}

export function getWalletInfo() {
  return request.get('/wallet/info')
}

export function onBankBind(data: any) {
  return request.post('/wallet/bank/bind', data)
}

export function checkLianlianSms(data: any) {
  return request.post('/wallet/lianlian/checksms', data)
}

export function getLianlianRandomKey(data: any) {
  return request.post('/wallet/lianlian/random', data)
}

export function applyBindCodeWithPhone(data: any) {
  return request.post('/wallet/lianlian/bindphone/send', data)
}

export function checkBindCodeWithPhone(data: any) {
  return request.post('/wallet/lianlian/bindphone/check', data)
}

export function applyLianlianUser(data: any) {
  return request.post('/wallet/lianlian/user/apply', data)
}

export function checkLianlianUser(data: any) {
  return request.post('/wallet/lianlian/user/check', data)
}

export function checkBindCodeWithBank(data: any) {
  return request.post('/wallet/lianlian/bindbank/check', data)
}
