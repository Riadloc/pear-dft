import request from '@/assets/request'

export function topUpService(data: any) {
  return request.post('/wallet/topup', data)
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
