import { defineStore } from 'pinia'
import { getUserInfo } from '@/services/user.service'
import { getWalletInfo } from '@/services/wallet.service'
import { LianlianSteps } from '@/constants/enums'

interface UserData {
  id: number;
  userId: number;
  nickname: string;
  phone: string;
  email: string;
  certified: 0 | 1;
  metaAccount: string,
  isBindPayPassword: boolean;
  powers: number[];
  role: number;
}

interface WalletData {
  balance: number;
  step: LianlianSteps;
  realName: string;
  idNo: string;
  bankCards: Array<{
    id: string;
    realName: string;
    bankNo: string;
    idNo: string;
    phone: string;
    status: number;
    createdAt: string;
  }>
}

interface StateInteface {
  isLoggedIn: boolean;
  isWalletFetched: boolean;
  userData: UserData;
  walletData: WalletData;
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
        isBindPayPassword: false,
        powers: [],
        role: 0
      },
      walletData: {
        balance: 0,
        step: 0,
        realName: '',
        idNo: '',
        bankCards: []
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
