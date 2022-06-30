import { defineStore } from 'pinia'

interface CacheState {
  query: string;
  sortObj: {
    id: string;
    value: string;
  }
}

export const useCacheStore = defineStore('cache', {
  state: () => {
    return {
      query: '',
      sortObj: {
        id: '',
        value: ''
      }
    } as CacheState
  },
  actions: {
    setCache(key: keyof CacheState, value: any) {
      this[key] = value
    },
    getCache(key: keyof CacheState): any {
      return this[key]
    }
  }
})
