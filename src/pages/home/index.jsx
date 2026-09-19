// src/pages/home/index.jsx
import React, { useEffect, useState, useRef } from 'react'
import { Card, Row, Col, Statistic, List, Tag, Button, Space, Empty } from 'antd'
import {
    FileTextOutlined,
    FolderOutlined,
    TagsOutlined,
    EyeOutlined,
    PlusOutlined,
    ArrowRightOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import * as echarts from 'echarts'
import { getArticleList, getCategoryList, getTagList } from '../../api'
import dayjs from 'dayjs'

const Home = () => {
    const navigate = useNavigate()
    const [stats, setStats] = useState({
        articleCount: 0,
        viewCount: 0,
        categoryCount: 0,
        tagCount: 0
    })
    const [recentArticles, setRecentArticles] = useState([])
    const [categoryData, setCategoryData] = useState([])
    const chartRef = useRef(null)
    const chartInstance = useRef(null)

    // ========== 获取统计数据 ==========
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            // 文章
            const articleRes = await getArticleList({ page: 1, limit: 5, sortBy: 'create_time', order: 'desc' })
            const articles = articleRes.data.list || []
            const total = articleRes.data.total || 0
            setRecentArticles(articles)
            
            // 分类
            const categoryRes = await getCategoryList()
            const categories = categoryRes.data || []
            
            // 标签
            const tagRes = await getTagList()
            const tags = tagRes.data || []
            
            // 统计浏览量和分类分布
            const allArticleRes = await getArticleList({ page: 1, limit: 1000 })
            const allArticles = allArticleRes.data.list || []
            const totalViews = allArticles.reduce((sum, item) => sum + (item.viewCount || 0), 0)
            
            // 计算分类分布
            const categoryCount = {}
            allArticles.forEach(article => {
                const catId = article.categoryId
                if (catId) {
                    categoryCount[catId] = (categoryCount[catId] || 0) + 1
                }
            })
            
            const chartData = Object.keys(categoryCount).map(catId => {
                const cat = categories.find(c => c.id === Number(catId))
                return {
                    name: cat ? cat.name : `分类${catId}`,
                    value: categoryCount[catId]
                }
            })
            
            setStats({
                articleCount: total,
                viewCount: totalViews,
                categoryCount: categories.length,
                tagCount: tags.length
            })
            
            setCategoryData(chartData)
        } catch (error) {
            console.error('获取数据失败：', error)
        }
    }

    // ========== 初始化图表 ==========
    useEffect(() => {
        if (!chartRef.current || categoryData.length === 0) return
        
        if (!chartInstance.current) {
            chartInstance.current = echarts.init(chartRef.current)
        }
        
        const option = {
            title: {
                text: '文章分类分布',
                left: 'center',
                textStyle: { fontSize: 16 }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} 篇 ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                top: 'middle'
            },
            series: [
                {
                    name: '文章分类',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 20,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: categoryData
                }
            ]
        }
        
        chartInstance.current.setOption(option)
        
        // 响应式
        const handleResize = () => chartInstance.current?.resize()
        window.addEventListener('resize', handleResize)
        
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [categoryData])

    // 组件卸载时销毁图表
    useEffect(() => {
        return () => {
            chartInstance.current?.dispose()
        }
    }, [])

    return (
        <div>
            {/* ========== 统计卡片 ========== */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card hoverable onClick={() => navigate('/article')}>
                        <Statistic
                            title="文章总数"
                            value={stats.articleCount}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card hoverable>
                        <Statistic
                            title="总浏览量"
                            value={stats.viewCount}
                            prefix={<EyeOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card hoverable onClick={() => navigate('/category')}>
                        <Statistic
                            title="分类数"
                            value={stats.categoryCount}
                            prefix={<FolderOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card hoverable onClick={() => navigate('/tag')}>
                        <Statistic
                            title="标签数"
                            value={stats.tagCount}
                            prefix={<TagsOutlined />}
                            valueStyle={{ color: '#eb2f96' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* ========== 图表 + 最近文章 ========== */}
            <Row gutter={16}>
                <Col span={12}>
                    <Card title="📊 数据概览" style={{ height: 400 }}>
                        {categoryData.length > 0 ? (
                            <div ref={chartRef} style={{ width: '100%', height: 320 }} />
                        ) : (
                            <Empty description="暂无数据" style={{ marginTop: 100 }} />
                        )}
                    </Card>
                </Col>
                <Col span={12}>
                    <Card
                        title="📝 最近文章"
                        extra={
                            <Button type="link" onClick={() => navigate('/article')}>
                                查看全部 <ArrowRightOutlined />
                            </Button>
                        }
                        style={{ height: 400 }}
                    >
                        {recentArticles.length > 0 ? (
                            <List
                                dataSource={recentArticles}
                                renderItem={(item) => (
                                    <List.Item
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/article/${item.id}`)}
                                    >
                                        <List.Item.Meta
                                            title={
                                                <span style={{ fontSize: 14 }}>
                                                    {item.title}
                                                </span>
                                            }
                                            description={
                                                <Space size="small">
                                                    <span style={{ fontSize: 12, color: '#999' }}>
                                                        {dayjs(item.createTime).format('MM-DD HH:mm')}
                                                    </span>
                                                    <Tag color={item.status === 1 ? 'green' : 'default'}>
                                                        {item.status === 1 ? '已发布' : '草稿'}
                                                    </Tag>
                                                    <span style={{ fontSize: 12, color: '#999' }}>
                                                        👁 {item.viewCount}
                                                    </span>
                                                </Space>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Empty description="暂无文章" style={{ marginTop: 100 }} />
                        )}
                    </Card>
                </Col>
            </Row>

            {/* ========== 快捷操作 ========== */}
            <Card title="⚡ 快捷操作" style={{ marginTop: 24 }}>
                <Space size="large">
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/article')}>
                        写文章
                    </Button>
                    <Button icon={<FolderOutlined />} onClick={() => navigate('/category')}>
                        管理分类
                    </Button>
                    <Button icon={<TagsOutlined />} onClick={() => navigate('/tag')}>
                        管理标签
                    </Button>
                </Space>
            </Card>
        </div>
    )
}

export default Home