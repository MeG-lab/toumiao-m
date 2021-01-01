<template>
  <div class="update-photo">
    <img class="img" :src="image" ref="image" />
    <van-nav-bar
      class="toolbar"
      left-text="取消"
      right-text="确定"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    ></van-nav-bar>
  </div>
</template>

<script>
import { updateUserPhoto } from "@/api/user";
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";

export default {
  name: "UpdatePhoto",
  components: {},
  props: {
    file: {
      // type: Object,
      required: true,
    },
  },
  data() {
    return {
      image: window.URL.createObjectURL(this.file),
      cropper: null, // 裁切器实例
    };
  },
  mounted() {
    // 获取需要裁切的图片DOM
    const image = this.$refs.image;
    this.cropper = new Cropper(image, {
      aspectRatio: 16 / 9,
      viewMode: 1,
      dragMode: "move",
      aspectRatio: 1, // 1:1 的裁切框
      cropBoxMovable: true, // 是否可以拖动
      cropBoxResizable: false, // 是否能改变大小
      background: false, // 默认背景
      movable: true, // 图片是否能移动
    });
  },
  methods: {
    getCroppedCanvas() {
      return new Promise((resolve) => {
        this.cropper.getCroppedCanvas().toBlob((file) => {
          resolve(file);
        });
      });
    },
    async onConfirm() {
      this.$toast.loading({
        message: "保存中",
        forbidClick: true,
        duration: 0, // 展示事件，0表示持续展示
      });
      const file = await this.getCroppedCanvas();
      const fd = new FormData();
      fd.append("photo", file);
      // fd.append("photo", this.file);
      // 如果要求 Content-Type 是	multipart/form-data ，则一定要提交 FormData 数据对象
      // 专门用于文件上传的，不能提交 {}

      await updateUserPhoto(fd);
      // 更新父组件的头像
      this.$emit("update-photo", window.URL.createObjectURL(file));
      this.$emit("close");
      this.$toast.success("保存成功");
    },
  },
};
</script>

<style lang="less" scoped>
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
}
/* Ensure the size of the image fit the container perfectly */
.img {
  display: block;

  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>
