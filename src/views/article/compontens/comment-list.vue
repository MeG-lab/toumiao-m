<template>
  <div class="comment-list">
    <van-cell title="全部评论"></van-cell>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <comment-item
        v-for="(comment, index) in list"
        :key="index"
        :comment="comment"
        @reply-click="$emit('reply-click', $event)"
      />
    </van-list>
  </div>
</template>

<script>
import { getComments } from "@/api/comment";
import CommentItem from "./comment-item";
export default {
  name: "CommentList",
  components: {
    CommentItem,
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true,
    },
    list: {
      type: Array,
      default: () => [],
      // default: function() {
      //   return [];
      // },
    },
    // 获取文章评论使用字符a
    // 获取评论回复,使用字符c
    type: {
      type: String,
      default: "a",
    },
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10,
    };
  },
  methods: {
    async onLoad() {
      // 异步更新数据
      // 1，请求获取数据
      const { data } = await getComments({
        type: this.type,
        source: this.source.toString(),
        offset: this.offset,
        limit: this.limit,
      });
      this.$emit("update-total-count", data.data.total_count);
      // console.log(data);
      // 2. 把数据放到列表中
      const { results } = data.data;
      this.list.push(...results);
      // 3.将本次的 loading 关闭
      this.loading = false;
      // 4. 判断是否还有数据,  如果有，更新获取下一页  ,  如果没有，则将 finished 设置为true,不再触发加载更多
      if (results.lenght) {
        this.offset = data.data.last_id;
      } else {
        this.finished = true;
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
