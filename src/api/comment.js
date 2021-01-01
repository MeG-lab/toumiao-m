/**
 * 评论接口模块
 */
import request from "@/utils/request";

/**
 * 获取文章列表
 */
export const getComments = params => {
    return request({
        method: "GET",
        url: "/app/v1_0/comments",
        params
    });
}
// 点赞评论
export const addCommentLike = target => {
    return request({
        method: 'POST',
        url: "/app/v1_0/comment/likings",
        data: {
            target
        }
    })
}
// 取消点赞评论
export const deleteCommentLike = commentId => {
    return request({
        method: 'DELETE',
        url: `/app/v1_0/comment/likings/${commentId}`
    })
}
// 发布评论或回复
export const addComment = data => {
    return request({
        method: 'POST',
        url: '/app/v1_0/comments',
        data
    })
}
