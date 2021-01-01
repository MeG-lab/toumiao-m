<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <input
      type="file"
      accept="image/*"
      @change="onFileChange"
      hidden
      ref="file"
    />
    <van-popup
      v-model="isEditNameShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- 传递给子组件的数据既要使用，又要修改，例如这里的 name 
    这种情况下使用    简写
     -->
      <!-- @close="isEditNameShow = false"
           @update-name="user.name = $event" -->
      <!-- v-model = "user.name" 
          默认传递一个名字叫 name 的数据
          :valie="user.name"
          默认监听 input 事件 @input = "user.name = $event"
          v-model 的本质还是监听父组件，它仅仅简化了父组件的使用
      -->
      <!-- v-model 只能使用一次 -->
      <!-- 如果有多个数据需要同步，使用 .sync 修饰符。 -->
      <!-- :gender.sync="user.gender"
          :gender="user.gender"
          @update:gender="user.gender = $event"
          @update:属性名称="user.gender = $event"
          一般把最常用的数据设计为 v-model 绑定
          把不太常用的数据设计为 .sync
       -->
      <!-- 参考 官方文档 -->

      <updata-name
        v-if="isEditNameShow"
        v-model="user.name"
        @close="isEditNameShow = false"
      />
    </van-popup>
    <!-- 修改性别 -->
    <van-popup
      v-model="isEditGenderShow"
      position="bottom"
      :style="{ height: '50%' }"
    >
      <update-gender
        v-model="user.gender"
        @close="isEditGenderShow = false"
      ></update-gender>
    </van-popup>
    <!-- 修改生日 -->
    <van-popup v-model="isEditBirthdayShow" position="bottom">
      <update-birthday
        v-if="isEditBirthdayShow"
        v-model="user.birthday"
        @close="isEditBirthdayShow = false"
      ></update-birthday>
    </van-popup>
    <!-- 修改头像 -->
    <van-popup
      class="update-photo-popup"
      v-model="isEditPhotoShow"
      style="height:100%"
      position="bottom"
    >
      <update-photo
        v-if="isEditPhotoShow"
        @close="isEditPhotoShow = false"
        :file="previewImage"
        @update-photo="user.photo = $event"
      ></update-photo>
    </van-popup>
    <!-- 导航栏 -->
    <van-cell @click="$refs.file.click()" title="头像" is-link center>
      <van-image width="30" height="30" round fit="cover" :src="user.photo" />
    </van-cell>
    <van-cell
      @click="isEditNameShow = true"
      title="昵称"
      is-link
      :value="user.name"
    />
    <van-cell
      title="性别"
      @click="isEditGenderShow = true"
      is-link
      :value="user.gender === 0 ? '男' : '女'"
    />
    <van-cell
      title="生日"
      @click="isEditBirthdayShow = true"
      is-link
      :value="user.birthday"
    />
  </div>
</template>

<script>
import { getUserProfile } from "@/api/user";
import UpdataName from "./components/update-name.vue";
import UpdateGender from "./components/update-gender.vue";
import UpdateBirthday from "./components/update-birthday.vue";
import UpdatePhoto from "./components/update-photo.vue";

export default {
  name: "UserProfile",
  components: { UpdataName, UpdateGender, UpdateBirthday, UpdatePhoto },
  props: {},
  data() {
    return {
      user: {}, // 用户数据
      isEditNameShow: false, // 编辑昵称的弹出层
      isEditGenderShow: false, // 编辑性别的弹出层
      isEditBirthdayShow: false, // 编辑生日的弹出层
      isEditPhotoShow: false, // 编辑头像的显示状态
      // 上传预览图片
      previewImage: null,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadUserProfile();
  },
  mounted() {},
  methods: {
    async loadUserProfile() {
      const { data } = await getUserProfile();
      this.user = data.data;
    },
    onFileChange() {
      // 展示弹出层
      this.isEditPhotoShow = true;
      // 在弹出层里展示图片
      // const blob = window.URL.createObjectURL(this.$refs.file.files[0]);
      const file = this.$refs.file.files[0];
      // console.log(blob);
      this.previewImage = file;
      // 为了解决相同文件不触发 change 事件
      this.$refs.file.value = "";
    },
  },
};
</script>

<style lang="less" scoped>
.update-photo-popup {
  background-color: #000000;
}
</style>
