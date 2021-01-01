<template>
  <div class="updata-name">
    <!-- 导航栏 -->
    <van-nav-bar
      left-text="返回"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
      title="修改昵称"
    />
    <!-- 输入框 -->
    <div class="name-field-wrap">
      <van-field
        v-model="loaclName"
        rows="7"
        autosize
        type="textarea"
        maxlength="50"
        placeholder="请输入新的昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user";
export default {
  name: "UpdataName",
  components: {},
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loaclName: this.value,
    };
  },
  methods: {
    async onConfirm() {
      // 禁止点击背景
      this.$toast.loading({
        message: "保存中",
        forbidClick: true,
        duration: 0,
      });
      try {
        // 更新用户昵称
        await updateUserProfile({
          value: this.loaclName,
        });
        // 更新成功->修改父组件的 name --> 关闭弹出层
        // this.$emit("update-name", this.loaclName);
        // 更新成功，关闭提示窗口
        this.$emit("close");
        this.$emit("input", this.loaclName);
        this.$toast.success("保存成功");
      } catch (err) {
        if (err && err.response && err.response.status === 409) {
          this.$toast.success("昵称已存在");
        }
      }
    },
  },
};
</script>

<style scoped lang="less">
.van-popup {
  background-color: #f5f7f9;
}
.name-field-wrap {
  padding: 10px;
}
</style>
