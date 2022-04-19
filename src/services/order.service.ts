import request from '@/assets/request'

export function getOrderList(params: any) {
  return request.get('order/list', { params })
};
