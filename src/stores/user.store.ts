import { defineStore } from 'pinia'
import { getUserInfo } from '@/services/user.service'
import { getWalletInfo } from '@/services/wallet.service'

interface UserData {
  id: number;
  userId: number;
  nickname: string;
  phone: string;
  email: string;
  certified: 0 | 1;
  metaAccount: string,
  isBindBank: boolean;
}

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      isLoggedIn: false,
      isWalletFetched: false,
      userData: {
        id: 0,
        userId: 0,
        nickname: '',
        phone: '',
        email: '',
        certified: 0,
        metaAccount: '',
        isBindBank: false
      },
      walletData: {
        balance: 0
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
    },
    async getWalletInfo() {
      try {
        const { data } = await getWalletInfo()
        this.isWalletFetched = true
        this.walletData = data
        return true
      } catch (error) {
        return false
      }
    }
  }
})
