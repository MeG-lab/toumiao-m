<template>
  <div class="article-list" ref="article-list">
    <van-pull-refresh
      :success-text="isRefreshSuccessText"
      :success-duration="500"
      v-model="isRefreshLoading"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in articles"
          :key="index"
          :article="article"
        />
        <!-- <van-cell
          v-for="(article, index) in articles"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { getArticles } from "@/api/article";
import ArticleItem from "@/components/article-item";
import { debounce } from "lodash";
export default {
  name: "ArticleList",
  components: {
    ArticleItem,
  },
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      articles: [],
      loading: false,
      finished: false,
      timestamp: null,
      isRefreshLoading: false,
      isRefreshSuccessText: "",
      scollTop: 0, // 列表滚动到顶部的距离
    };
  },
  created() {},
  computed: {},
  mounted() {
    // 页面实时滚动的距离
    const articleList = this.$refs["article-list"];
    articleList.onscroll = debounce(() => {
      this.scollTop = articleList.scrollTop;
    }, 50);
  },
  activated() {
    // 从缓存中被激活
    // 把记录到的顶部的距离从新设置回去
    this.$refs["article-list"].scrollTop = this.scollTop;
  },
  // deactivated() {
  //   // 组件失去活动了
  // },
  methods: {
    async onLoad() {
      // 异步更新数据
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道ID
        timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳
        with_top: 1, // 是否包含置顶1-包含，0-不包含
      });
      // 数据放到list数组中
      const { results } = data.data;
      this.articles.push(...results);
      // 设置本次加载状态结束，他才可以判断是否需要加载下一次，否则永远停在这里
      this.loading = false;
      // 数据全部加载完成
      if (results.length) {
        this.timestamp = data.data.pre_timestamp;
      } else {
        this.loading = true;
      }
      // console.log(data);
    },
    async onRefresh() {
      // 下来刷新，组件自己会展示loading
      // 1，请求获取数据
      // 异步更新数据
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道ID
        timestamp: Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳
        with_top: 1, // 是否包含置顶1-包含，0-不包含
      });
      //  2.把数据放到数据列表中
      const { results } = data.data;
      this.articles.unshift(...results);
      this.isRefreshSuccessText = `更新了${results.length}条数据`;
      //    3.关闭loading
      this.isRefreshLoading = false;
    },
  },
};
</script>
<style lang="less" scoped>
.article-list {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50px;
  top: 90px;
  overflow-y: auto;
}
</style>
