// src/App.jsx
import { useEffect } from 'react'
import { getArticleList } from './api'

function App() {
    useEffect(() => {
        getArticleList({ page: 1, limit: 5 })
            .then(res => {
                console.log('✅ 文章列表：', res)
            })
            .catch(err => {
                console.error('❌ 请求失败：', err)
            })
    }, [])

    return (
        <div>
            <h1>博客系统前端</h1>
            <p>按 F12 查看控制台</p>
        </div>
    )
}

export default App