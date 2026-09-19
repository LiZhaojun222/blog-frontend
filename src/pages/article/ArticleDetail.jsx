// src/pages/article/ArticleDetail.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Card, Button, Tag, Spin, Space, Divider } from 'antd'
import { ArrowLeftOutlined, EyeOutlined, CalendarOutlined } from '@ant-design/icons'
import { getArticleDetail } from '../../api'
import dayjs from 'dayjs'

const ArticleDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()   // ← 获取 URL 参数
    const [article, setArticle] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDetail()
    }, [id])

    const fetchDetail = async () => {
        setLoading(true)
        try {
            const res = await getArticleDetail(id)
            setArticle(res.data)
        } catch (error) {
            console.error('获取详情失败：', error)
        } finally {
            setLoading(false)
        }
    }

    const handleBack = () => {
        // ✅ 返回时带上查询参数
        const params = searchParams.toString()
        navigate(`/article${params ? `?${params}` : ''}`)
    }

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 100 }}>
                <Spin size="large" />
            </div>
        )
    }

    if (!article) {
        return (
            <div style={{ textAlign: 'center', padding: 100 }}>
                <p>文章不存在</p>
                <Button onClick={() => navigate('/article')}>返回列表</Button>
            </div>
        )
    }

    return (
        <div>
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={handleBack}
                style={{ marginBottom: 16 }}
            >
                返回列表
            </Button>

            <Card>
                {/* 标题 */}
                <h1 style={{ fontSize: 28, marginBottom: 16 }}>
                    {article.title}
                </h1>

                {/* 元信息 */}
                <Space split={<Divider type="vertical" />} style={{ marginBottom: 24 }}>
                    <span>
                        <CalendarOutlined /> {dayjs(article.createTime).format('YYYY-MM-DD HH:mm')}
                    </span>
                    <span>
                        <EyeOutlined /> {article.viewCount} 次浏览
                    </span>
                    {article.categoryId && (
                        <Tag color="blue">分类 {article.categoryId}</Tag>
                    )}
                </Space>

                {/* 标签 */}
                {article.tags && article.tags.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                        {article.tags.map(tag => (
                            <Tag key={tag.id} color="green">{tag.name}</Tag>
                        ))}
                    </div>
                )}

                <Divider />

                {/* 摘要 */}
                {article.summary && (
                    <div style={{
                        background: '#f5f5f5',
                        padding: 16,
                        borderRadius: 8,
                        marginBottom: 24,
                        color: '#666'
                    }}>
                        <strong>摘要：</strong>{article.summary}
                    </div>
                )}

                {/* 正文 */}
                <div style={{
                    fontSize: 16,
                    lineHeight: 1.8,
                    color: '#333',
                    whiteSpace: 'pre-wrap'
                }}>
                    {article.content}
                </div>
            </Card>
        </div>
    )
}

export default ArticleDetail