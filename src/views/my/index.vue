<template>
  <div class="my-container">
    <van-cell-group v-if="user" class="my-info">
      <van-cell class="base-info" :border="false" center>
        <van-image
          class="avatar"
          slot="icon"
          fit="cover"
          round
          :src="currentUser.photo"
        />
        <div class="name" slot="title">{{ currentUser.name }}</div>
        <van-button to="/user/profile" class="update-btn" size="small" round
          >编辑资料</van-button
        >
      </van-cell>
      <van-grid class="data-info" :border="false">
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="cont">{{ currentUser.art_count }}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="cont">{{ currentUser.follow_count }}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="cont">{{ currentUser.fans_count }}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="cont">{{ currentUser.like_count }}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>
    <div v-else class="not-login">
      <div
        @click="
          $router.push({
            name: 'login',
            query: {
              redirect: '/my',
            },
          })
        "
      >
        <img class="mobile" src="./头像.png" alt="" />
      </div>
      <div class="text">登录 / 注册</div>
    </div>
    <van-grid class="nav-grid mb-4" :column-num="2">
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="toutiao"
        icon="shoucang"
        text="收藏"
      >
      </van-grid-item>
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="toutiao"
        icon="lishi"
        text="历史"
      >
      </van-grid-item>
    </van-grid>
    <van-cell title="消息通知" is-link url="/vant/mobile.html" />
    <van-cell class="mb-4" title="小智同学" is-link to="/user/chat" />
    <van-cell
      v-if="user"
      @click="onLayout"
      class="logout-cell mb-4"
      title="退出登录"
    />
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getCurrentUser } from "@/api/user";
export default {
  data() {
    return {
      currentUser: {},
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  created() {
    this.loadCurrentUser();
  },
  methods: {
    async loadCurrentUser() {
      const { data } = await getCurrentUser();
      this.currentUser = data.data;
    },
    // 提示用户确认删除
    onLayout() {
      this.$dialog
        .confirm({
          title: "消息提示",
          message: "确认退出吗",
        })
        .then(() => {
          this.$store.commit("setUser", null);
        })
        .catch(() => {
          // on cancel
        });
    },
  },
};
</script>
<style lang="less" scoped>
.my-container {
  .not-login {
    height: 180px;
    background: url(./banner.png);
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mobile {
      width: 66px;
      height: 66px;
    }
    .text {
      font-size: 14px;
      color: #fff;
    }
  }
  .my-info {
    background: url(./banner.png) no-repeat;
    background-size: cover;
  }
  .base-info {
    box-sizing: border-box;
    height: 115px;
    background-color: unset; // 重置背景颜色
    padding-top: 38px;
    padding-bottom: 11px;
    .avatar {
      box-sizing: border-box;
      width: 66px;
      height: 66px;
      border: 1px solid #fff;
      margin-right: 11px;
    }
    .name {
      font-size: 15px;
      color: #fff;
    }
    .update-btn {
      height: 16px;
      font-size: 10px;
      color: #666666;
    }
  }
  .data-info {
    .data-info-item {
      height: 65px;
      color: #fff;
      .text-wrap {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .cont {
          font-size: 18px;
        }
        .text {
          font-size: 11px;
        }
      }
    }
  }
  /*深度作用操作符
    还可以这么写 >>> 或者 ::v-deep
    一般写/deep/ 有些像Sass之类的预处理器无法正常解析>>>
  */
  /deep/ .van-grid-item__content {
    background: unset;
  }
  /deep/ .nav-grid {
    .nav-grid-item {
      height: 70px;
      .toutiao {
        font-size: 22px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      .nav-grid-item_text {
        font-size: 14px;
        color: #333333;
      }
    }
  }
  .logout-cell {
    text-align: center;
    color: #d86262;
  }
  .mb-4 {
    box-sizing: border-box;
    border-bottom: 4px solid #f5f7f9;
  }
}
</style>
