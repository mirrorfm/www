import axios from 'axios'

export const siteMetadata = {
  title: 'Mirror.FM',
  description: 'Mirroring songs between music services',
  author: '@mirror_fm',
}

export const API_URL = import.meta.env.VITE_API_URL

export const api = axios.create({ baseURL: API_URL })

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      error.rateLimited = true
    }
    return Promise.reject(error)
  },
)
