import request from '@/assets/request'

export function createPaymentOrder(data: any) {
  return request.post('payment/create', data)
}

export function createSecondaryPaymentOrder(data: any) {
  return request.post('payment/secondary/create', data)
}

export function cancelPaymentOrder(data: any) {
  return request.post('payment/cancel', data)
}

export function createPayment(data: any) {
  return request.post('payment/purchase', data)
}

export function checkPaymentOrder(tradeNo: string) {
  return request.get('payment/check', {
    params: {
      tradeNo
    }
  })
}
