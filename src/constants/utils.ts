import dayjs from 'dayjs'
import { throttle } from 'lodash-es'

export function validatePassword(value: string): boolean | string {
  console.log(value)
  if (value) {
    const len = value.length
    if (len > 16 || len < 8) {
      return '密码长度范围8-16'
    }
    const regex = /^[a-zA-Z0-9-*/+.~!@#$%^&*()]+$/
    if (!regex.test(value)) {
      return '密码格式不正确，只能包含字母、数字以及字符'
    }
    return true
  }
  return false
}

export function datamask(phone: string) {
  if (phone) {
    return phone.slice(0, 3) + '****' + phone.slice(-4)
  }
  return ''
}

export function maskbank(bankNo: string) {
  if (bankNo) {
    return '**** ' + bankNo.slice(-4)
  }
  return ''
}

export function isPrice(val: string) {
  return /^\d+(\.\d{1,2})?$/.test(val)
}

export function setInviteCode() {
  const query = location.href.split('?')[1]
  if (query) {
    const searchParams = new URLSearchParams(query)
    if (searchParams.get('code')) {
      sessionStorage.setItem('inviteCode', searchParams.get('code') as string)
    }
  }
}

export function initLianlianKeyboard(props: any) {
  const svgPath = 'https://mpay-static.oss-cn-hangzhou.aliyuncs.com/html/lib/microdone/svg' // svg图片的地址
  const { inputId, random } = props
  if (typeof (window as any).kb === 'undefined') {
  // 键盘构造
    // eslint-disable-next-line new-cap
    (window as any).kb = new (window as any).keyBoard({
      chaosMode: 0, // 混乱模式,0:无混乱;1:打开时乱一次;2:每输入一个字符乱一次,默认值0
      pressStatus: 1, // 按键状态,0:按下、抬起按键无变化;1:按下、抬起按键的颜色变化,默认值0
      kbType: 1, // 键盘类型,0:全键盘;1:纯数字键盘,默认值0
      svg: svgPath,
      hasMap: '1', // 是否调用mapping值：当为1时调用，当为非1时，不调用
      license: random.license
    })
  }
  (window as any).BL.SV = svgPath
  if (!document.getElementById('testkbid')) {
    (window as any).kb.generate() // 键盘初始化
  }
  (window as any).passGuard.ib = random.map_arr
  if (typeof (window as any).passGuardKeyboard === 'undefined') {
  // 密码卫士构造
    // eslint-disable-next-line new-cap
    (window as any).passGuardKeyboard = new (window as any).passGuard({
      jump: 1,
      fixed: 'H5fixed', // 当fixed接口添加时，代表该输入框在fixed覆盖层上且覆盖层的ID为接口的值(在demo中覆盖层ID为"H5fixed")
      maxLength: 12, // 最大输入长度
      regExp1: '[\\S\\s]', // 输入过程限制的正则
      regExp2: '[a-zA-Z0-9]{6,12}',
      displayMode: 1, // 显示形式,0:星号;1:明文,默认值0
      callBack: () => {}, // 成功回调
      errorCallBack: () => {}, // 失败回调
      focus: () => {}, // H5键盘获取焦点回调
      blur: () => {}, // H5键盘失去焦点回调
      add: () => {},
      del: () => {},
      rsaPublicKey: random.rsa_public_content
    })
  }

  (window as any).passGuardKeyboard.generate(inputId, (window as any).kb, 'passGuardKeyboard', 0); // 密码卫士初始化
  (window as any).passGuardKeyboard.setRandKey(random.random_value) // 设置随机因子
  return {
  // 清空input的内容
    clearAllPwd() {
      (window as any).passGuardKeyboard.clearpwd()
    },
    // 获取所有密码输入的值
    getValue() {
      return new Promise((resolve) => {
        if ((window as any).passGuardKeyboard.getLength() === 0) {
          resolve('')
          return
        }
        if ((window as any).passGuardKeyboard.getValid() === 1) {
          resolve('')
          return
        }
        // ib is cleared after passGuardKeyboard.getOutput(), thus needs to be reassigned
        const password = (window as any).passGuardKeyboard.getOutput();
        (window as any).passGuard.ib = random.map_arr;
        (window as any).passGuardKeyboard.clearpwd()
        resolve(password)
      })
    }
  }
}

/** 加上时区的时间格式化 */
export function formatTimezoneDate(date: Date | number | string, format?: string) {
  return dayjs(date).add(8, 'hour').format(format || 'YYYY-MM-DD HH:mm:ss')
}

export function downloadFile(url: string, filename: string) {
  const eleLink = document.createElement('a')
  eleLink.download = filename
  eleLink.style.display = 'none'
  eleLink.href = url
  // 触发点击
  document.body.appendChild(eleLink)
  eleLink.click()
  // 然后移除
  document.body.removeChild(eleLink)
}

export function openLink(url: string, target = '_blank') {
  const eleLink = document.createElement('a')
  eleLink.style.display = 'none'
  eleLink.href = url
  eleLink.target = target
  // 触发点击
  document.body.appendChild(eleLink)
  eleLink.click()
  // 然后移除
  document.body.removeChild(eleLink)
}

export function debounce(fn: any) {
  return throttle(fn, 1000, { leading: true, trailing: false })
}
