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

export function isPrice(val: string) {
  return /^\d+(\.\d{1,2})?$/.test(val)
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
