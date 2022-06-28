import request from '@/assets/request'

export function createGood(data: any) {
  return request.post('goods/create', data)
}

export function getGoodDetail(params: any) {
  return request.get('goods/detail', { params })
}

export function getFluxGoodDetail(params: any) {
  return request.get('goods/flux/detail', { params })
}

export function getGoodsList(params: any) {
  return request.get('goods', { params })
}

export function getFilterGoodsList(params: any) {
  return request.get('goods/list/filter', { params })
}

export function getMarketGoodList(params: any) {
  return request.get('goods/market', { params })
}

export function getMyGoodList(params: any) {
  return request.get('goods/collect', { params })
}

export function getMyGoodSnsList(params: any) {
  return request.get('goods/collect/sns', { params })
}

export function putItOnMarket(data: any) {
  return request.put('goods/market/puton', data)
}

export function putItOffMarket(data: any) {
  return request.put('goods/market/putoff', data)
}

export function openBox(data: any) {
  return request.post('goods/openBox', data)
}

export function getComposeList(params: any) {
  return request.get('/goods/compose/list', { params })
}

export function getComposeDetail(params: any) {
  return request.get('/goods/compose/detail', { params })
}

export function getMyMaterials(params: any) {
  return request.get('/goods/compose/materials', { params })
}

export function composeMaterials(data: any) {
  return request.post('/goods/compose', data)
}
