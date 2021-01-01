<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <van-button
        to="/search"
        class="search-btn"
        slot="title"
        icon="search"
        type="info"
        round
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 文章频道列表 -->
    <van-tabs class="channel-tabs" v-model="active" swipeable>
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <!-- 文章列表 -->
        <article-list :channel="channel" />
        <!-- /文章列表 -->
      </van-tab>
      <!-- 添加一个汉堡按钮的展位元素 -->
      <div slot="nav-right" class="wap-nav-placeholder"></div>
      <div
        @click="isChannelEditShow = true"
        slot="nav-right"
        class="wap-nav-wrap"
      >
        <van-icon name="wap-nav" />
      </div>
      <!-- /添加一个汉堡按钮的展位元素 -->
    </van-tabs>
    <!-- /文章频道列表 -->

    <!-- 弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      position="bottom"
      class="channel-edit-popup"
      close-icon-position="top-left"
      get-container="body"
      style="height:100%"
    >
      <!-- 模板中的event标识时间参数 -->
      <channel-edit
        :user-channels="channels"
        :active="active"
        @close="isChannelEditShow = false"
        @update-active="active = $event"
      />
    </van-popup>
    <!-- /弹出层 -->
  </div>
</template>
<script>
import { getUserChannels } from "@/api/user";
import ArticleList from "./components/article-list";
import ChannelEdit from "./components/channel-edit";
import { mapState } from "vuex";
import { getItem } from "@/utils/storage";
export default {
  data() {
    return {
      active: 0, // 控制被激活的标签
      channels: [],
      isChannelEditShow: false, // 控制弹出层的显示
    };
  },
  created() {
    this.loadChannels();
  },
  components: {
    ArticleList,
    ChannelEdit,
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    async loadChannels() {
      let channels = [];
      if (this.user) {
        const { data } = await getUserChannels();
        channels = data.data.channels;
      } else {
        const localChannels = getItem("user-channels");
        // 如果有本地存储的频道列表则使用
        if (localChannels) {
          channels = localChannels;
        } else {
          // 如果没登陆也没有本地存储的频道，就请求获取默认推荐的频道列表
          channels = data.data.channels;
        }
      }
      // 把处理好的数据放到data中，以供模板使用
      this.channels = channels;
    },
    // onUpdateActive(index) {
    //   this.active = index;
    // },
    // onShowEdit() {},
  },
};
</script>
<style lang="less" scoped>
.home-container {
  /deep/ .van-nav-bar__title {
    max-width: none;
    .search-btn {
      width: 277px;
      height: 32px;
      background-color: #5babfb;
      border: none;
      .van-icon {
        font-size: 16px;
      }
      .van-button__text {
        font-size: 14px;
      }
    }
  }
  .channel-tabs {
    /deep/ .van-tab {
      border-bottom: 1px solid #edeff3;
      // border-right: 1px solid #edeff3;
    }
    /deep/ .van-tabs__line {
      bottom: 20px;
      width: 20px !important;
      height: 3px;
      background: #3296fa;
    }
  }
  .wap-nav-placeholder {
    width: 33px;
    flex-shrink: 0;
  }
  .wap-nav-wrap {
    position: fixed;
    right: 0;
    width: 33px;
    height: 43px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border-bottom: 1px solid #edeff3;
    opacity: 0.9; // 透明
    .van-icon {
      font-size: 24px;
    }
    &:before {
      content: "";
      width: 1px;
      height: 43px;
      background: url(./line.png) no-repeat;
      background-size: cover;
      position: absolute;
      background-size: contain;
      left: 0;
      top: 0;
    }
  }
}
</style>
