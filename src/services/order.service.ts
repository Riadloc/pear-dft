import request from '@/assets/request'

export function getOrderList(params: any) {
  return request.get('order/list', { params })
};

export function getOrderDetail(params: any) {
  return request.get('order/detail', { params })
};
