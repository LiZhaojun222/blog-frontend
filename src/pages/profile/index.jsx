// src/pages/profile/index.jsx
import React, { useState, useEffect } from 'react'
import { Card, Form, Input, Button, message, Avatar, Descriptions, Divider, Space } from 'antd'
import { UserOutlined, LockOutlined, SaveOutlined } from '@ant-design/icons'
import { getProfile } from '../../api'
import request from '../../utils/request'

const Profile = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [nicknameForm] = Form.useForm()
    const [passwordForm] = Form.useForm()

    // ========== 获取用户信息 ==========
    const fetchProfile = async () => {
        try {
            const res = await getProfile()
            setUser(res.data)
            nicknameForm.setFieldsValue({ nickname: res.data.nickname })
        } catch (error) {
            console.error('获取用户信息失败：', error)
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    // ========== 修改昵称 ==========
    const handleUpdateNickname = async (values) => {
        setLoading(true)
        try {
            await request.put('/user/nickname', values)
            message.success('昵称修改成功')
            // 更新本地缓存
            const localUser = JSON.parse(localStorage.getItem('user') || '{}')
            localUser.nickname = values.nickname
            localStorage.setItem('user', JSON.stringify(localUser))
            fetchProfile()
        } catch (error) {
            console.error('修改失败：', error)
        } finally {
            setLoading(false)
        }
    }

    // ========== 修改密码 ==========
    const handleUpdatePassword = async (values) => {
        if (values.newPassword !== values.confirmPassword) {
            message.error('两次输入的密码不一致')
            return
        }
        setLoading(true)
        try {
            await request.put('/user/password', {
                oldPassword: values.oldPassword,
                newPassword: values.newPassword
            })
            message.success('密码修改成功，请重新登录')
            passwordForm.resetFields()
            // 可选：修改成功后退出登录
            // setTimeout(() => {
            //     localStorage.removeItem('token')
            //     localStorage.removeItem('user')
            //     window.location.href = '/login'
            // }, 1500)
        } catch (error) {
            console.error('修改失败：', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {/* ========== 用户信息卡片 ========== */}
            <Card title="👤 用户信息" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
                    <Avatar size={80} icon={<UserOutlined />} />
                    <div>
                        <h2 style={{ margin: 0 }}>{user?.nickname || user?.username}</h2>
                        <p style={{ color: '#999', margin: 0 }}>@{user?.username}</p>
                    </div>
                </div>

                <Descriptions column={1} bordered>
                    <Descriptions.Item label="用户 ID">{user?.id}</Descriptions.Item>
                    <Descriptions.Item label="用户名">{user?.username}</Descriptions.Item>
                    <Descriptions.Item label="昵称">{user?.nickname}</Descriptions.Item>
                    <Descriptions.Item label="注册时间">{user?.createTime}</Descriptions.Item>
                </Descriptions>
            </Card>

            {/* ========== 修改昵称 ========== */}
            <Card title="✏️ 修改昵称" style={{ marginBottom: 16 }}>
                <Form
                    form={nicknameForm}
                    onFinish={handleUpdateNickname}
                    layout="vertical"
                >
                    <Form.Item
                        label="新昵称"
                        name="nickname"
                        rules={[
                            { required: true, message: '请输入昵称' },
                            { max: 20, message: '昵称不能超过 20 个字符' }
                        ]}
                    >
                        <Input placeholder="请输入新昵称" prefix={<UserOutlined />} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                            保存昵称
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {/* ========== 修改密码 ========== */}
            <Card title="🔒 修改密码">
                <Form
                    form={passwordForm}
                    onFinish={handleUpdatePassword}
                    layout="vertical"
                >
                    <Form.Item
                        label="原密码"
                        name="oldPassword"
                        rules={[{ required: true, message: '请输入原密码' }]}
                    >
                        <Input.Password placeholder="请输入原密码" prefix={<LockOutlined />} />
                    </Form.Item>
                    <Form.Item
                        label="新密码"
                        name="newPassword"
                        rules={[
                            { required: true, message: '请输入新密码' },
                            { min: 6, max: 20, message: '密码长度 6-20 个字符' }
                        ]}
                    >
                        <Input.Password placeholder="请输入新密码" prefix={<LockOutlined />} />
                    </Form.Item>
                    <Form.Item
                        label="确认新密码"
                        name="confirmPassword"
                        rules={[
                            { required: true, message: '请确认新密码' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(new Error('两次输入的密码不一致'))
                                }
                            })
                        ]}
                    >
                        <Input.Password placeholder="请再次输入新密码" prefix={<LockOutlined />} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                            修改密码
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Profile