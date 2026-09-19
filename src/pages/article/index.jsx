// src/pages/article/index.jsx
import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Table, Button, Input, Space, Tag, message, Popconfirm } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { getArticleList, deleteArticle, getCategoryList } from '../../api'
import ArticleModal from './ArticleModal'
import dayjs from 'dayjs'

const Article = () => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    // ========== 从 URL 读取状态 ==========
    const keyword = searchParams.get('keyword') || ''
    const page = Number(searchParams.get('page')) || 1
    const pageSize = Number(searchParams.get('pageSize')) || 10
    const sortBy = searchParams.get('sortBy') || 'create_time'
    const order = searchParams.get('order') || 'desc'

    // ========== 本地状态 ==========
    const [tableData, setTableData] = useState([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [keywordInput, setKeywordInput] = useState(keyword)

    // ✅ 弹窗相关状态（补齐）
    const [modalOpen, setModalOpen] = useState(false)
    const [editData, setEditData] = useState(null)
    const [categories, setCategories] = useState([])

    // ========== 获取分类 ==========
    useEffect(() => {
        getCategoryList().then(res => setCategories(res.data || []))
    }, [])

    // ========== 获取文章 ==========
    useEffect(() => {
        fetchData()
    }, [page, pageSize, keyword, sortBy, order])

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await getArticleList({
                page,
                limit: pageSize,
                keyword: keyword || undefined,
                sortBy,
                order
            })
            setTableData(res.data.list || [])
            setTotal(res.data.total || 0)
        } catch (error) {
            console.error('获取文章失败：', error)
        } finally {
            setLoading(false)
        }
    }

    // ========== 更新 URL 参数 ==========
    const updateParams = (newParams) => {
        const params = {
            page,
            pageSize,
            keyword,
            sortBy,
            order,
            ...newParams
        }
        Object.keys(params).forEach(key => {
            if (params[key] === '' || params[key] === undefined || params[key] === null) {
                delete params[key]
            }
        })
        setSearchParams(params)
    }

    // ========== 搜索 ==========
    const handleSearch = () => {
        updateParams({ keyword: keywordInput, page: 1 })
    }

    // ✅ 新增（补齐）
    const handleAdd = () => {
        setEditData(null)
        setModalOpen(true)
    }

    // ✅ 编辑（补齐）
    const handleEdit = (record) => {
        setEditData(record)
        setModalOpen(true)
    }

    // ✅ 删除（补齐）
    const handleDelete = async (id) => {
        try {
            await deleteArticle(id)
            message.success('删除成功')
            fetchData()
        } catch (error) {
            console.error('删除失败：', error)
        }
    }

    // ✅ 弹窗成功回调（补齐）
    const handleModalSuccess = () => {
        message.success(editData ? '编辑成功' : '新增成功')
        setModalOpen(false)
        fetchData()
    }

    // ✅ 查看详情
    const handleView = (record) => {
        const params = new URLSearchParams(searchParams)
        navigate(`/article/${record.id}?${params.toString()}`)
    }

    // ========== 表格列（补齐所有列）==========
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 80,
            sorter: true
        },
        {
            title: '标题',
            dataIndex: 'title',
            ellipsis: true
        },
        {
            title: '分类',
            dataIndex: 'categoryId',
            width: 120,
            sorter: true,
            render: (categoryId) => {
                const cat = categories.find(c => c.id === categoryId)
                return cat ? <Tag color="blue">{cat.name}</Tag> : '-'
            }
        },
        {
            title: '浏览量',
            dataIndex: 'viewCount',
            width: 100,
            sorter: true
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 100,
            render: (status) => (
                <Tag color={status === 1 ? 'green' : 'default'}>
                    {status === 1 ? '已发布' : '草稿'}
                </Tag>
            )
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 180,
            sorter: true,
            render: (time) => time ? dayjs(time).format('YYYY-MM-DD HH:mm') : '-'
        },
        {
            title: '操作',
            width: 280,
            render: (record) => (
                <Space>
                    <Button type="link" size="small" onClick={() => handleView(record)}>
                        查看
                    </Button>
                    <Button type="link" size="small" onClick={() => handleEdit(record)}>
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定要删除这篇文章吗？"
                        onConfirm={() => handleDelete(record.id)}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link" size="small" danger>删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    新增文章
                </Button>
                <Space>
                    <Input
                        placeholder="搜索标题"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onPressEnter={handleSearch}
                        style={{ width: 200 }}
                    />
                    <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                        搜索
                    </Button>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={tableData}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: page,
                    pageSize,
                    total,
                    showSizeChanger: true,
                    showTotal: (t) => `共 ${t} 条`
                }}
                onChange={(pagination, filters, sorter) => {
                    updateParams({
                        page: pagination.current,
                        pageSize: pagination.pageSize,
                        sortBy: sorter.field || 'create_time',
                        order: sorter.order === 'ascend' ? 'asc' : 'desc'
                    })
                }}
            />

            <ArticleModal
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onSuccess={handleModalSuccess}
                editData={editData}
                categories={categories}
            />
        </div>
    )
}

export default Article