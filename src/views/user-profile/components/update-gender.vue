<template>
  <div class="update-gender">
    <!-- 导航栏 -->
    <van-picker
      show-toolbar
      :columns="columns"
      :default-index="defaultIndex"
      @cancel="$emit('close')"
      @confirm="onConfirm"
      @change="onGenderChange"
    />
    <!-- 输入框 -->
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user";
export default {
  name: "UpdateGender",
  components: {},
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      columns: ["男", "女"],
      defaultIndex: this.value,
    };
  },
  methods: {
    onGenderChange(picker, value, index) {
      this.defaultIndex = index;
    },
    async onConfirm() {
      this.$toast.loading({
        message: "保存中",
        forbidClick: true,
      });
      await updateUserProfile({
        gender: this.defaultIndex,
      });
      this.$emit("input", this.defaultIndex);
      this.$emit("close");
      this.$toast.success("保存成功");
    },
  },
};
</script>

<style></style>
