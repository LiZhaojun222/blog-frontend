// src/pages/article/ArticleModal.jsx
import React, { useEffect } from 'react'
import { Modal, Form, Input, Select, Radio } from 'antd'
import { createArticle, updateArticle } from '../../api'

const { TextArea } = Input

const ArticleModal = ({ open, onCancel, onSuccess, editData, categories }) => {
    const [form] = Form.useForm()
    const isEdit = !!editData

    // 打开时初始化数据
    useEffect(() => {
        if (open) {
            if (isEdit) {
                form.setFieldsValue({
                    id: editData.id,
                    title: editData.title,
                    content: editData.content,
                    summary: editData.summary,
                    categoryId: editData.categoryId,
                    status: editData.status
                })
            } else {
                form.resetFields()
                form.setFieldsValue({ status: 1 })
            }
        }
    }, [open, editData])

    const handleOk = async () => {
        try {
            const values = await form.validateFields()
            
            if (isEdit) {
                await updateArticle({ ...values, id: editData.id })
            } else {
                await createArticle(values)
            }
            
            onSuccess()
        } catch (error) {
            console.error('保存失败：', error)
        }
    }

    return (
        <Modal
            open={open}
            title={isEdit ? '编辑文章' : '新增文章'}
            onOk={handleOk}
            onCancel={onCancel}
            width={800}
            okText="保存"
            cancelText="取消"
        >
            <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                {isEdit && (
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>
                )}
                
                <Form.Item
                    label="标题"
                    name="title"
                    rules={[{ required: true, message: '请输入标题' }]}
                >
                    <Input placeholder="请输入文章标题" />
                </Form.Item>

                <Form.Item label="分类" name="categoryId">
                    <Select placeholder="请选择分类" allowClear>
                        {categories.map(cat => (
                            <Select.Option key={cat.id} value={cat.id}>
                                {cat.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="摘要" name="summary">
                    <TextArea rows={2} placeholder="请输入摘要（可选）" />
                </Form.Item>

                <Form.Item
                    label="内容"
                    name="content"
                    rules={[{ required: true, message: '请输入内容' }]}
                >
                    <TextArea rows={10} placeholder="请输入文章内容" />
                </Form.Item>

                <Form.Item label="状态" name="status" initialValue={1}>
                    <Radio.Group>
                        <Radio value={1}>发布</Radio>
                        <Radio value={0}>草稿</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ArticleModal