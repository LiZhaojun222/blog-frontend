// src/components/Layout/index.jsx
import React from 'react'
import { Layout as AntLayout, Menu, Button, message } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
    HomeOutlined,
    FileTextOutlined,
    TagsOutlined,
    FolderOutlined,
    UserOutlined,
    LogoutOutlined
} from '@ant-design/icons'
import './layout.css'

const { Header, Sider, Content } = AntLayout

const Layout = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const menuItems = [
        { key: '/', icon: <HomeOutlined />, label: '首页' },
        { key: '/article', icon: <FileTextOutlined />, label: '文章管理' },
        { key: '/category', icon: <FolderOutlined />, label: '分类管理' },
        { key: '/tag', icon: <TagsOutlined />, label: '标签管理' },
        { key: '/profile', icon: <UserOutlined />, label: '个人中心' }
    ]

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        message.success('已退出登录')
        navigate('/login')
    }

    return (
        <AntLayout style={{ minHeight: '100vh' }}>
            <Sider theme="dark" width={200}>
                <div className="logo">📝 博客管理</div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                />
            </Sider>
            <AntLayout>
                <Header className="header">
                    <div className="header-title">博客管理系统</div>
                    <div className="header-user">
                        {JSON.parse(localStorage.getItem('user') || '{}').nickname}
                    </div>
                    <Button icon={<LogoutOutlined />} onClick={handleLogout}>
                        退出
                    </Button>
                </Header>
                <Content className="content">
                    <Outlet />
                </Content>
            </AntLayout>
        </AntLayout>
    )
}

export default Layout