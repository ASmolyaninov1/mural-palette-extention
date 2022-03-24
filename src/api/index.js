import * as paletteApi from './palette'
import * as userApi from './user'
import axios from "axios"

axios.interceptors.request.use(function (config) {
  return {
    ...config,
    headers: {
      ...config.headers,
      'X-Parse-Application-Id': 'b334e60e0d3181d1bf0f544a9f4c4caf',
      'X-Parse-Master-Key': '0b31d1d5f133ddd9333232396daba892',
      'Content-Type': 'application/json',
      'username': localStorage.getItem('muralUsername') || ''
    }
  }
}, function (err) {
  return Promise.reject(err)
})

const PROD_API_URL = 'https://163.ignite.getforge.com'
const DEV_API_URL = 'http://localhost:1337'

const API_URL = process.env.NODE_ENV === 'production' ? PROD_API_URL : DEV_API_URL
export {
  API_URL,
  paletteApi,
  userApi
}