import axios from 'axios'

const sutepaApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`
})

sutepaApi.interceptors.request.use(config => {
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }

  return config
})

export default sutepaApi
