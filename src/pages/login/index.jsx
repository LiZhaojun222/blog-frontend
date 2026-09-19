import React,{ useState } from "react";
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate, useLocation  } from 'react-router-dom'
import { login } from '../../api'
import './login.css'


const Login = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const [loading, setLoading] = useState(false)
    const from = location.state?.from || '/'

    const handleSubmit = async (values) => {
        setLoading(true)
        try {
            const res = await login(values)
            // 保存 Token
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            message.success('登录成功')
            navigate(from, { replace: true })  // ← 跳回原页面
        } catch (error) {
            console.error('登录失败：', error)
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="login-container">
             <div className="login-box">
                <h1 className="login-title">📝 博客管理系统</h1>
                <Form name="login" onFinish={handleSubmit} size="large">
                    <Form.Item name="username" rules={[{ required : true, message: '请输入用户名'}]}>
                        <Input prefix={<UserOutlined />} placeholder="用户名">
                        </Input>
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required : true, message: '请输入密码'}]}>
                        <Input.Password prefix={<LockOutlined />}></Input.Password>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>登录</Button>
                    </Form.Item>
                </Form>
             </div>
        </div>
    )
}

export default Login