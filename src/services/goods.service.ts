import request from '@/assets/request'

export function createGood(data: any) {
  return request.post('goods/create', data)
}

export function getGoodDetail(params: any) {
  return request.get('goods/detail', { params })
}

export function getGoodsList(params: any) {
  return request.get('goods', { params })
}

export function getMyGoodList(params: any) {
  return request.get('goods/collect', { params })
}
