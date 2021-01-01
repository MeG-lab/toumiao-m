<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      left-arrow
      title="文章详情"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->
    <div class="article-wrap">
      <h1 class="title">{{ article.title }}</h1>
      <van-cell center class="user-info">
        <div slot="title" class="name">{{ article.aut_name }}</div>
        <van-image slot="icon" class="avatar" round :src="article.aut_photo" />
        <div slot="label" class="pubddate">
          {{ article.pubdate | relativeTime }}
        </div>
        <van-button
          @click="onFollow"
          :icon="article.is_followed ? '' : 'plus'"
          class="follew-btn"
          :type="article.is_followed ? 'default' : 'info'"
          round
          size="small"
          >{{ article.is_followed ? "已关注" : "关注" }}</van-button
        >
      </van-cell>
      <div
        class="markdown-body"
        ref="article-content"
        v-html="article.content"
      ></div>
      <!-- 文章评论列表 -->
      <comment-list
        :sourse="articleId"
        @update-total-count="totalCommentCount = $event"
        @reply-click="onReplyClick"
        :list="commentList"
        :source="articleId"
      >
      </comment-list>
    </div>
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
      <van-icon :info="totalCommentCount" color="#777" name="comment-o" />
      <van-icon
        @click="onCollect"
        :color="article.is_collected ? 'orange' : '#777'"
        :name="article.is_collected ? 'star' : 'star-o'"
      />
      <van-icon
        @click="onLike"
        :color="article.attitude === 1 ? 'hotpink' : '#777'"
        :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
      />
    </div>
    <!-- 发布评论 -->
    <van-popup v-model="isPostShow" position="bottom"
      ><post-comment
        @post-success="onPostSuccess"
        :target="articleId"
      ></post-comment
    ></van-popup>
    <!-- 评论回复 -->
    <van-popup v-model="isReplyShow" position="bottom">
      <!-- 使用 v-if 的目的是让组件随着弹出层的显示进行渲染和销毁,防止加载过的组件不重新渲染导致数据重新加载的问题 -->
      <comment-reply
        v-if="isReplyShow"
        @close="isReplyShow = false"
        :comment="replayComment"
        :article-id="articleId"
      ></comment-reply>
    </van-popup>
  </div>
</template>

<script>
import "./github-markdown.css";
import { getArticleById } from "@/api/article";
import { ImagePreview } from "vant";
import {
  addFollow,
  deleteFollow,
  addCollect,
  deleteCollect,
  addLike,
  deleteLike,
} from "@/api/user";
import PostComment from "./compontens/post-comment";
import CommentList from "./compontens/comment-list";
import CommentReply from "./compontens/comment-reply";
export default {
  // 在组件中获取动态路由参数
  // 方式一:this.$router.params.article-articleId
  // 方式二:props 传参，推荐
  //  this.articleId
  name: "ArticleIndex",
  components: {
    CommentList,
    PostComment,
    CommentReply,
  },
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true,
    },
  },
  data() {
    return {
      article: {}, // 文章数据
      isFollowLoading: false, // 按钮的 loading 状态
      isCollectLoading: false, // 控制 loading 状态
      isLikeLoading: false, // 控制 loading 状态
      isPostShow: false, // 控制发布评论弹出层的显示状态
      commentList: [], // 文章评论列表
      totalCommentCount: 0, // 评论数据总数
      isReplyShow: false, // 控制回复的显示状态
      replayComment: {}, //  当前回复评论对象
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle();
  },
  mounted() {},
  methods: {
    async loadArticle() {
      try {
        const { data } = await getArticleById(this.articleId);
        this.article = data.data;
        this.$nextTick(() => {
          this.handlePerviewImage();
        });
      } catch (err) {
        console.log(err);
      }
    },
    // 处理图片预览
    handlePerviewImage() {
      // 获取文章内容 DOM 容器
      const articleContent = this.$refs["article-content"];
      console.log(articleContent);
      /* 数据改变影响视图更新(DOM数据不是立即的)
        如果需要在数据修改之后马上修改结果, 需要把这个代码放大$this.$nextTick中 */
      // $this.$nextTick 是 Vue 提供的一个方法
      // 得到所有的 img 标签
      const imgs = articleContent.querySelectorAll("img");
      const imgPaths = [];
      // 循环 img 列表 , 给 img 注册点击事件
      imgs.forEach((img, index) => {
        imgPaths.push(img.src);
        img.onclick = function() {
          ImagePreview({
            images: imgPaths,
            startPosition: index,
          });
        };
      });
      // 在事件处理函数中调用 ImagePreview 实现
    },

    // 用户关注功能
    async onFollow() {
      // 开启按钮的 loading 状态
      this.isFollowLoading = true;
      try {
        const authorId = this.article.aut_id;
        if (this.article.is_followed) {
          // 已关注,取消关注
          await deleteFollow(authorId);
        } else {
          // 未关注,点击关注
          await addFollow(authorId);
        }
        // 更新视图
        this.article.is_followed = !this.article.is_followed;
      } catch (err) {
        console.log(err);
        this.$toast.fail("操作失败");
      }

      // 关闭按钮的 loading 状态
      this.isFollowLoading = false;
    },
    // 用户收藏功能
    async onCollect() {
      // 开启按钮的 loading 状态
      this.isCollectLoading = true;
      try {
        if (this.is_collected) {
          await deleteCollect(this.articleId);
        } else {
          await addCollect(this.articleId);
        }
        this.article.is_collected = !this.article.is_collected;
        this.$toast.success("收藏成功");
      } catch (err) {
        console.log(err);
        this.$toast.fail("操作失败");
      }
      this.isCollectLoading = false;
    },
    // 用户点赞功能
    async onLike() {
      // 开启点击按钮的 loading 功能
      this.isLikeLoading = true;
      try {
        if (this.article.attitude === 1) {
          await deleteLike(this.articleId);
          this.article.attitude = -1;
          // this.$toast.success("取消点赞");
        } else {
          await addLike(this.articleId);
          this.article.attitude = 1;
          // this.$toast.success("点赞成功");
        }
      } catch (err) {
        this.$toast.fail("操作失败");
      }
      this.isLikeLoading = false;
      this.$toast.success(
        `${this.article.attitude === 1 ? "" : "取消"}点赞成功`
      );
    },
    // 发布成功后调用
    onPostSuccess(comment) {
      // console.log(comment);
      this.commentList.unshift(comment);
      this.totalCommentCount++;
      this.isPostShow = false;
    },
    //
    onReplyClick(comment) {
      console.log("123", comment);
      this.replayComment = comment;
      this.isReplyShow = true;
    },
  },
};
</script>

<style lang="less" scoped>
.article-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 46px;
  bottom: 44px;
  overflow-y: auto;
}
.title {
  font-size: 20px;
  color: #3a3a3a;
  padding: 14px;
  margin: 0;
  background-color: #fff;
}
.user-info {
  .avatar {
    width: 35px;
    height: 35px;
  }
  .name {
    font-size: 12px;
    color: #333333;
  }
  .pubdate {
    font-size: 12px;
    color: #b4b4b4;
  }
  .follew-btn {
    width: 85px;
    height: 29px;
  }
}
.markdown-body {
  padding: 14px;
  background-color: #fff;
}
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
    width: 141px;
    height: 23px;
    border: 1px solid #eeeeee;
    font-size: 15px;
    line-height: 23px;
    color: #a7a7a7;
  }
  .van-icon {
    font-size: 20px;
    .van-info {
      font-size: 11px;
      background-color: #e22829;
    }
  }
}
</style>
