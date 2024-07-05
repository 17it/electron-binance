import Cookies from 'js-cookie'

export const TokenKey = process.env.VUE_APP_TOKEN_KEY

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
