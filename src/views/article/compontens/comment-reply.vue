<template>
  <div class="comment-reply">
    <!-- 头部信息 -->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon @click="$emit('close')" slot="left" name="cross "></van-icon>
    </van-nav-bar>
    <!-- 当前评论项 -->
    <comment-item :comment="comment" />
    <!-- 所有的评论回复 -->
    <van-cell title="所有回复" />
    <comment-list :source="comment.com_id" type="c"></comment-list>
    <!-- 页面底部 -->
    <div class="article-bottom">
      <van-button
        @click="isPostShow = true"
        class="comment-btn"
        type="default"
        size="small"
        round
        >写评论</van-button
      >
    </div>
    <!-- 发布评论 -->
    <van-popup v-model="isPostShow" position="bottom">
      <post-comment
        :target="comment.com_id"
        :article-id="articleId"
        @post-success="onPostSuccess"
        :list="commentList"
      />
    </van-popup>
  </div>
</template>

<script>
import CommentItem from "./comment-item.vue";
import CommentList from "./comment-list.vue";
import PostComment from "./post-comment.vue";
export default {
  components: { CommentItem, CommentList, PostComment },
  name: "CommentReply",
  props: {
    //   查看回复的评论项
    comment: {
      type: Object,
      qequired: true,
    },
    articleId: {
      type: [String, Number, Object],
      required: true,
    },
  },
  data() {
    return {
      isPostShow: false,
      commentList: [], // 评论的回复列表
    };
  },
  methods: {
    onPostSuccess(comment) {
      // 新发布的评论在最上方
      this.commentList.unshift(comment);
      // 更新评论的回复数量
      this.comment.reply_count++;
      // 关闭发布回复的弹出层
      this.isPostShow = false;
    },
  },
};
</script>

<style lang="less" scoped>
.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 44px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 200px;
    height: 30px;
    border: 1px solid #eeeeee;
    font-size: 15px;
    line-height: 23px;
    color: #a7a7a7;
  }
}
</style>
