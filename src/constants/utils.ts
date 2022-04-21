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
