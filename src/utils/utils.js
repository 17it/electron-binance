import CryptoJS from 'crypto-js'
import store from '../store'
// window.btoa("imeik_fe")
const aseKey = 'aW1laWtfZmU='

export default {
  // 正则匹配
  delUrlParam(name) {
    // 从当前URL的?号开始的字符串
    const queryStr = window.location.search.substr(1)
    // 如果没有参数则返回空
    if (queryStr !== undefined) {
      const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      return queryStr.replace(reg, '')
    }
    return ''
  },

  getOptionsItemByValue(optionKey, value) {
    const enums = store.getters.enums
    let result = {}
    const options = enums[optionKey] || []
    if (!options || options.length === 0) {
      return result
    }
    for (let i = 0; i < options.length; i++) {
      const item = options[i]
      if (item.value === value + '') {
        result = item
      }
    }
    return result
  },

  findItemByProp(prop, items) {
    const item = items.find(item => item.prop === prop)
    return item
  },

  launchIntoFullscreen(element) {
    const fsElement = element || document.documentElement
    if (fsElement.requestFullscreen) {
      fsElement.requestFullscreen()
    } else if (fsElement.mozRequestFullScreen) {
      fsElement.mozRequestFullScreen()
    } else if (fsElement.webkitRequestFullscreen) {
      fsElement.webkitRequestFullscreen()
    } else if (fsElement.msRequestFullscreen) {
      fsElement.msRequestFullscreen()
    }
  },

  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  },

  getFullscreenElement() {
    const fullscreenEle = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement
    return fullscreenEle
  },

  /***
   * 加密
   */
  encrypt(message) {
    const result = CryptoJS.AES.encrypt(message, CryptoJS.enc.Utf8.parse(aseKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString()
    return result
  },

  /***
   * 解密
   */
  decrypt(message) {
    const result = CryptoJS.AES.decrypt(message, CryptoJS.enc.Utf8.parse(aseKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8)
    return result
  },

  // 金额格式化
  formatMoney(str) {
    try {
      str = parseFloat(str)
    } catch (e) {
      str = 0
    }

    const yi = 100000000
    const wan = 10000
    if (str / yi >= 1) {
      return this.numberThousandth((str / yi).toFixed(1)) + '亿'
    }

    if (str / wan >= 1) {
      return this.numberThousandth((str / wan).toFixed(1)) + '万'
    }

    return str
  },

  /***
   * 格式化数字,默认保留一位小数,如果是0则不保留小数
   */
  toFixed(str, num = 1) {
    try {
      str = parseFloat(str)
    } catch (e) {
      str = 0
    }
    if (str === 0) {
      return '0'
    } else {
      return str.toFixed(num)
    }
  },

  // 金额千分位展示
  numberThousandth(num) {
    const nums = num.toString().split('.')
    const rd = nums[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,')

    return `${rd}${nums[1] ? ('.' + nums[1]) : ''}`
  },

  // 百分百格式化 - 保留一位小数，如果没有数据返回 Na
  rateText(text) {
    if (text === '-' || text === 'Na' || text === null) {
      return 'Na'
    }

    return Math.abs(text).toFixed(1) + '%'
  },

  /**
   * 判断是否拥有权限
   */
  hasPermission(permission) {
    const permissions = store.getters.permissions
    return permissions.includes(permission)
  },

  /**
   * 导出excel等操作会用到
   * @param blob
   * @param name
   */
  blobToFile(blob, name) {
    const url = window.URL.createObjectURL(blob)
    const downloadElement = document.createElement('a')
    downloadElement.href = url
    downloadElement.download = name // 下载后文件名
    document.body.appendChild(downloadElement)
    downloadElement.click() // 点击下载
    document.body.removeChild(downloadElement) // 下载完成移除元素
    window.URL.revokeObjectURL(url) // 释放掉blob对象
  },

  /**
   * 获取文件链接文件名
   */
  getFileUrlName(url) {
    const name = url.substring(url.lastIndexOf('/') + 1)
    return decodeURIComponent(name)
  },

  /**
   * 删除url上的某个参数
   * url 需要去掉参数的url
   * paramName 需要去掉的参数名
   */
  removeUrlParam(url, paramName) {
    // 通过正则表达式去掉参数名和参数值
    const regex = new RegExp('[?&]' + paramName + '=([^&]*)')
    let newUrl = url.replace(regex, '')

    // 如果去掉参数后URL末尾是"?"或"&"，需要去掉它们
    newUrl = newUrl.replace(/[?&]$/, '')

    return newUrl
  }
}
