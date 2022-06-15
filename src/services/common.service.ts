import request from '@/assets/request'

export function getRankList(params: any) {
  return request.get('common/rank', { params })
}
