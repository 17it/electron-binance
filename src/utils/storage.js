
// localstorage用法, 支持key value 加密
import utils from './utils'

export function getStorage(key) {
  const encryptKey = utils.encrypt(key)
  const encryptValue = localStorage.getItem(encryptKey)
  if (!encryptValue) {
    return
  }
  const value = utils.decrypt(encryptValue)
  return JSON.parse(value)
}

export function setStorage(key, value) {
  if (!value) return
  const encryptKey = utils.encrypt(key)
  const encryptValue = utils.encrypt(JSON.stringify(value))
  localStorage.setItem(encryptKey, encryptValue)
}

export function removeStorage(key) {
  const encryptKey = utils.encrypt(key)
  localStorage.removeItem(encryptKey)
}

export function clearStorage() {
  localStorage.clear()
}
