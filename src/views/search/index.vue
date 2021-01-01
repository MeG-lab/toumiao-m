<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form action="/">
      <van-search
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch(searchText)"
        @cancel="$router.back()"
        @focus="isResultShow = false"
      />
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <search-result :search-text="searchText" v-if="isResultShow" />
    <!-- /搜索结果 -->

    <!--  联想建议 -->
    <search-suggestion
      :search-text="searchText"
      @search="onSearch"
      v-else-if="searchText"
    />
    <!--  /联想建议 -->

    <!--  历史记录 -->
    <search-history
      :search-histories="SearchHistories"
      @search="onSearch"
      @updata-histories="SearchHistories = $event"
      v-else
    />
    <!--  /历史记录 -->
  </div>
</template>

<script>
import SearchHistory from "./components/search-history.vue";
import SearchResult from "./components/search-result.vue";
import SearchSuggestion from "./components/search-suggestion.vue";
import { setItem, getItem } from "@/utils/storage";
import { getUserSearchHistories } from "@/api/search";
import { mapState } from "vuex";
export default {
  name: "SearchIndex",
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult,
  },
  props: {},
  data() {
    return {
      searchText: "", // 搜索输入框的内容
      isResultShow: false,
      SearchHistories: getItem("search-histories") || [], // 搜索历史数据
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  async created() {
    this.loadSearchHistories();
  },
  watch: {
    // 通过监视统一处理
    SearchHistories() {
      setItem("search-histories", this.SearchHistories);
    },
  },
  methods: {
    onSearch(searchText) {
      // 把输入框设置为你要搜索的文本
      this.searchText = searchText;
      const index = this.SearchHistories.indexOf(searchText);
      if (index !== -1) {
        // 把重复项移除
        this.SearchHistories.splice(index, 1);
      }
      // 把最新的搜索历史记录放到最前面
      this.SearchHistories.unshift(searchText);

      // 如果已登录历史记录存储到线上
      //   tips:只要调用获取搜索结果的数据接口,后端会自动存储用户的搜索历史记录
      // 如果没登录历史记录存储到本地
      // setItem("search-histories", this.SearchHistories);

      // 展示搜索结果
      this.isResultShow = true;
    },
    async loadSearchHistories() {
      // 让后端返回的历史记录和本地的历史记录合并在一起
      // 如果用户已登陆
      let searchHistories = getItem("search-histories") || [];
      if (this.user) {
        const { data } = await getUserSearchHistories();
        searchHistories = [
          ...new Set([...searchHistories, ...data.data.keywords]),
        ];
      }
      this.searchHistories = searchHistories;
    },
  },
};
</script>

<style lang="less" scoped></style>
