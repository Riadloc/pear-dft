import request from '@/assets/request'

export function createPaymentOrder(data: any) {
  return request.post('payment/create', data)
}

export function checkCanCreateOrder(params: any) {
  return request.get('payment/create/check', { params })
}

export function cancelPaymentOrder(data: any) {
  return request.post('payment/cancel', data)
}

export function checkPaymentOrder(tradeNo: string) {
  return request.get('payment/check', {
    params: {
      tradeNo
    }
  })
}
