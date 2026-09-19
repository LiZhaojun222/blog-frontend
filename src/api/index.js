// src/api/index.js
import request from '../utils/request'

// ============ 用户 ============

export const login = (data) => {
    return request.post('/user/login', data)
}

export const register = (data) => {
    return request.post('/user/register', data)
}

export const getProfile = () => {
    return request.get('/user/profile')
}

// ============ 文章 ============

export const getArticleList = (params) => {
    return request.get('/article/list', { params })
}

export const getArticleDetail = (id) => {
    return request.get(`/article/detail/${id}`)
}

export const createArticle = (data) => {
    return request.post('/article/create', data)
}

export const updateArticle = (data) => {
    return request.put('/article/update', data)
}

export const deleteArticle = (id) => {
    return request.delete(`/article/${id}`)
}

export const getMyArticles = (params) => {
    return request.get('/article/my', { params })
}

// ============ 分类 ============

export const getCategoryList = () => {
    return request.get('/category/list')
}

export const createCategory = (data) => {
    return request.post('/category/create', data)
}

export const updateCategory = (data) => {
    return request.put('/category/update', data)
}

export const deleteCategory = (id) => {
    return request.delete(`/category/${id}`)
}

// ============ 标签 ============

export const getTagList = () => {
    return request.get('/tag/list')
}

export const createTag = (data) => {
    return request.post('/tag/create', data)
}

export const deleteTag = (id) => {
    return request.delete(`/tag/${id}`)
}