import { defineStore } from 'pinia'
import { getUserInfo } from '@/services/user.service'

interface UserData {
  id: number;
  userId: number;
  nickname: string;
  phone: string;
}

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      isLoggedIn: false,
      userData: {
        id: 0,
        userId: 0,
        nickname: '',
        phone: ''
      }
    }
  },
  actions: {
    async getUserInfo(id: string) {
      try {
        const { data } = await getUserInfo(id)
        this.userData = data
        this.isLoggedIn = true
        return true
      } catch (error) {
        return false
      }
    },
    setUserInfo(data: UserData) {
      this.userData = data
      this.isLoggedIn = true
    }
  }
})
