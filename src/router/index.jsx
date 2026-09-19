// src/router/index.jsx
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from '../pages/login'
import Layout from '../components/Layout'
import Home from '../pages/home'
import AuthGuard from '../components/AuthGuard'
import Article from '../pages/article'  
import ArticleDetail from '../pages/article/ArticleDetail'
import Category from '../pages/category'
import Profile from '../pages/profile'

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/',
        element: (
            <AuthGuard>
                <Layout />
            </AuthGuard>
        ),
        children: [
            { index: true, element: <Home /> },
            { path: 'article', element: <Article /> },
            { path: 'article/:id', element: <ArticleDetail /> },
            { path: 'category', element: <Category />},
            { path: 'tag', element: <div>标签管理（待开发）</div> },
            { path: 'profile', element: <Profile /> }
        ]
    },
    {
        path: '*',
        element: <Navigate to="/" replace />
    }
])

export default router