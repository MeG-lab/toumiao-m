<template>
  <div class="post-comment">
    <van-field
      v-model.trim="message"
      rows="1"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button
      :disabled="!message"
      @click="onPost"
      round
      class="sendButton"
      size="mini"
      >发送</van-button
    >
  </div>
</template>

<script>
import { addComment } from "@/api/comment";
export default {
  name: "PostComment",
  components: {},
  props: {
    target: {
      type: [Number, String, Object],
      required: true,
    },
    articleId: {
      type: [Number, String, Object],
      default: null,
    },
  },
  data() {
    return {
      message: "",
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onPost() {
      this.$toast.loading({
        message: "发布中",
        forbidClick: true,
      });
      const { data } = await addComment({
        target: this.target.toString(),
        content: this.message,
        art_id: this.articleId ? this.articleId.toString() : null,
      });
      this.$emit("post-success", data.data.new_obj);
      this.$toast.success("发布成功");
      // 清空文本框
      this.message = "";
    },
  },
};
</script>
<style lang="less" scoped>
.post-comment {
  display: flex;
  padding: 14px;
  align-items: center;
  .sendButton {
    width: 60px;
    height: 30px;
    color: #ffffff;
    background-color: #3296fa;
  }
}
</style>
