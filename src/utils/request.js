// src/utils/request.js
import axios from 'axios'
import { message } from 'antd'

const request = axios.create({
    baseURL: import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL}/api`
        : '/api',
    timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
    config => {
        // 自动添加 Token
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
    response => {
        const res = response.data
        
        // 如果 code 不是 200，说明有错误
        if (res.code !== 200) {
            message.error(res.message || '请求失败')
            return Promise.reject(new Error(res.message))
        }
        return res
    },
    error => {
        // 401 未登录
        if (error.response?.status === 401) {
            message.error('登录已过期，请重新登录')
            localStorage.removeItem('token')
            window.location.href = '/login'
        } else {
            message.error(error.message || '网络错误')
        }
        return Promise.reject(error)
    }
)

export default request
