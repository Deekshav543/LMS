import axios from 'axios'

const api = axios.create({
  baseURL: 'https://lms-ho73.onrender.com/api',
  withCredentials: true,
})

// Centralized interceptor to handle JWT authorization header on all outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
