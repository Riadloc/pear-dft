import request from '@/assets/request'

export function createPaymentOrder(goodId: string) {
  return request.post('payment/create', { goodId })
}

export function checkPaymentOrder(tradeNo: string) {
  return request.get('payment/check', {
    params: {
      tradeNo
    }
  })
}
