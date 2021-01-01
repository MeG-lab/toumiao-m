// 用户相关请求模块
import request from '@/utils/request'

// 登录注册

export const login = data => {
    return request({
        method: 'POST',
        url: '/app/v1_0/authorizations',
        data
    })
}
// 发送短信验证码
export const sendSms = mobile => {
    return request({
        method: 'GET',
        url: `/app/v1_0/sms/codes/${mobile}`,
    })
}
// 获取用户登录信息
export const getCurrentUser = () => {
    return request({
        method: 'GET',
        url: '/app/v1_0/user'
    })
}
// 获取用户频道列表
export const getUserChannels = () => {
    return request({
        method: 'GET',
        url: '/app/v1_0/user/channels'
    })
}
// 关注用户
export const addFollow = userId => {
    return request({
        method: 'POST',
        url: '/app/v1_0/user/followings',
        data: {
            target: userId
        }
    })
}
// 取消关注用户
export const deleteFollow = userId => {
    return request({
        method: 'DELETE',
        url: `/app/v1_0/user/followings/${userId}`
    })
}
// 收藏
export const addCollect = target => {
    return request({
        method: 'POST',
        url: '/app/v1_0/article/collections',
        data: {
            target
        }
    })
}
// 取消收藏
export const deleteCollect = target => {
    return request({
        method: 'DELETE',
        url: `/app/v1_0/article/collections/${target}`
    })
}
// 点赞
export const addLike = articleId => {
    return request({
        method: 'POST',
        url: '/app/v1_0/article/likings',
        data: {
            target: articleId
        }
    })
}
// 取消点赞
export const deleteLike = articleId => {
    return request({
        method: 'DELETE',
        url: `/app/v1_0/article/likings/${articleId}`
    })
}

// 获取用户个人资料
export const getUserProfile = () => {
    return request({
        method: 'GET',
        url: '/app/v1_0/user/profile'
    })
}
// 修改用户个人资料
export const updateUserProfile = data => {
    return request({
        method: 'PATCH',
        url: '/app/v1_0/user/profile',
        data
    })
}
// 编辑用户照片资料
export const updateUserPhoto = data => {
    return request({
        method: 'PATCH',
        url: '/app/v1_0/user/photo',
        data
    })
}
