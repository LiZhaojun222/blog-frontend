// src/components/AuthGuard.jsx 路由守卫
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const AuthGuard = ({ children }) => {
    const token = localStorage.getItem('token')
    const location = useLocation()

    if (!token) {
        // 未登录，跳转到登录页，并记录当前路径
        return <Navigate to="/login" state={{ from: location.pathname }} replace />
    }

    return children
}

export default AuthGuard