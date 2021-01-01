<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(str, index) in suggestions"
      :key="index"
      @click="$emit('search', str)"
    >
      <div slot="title" v-html="highlight(str)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from "@/api/search";
import { debounce } from "lodash"; // 函数防抖
export default {
  name: "SearchSuggestion",
  data() {
    return {
      suggestions: [], // 联想建议数据列表
    };
  },
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  components: {},
  watch: {
    //   属性名: 要监视数据的名称
    searchText: {
      // 当数据发生变化时则会执行hander处理函数
      //   debounce 函数
      //  参数1: 函数
      //  参数2：时间
      // 返回值：防抖处理的函数
      handler: debounce(async function() {
        // console.log("hello");
        // 找到数据接口
        // 请求获取数据
        // 模板绑定展示
        const { data } = await getSearchSuggestions(this.searchText);
        this.suggestions = data.data.options;
      }, 300),
      //   该回调将会在侦听开始之后被立即调用
      immediate: true,
    },
  },
  methods: {
    highlight(str) {
      // RegExp 是正则表达式的构造函数
      // 参数1 字符串
      // 参数2 匹配模式
      // 返回值 正则对象
      return str.replace(
        new RegExp(this.searchText, "gi"),
        `<span style="color:red">${this.searchText}</span>`
      );
    },
  },
};
</script>

<style></style>
