// src/pages/category/index.jsx
import React, { useState, useEffect } from 'react'
import { Table, Button, Input, Space, message, Popconfirm, Modal, Form } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getCategoryList, createCategory, updateCategory, deleteCategory } from '../../api'
import dayjs from 'dayjs'

const Category = () => {
    const [tableData, setTableData] = useState([])
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [editData, setEditData] = useState(null)
    const [form] = Form.useForm()

    // ========== 获取数据 ==========
    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await getCategoryList()
            setTableData(res.data || [])
        } catch (error) {
            console.error('获取分类失败：', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // ========== 新增 ==========
    const handleAdd = () => {
        setEditData(null)
        form.resetFields()
        // ✅ 自动填充下一个排序值
        form.setFieldsValue({ sort: getNextSort() })
        setModalOpen(true)
    }

    // ========== 编辑 ==========
    const handleEdit = (record) => {
        setEditData(record)
        form.setFieldsValue(record)
        setModalOpen(true)
    }

    // ========== 删除 ==========
    const handleDelete = async (id) => {
        try {
            await deleteCategory(id)
            message.success('删除成功')
            fetchData()
        } catch (error) {
            console.error('删除失败：', error)
        }
    }

    // ========== 提交 ==========
    const handleOk = async () => {
        try {
            const values = await form.validateFields()
            // ✅ 确保 sort 是数字
            values.sort = Number(values.sort) || 0

            if (editData) {
                await updateCategory({ ...values, id: editData.id })
                message.success('编辑成功')
            } else {
                await createCategory(values)
                message.success('新增成功')
            }
            setModalOpen(false)
            fetchData()
        } catch (error) {
            console.error('保存失败：', error)
        }
    }

    // ✅ 计算下一个排序值
    const getNextSort = () => {
        if (tableData.length === 0) return 1
        // 找出最大的 sort 值
        const maxSort = Math.max(...tableData.map(item => item.sort || 0))
        return maxSort + 1
    }

    // ========== 表格列 ==========
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 80
        },
        {
            title: '分类名称',
            dataIndex: 'name'
        },
        {
            title: '排序',
            dataIndex: 'sort',
            width: 100
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 180,
            render: (time) => time ? dayjs(time).format('YYYY-MM-DD HH:mm') : '-'
        },
        {
            title: '操作',
            width: 180,
            render: (record) => (
                <Space>
                    <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定要删除这个分类吗？"
                        description="分类下有文章时无法删除"
                        onConfirm={() => handleDelete(record.id)}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    新增分类
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={tableData}
                rowKey="id"
                loading={loading}
                pagination={false}
            />

            <Modal
                open={modalOpen}
                title={editData ? '编辑分类' : '新增分类'}
                onOk={handleOk}
                onCancel={() => setModalOpen(false)}
                okText="保存"
                cancelText="取消"
            >
                <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
                    <Form.Item
                        label="分类名称"
                        name="name"
                        rules={[{ required: true, message: '请输入分类名称' }]}
                    >
                        <Input placeholder="请输入分类名称" />
                    </Form.Item>
                    <Form.Item label="排序" name="sort" extra="数字越小越靠前">
                        <Input type="number" placeholder="数字越小越靠前" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default Category