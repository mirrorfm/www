import axios from 'axios'
import { getIdToken } from './lib/auth'

export const siteMetadata = {
  title: 'Mirror.FM',
  description: 'Mirroring songs between music services',
  author: '@mirror_fm',
}

export const API_URL = import.meta.env.VITE_API_URL

export const api = axios.create({ baseURL: API_URL })

api.interceptors.request.use(async (config) => {
  const token = await getIdToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      error.rateLimited = true
    }
    return Promise.reject(error)
  },
)
