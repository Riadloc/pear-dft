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
  isBindPayPassword: boolean;
  powers: number[];
}

interface StateInteface {
  isLoggedIn: boolean;
  isWalletFetched: boolean;
  userData: UserData;
  walletData: {
    balance: number;
  };
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
        isBindBank: false,
        isBindPayPassword: false,
        powers: []
      },
      walletData: {
        balance: 0
      }
    } as StateInteface
  },
  actions: {
    async getUserInfo() {
      try {
        const { data } = await getUserInfo()
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
