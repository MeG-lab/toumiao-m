<template>
  <div class="login-container">
    <!-- 头部 -->
    <van-nav-bar
      class="app-nav-bar"
      title="登录 / 注册"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 登录表单 -->
    <!-- 基于 van-form组件包裹所有的表单项 -->
    <van-form
      :show-error="false"
      :show-error-message="false"
      validate-first
      ref="login-form"
      @submit="onLogin"
      @failed="onFailed"
    >
      <van-field
        v-model="user.mobile"
        icon-prefix="toutiao"
        left-icon="shouji"
        placeholder="请输入手机号码"
        name="mobile"
        :rules="formRules.mobile"
      />
      <van-field
        v-model="user.code"
        clearable
        icon-prefix="toutiao"
        left-icon="yanzhengma"
        name="code"
        placeholder="请输入验证码"
        :rules="formRules.code"
      >
        <template #button>
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountDownShow = false"
          />

          <van-button
            v-else
            class="send-btn"
            size="small"
            round
            :loading="isSendSmsLoading"
            @click.prevent="onSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>

      <!-- 按钮 -->
      <div class="login-btn-wrap">
        <van-button class="login-btn" type="info" block>登录</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import { login, sendSms } from "@/api/user";
// import { Toast } from "vant";
export default {
  name: "LoginIndex",
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: "", //手机号
        code: "", //验证码
      },
      formRules: {
        mobile: [
          { required: true, message: "请填写用户名" },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: "请输入正确的手机号" },
        ],
        code: [
          { required: true, message: "请输入验证码" },
          { pattern: /^\d{6}$/, message: "验证码格式错误" },
        ],
      },
      isCountDownShow: false,
      isSendSmsLoading: false,
    };
  },
  computed: {},
  methods: {
    async onLogin() {
      this.$toast.loading({
        message: "加载中...", // 提示文本
        forbidClick: true, // 禁止背景点击
        duration: 0,
      });
      try {
        const { data } = await login(this.user);
        this.$toast.success("登录成功 ");
        this.$store.commit("setUser", data.data);
        // 清除 layoout 缓存让其从新渲染
        this.$store.commit("removeCachePage", "LayoutIndex");
        // 登录成功跳转回原来的页面
        // this.$router.back();
        this.$router.push(this.$route.query.redirect || "/");
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail("登录失败，手机或验证码错误");
        }
      }
    },
    onFailed(error) {
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message,

          position: "top",
        });
      }
    },
    async onSendSms() {
      try {
        await this.$refs["login-form"].validate("mobile");

        this.isSendSmsLoading = true;

        await sendSms(this.user.mobile);

        this.isCountDownShow = true;
      } catch (err) {
        let message = "";

        if (err && err.response && err.response.status === 429) {
          message = "发送频繁，请稍后重试";
        } else if (err.name === "moblie") {
          message = err.message;
        } else {
          message = "发送失败，请稍后重试";
        }

        this.$toast({
          message,
          position: "top",
        });
      }

      this.isSendSmsLoading = false;
    },
  },
};
</script>
<style scoped lang="less">
body {
  background-color: #f5f7f9;
}
.login-container {
  .send-btn {
    width: 78px;
    height: 23px;
    background-color: #ededed;
    .van-button__text {
      font-size: 11px;
      color: #666666;
    }
  }
  .login-btn-wrap {
    padding: 26px 16px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
      .van-button__text {
        font-size: 15px;
      }
    }
  }
}
</style>
