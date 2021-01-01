<template>
  <div class="channel-edit">
    <van-cell center :border="false">
      <div slot="title" class="channel-title">
        我的频道
      </div>
      <van-button
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        :class="{ active: index === active }"
        :icon="isEdit && index !== 0 ? 'clear' : ''"
        v-for="(channel, index) in userChannels"
        :key="index"
        :text="channel.name"
        @click="onUserChannelClick(channel, index)"
      />
    </van-grid>
    <van-cell center :border="false">
      <div slot="title" class="channel-title">
        频道推荐
      </div>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        @click="onAdd(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel,
} from "@/api/channel";
import { mapState } from "vuex";
import { setItem } from "@/utils/storage";
export default {
  name: "ChannelEdit",
  data() {
    return {
      allChannels: [],
      isEdit: false, // 控制编辑的显示和隐藏
    };
  },
  props: {
    userChannels: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapState(["user"]),
    //   推荐的频道列表，所有频道减去我的频道就是剩下的推荐频道
    // 计算属性会观测内部以来数据的变化而重新求值
    recommendChannels() {
      // 过滤数组，根据方法返回的布尔值true来收集数据
      // filter 方法查找满足条件的所有元素
      return this.allChannels.filter((channel) => {
        //     // 判断channel是否属于用户频道
        // find 方法查找满足条件的单个元素
        return !this.userChannels.find((userChannel) => {
          return userChannel.id === channel.id;
        });
      });
      //   for循环写法
      //   const arr = [];
      //   this.allChannels.forEach((channel) => {
      //       let flag = false
      //     for (let i = 0; i < this.userChannels.length; i++) {
      //       if (this.userChannels[i].id === channel.id) {

      //         flag = true;
      //         break;
      //       }
      //     }
      //     if (!flag){
      //         arr.push(channel);
      //     }
      //   });
      //   return arr;
    },
  },
  created() {
    this.loadAllChannels();
  },
  methods: {
    async loadAllChannels() {
      const { data } = await getAllChannels();
      this.allChannels = data.data.channels;
    },
    async onAdd(channel) {
      this.userChannels.push(channel);
      //   数据持久化
      if (this.user) {
        // 登陆了数据存储到线上
        await addUserChannel({
          channels: [{ id: channel.id, seq: this.userChannels.length }],
        });
      } else {
        // 没有登录数据存储到本地
        setItem("user-channels", this.userChannels);
      }
    },
    onUserChannelClick(channel, index) {
      if (this.isEdit && index !== 0) {
        // 编辑状态 删除频道
        this.deleteChannel(channel, index);
      } else {
        // 非编辑状态，切换频道
        this.switchChannel(index);
      }
    },
    async deleteChannel(channel, index) {
      //   console.log("删除频道");
      // 如果删除的是当前激活频道之前的频道
      if (index <= this.active) {
        // 更新激活频道的列表
        this.$emit("update-active", this.active - 1);
      }
      this.userChannels.splice(index, 1);
      //   数据持久化
      if (this.user) {
        // 登陆了，持久化到线上
        await deleteUserChannel(channel.id);
      } else {
        // 没有登录，持久化到本地
        setItem("user-channels", this.userChannels);
      }
    },
    switchChannel(index) {
      this.$emit("update-active", index);
      // 关闭组件
      this.$emit("close");
      // console.log("切换频道");
    },
  },
};
</script>

<style lang="less" scoped>
.channel-edit {
  padding-top: 54px;
  .channel-title {
    font-size: 16px;
    color: #333;
  }
  .grid-item {
    width: 80px;
    height: 43px;
    /deep/ .van-grid-item__content {
      background-color: #f4f5f6;
      .van-grid-item__text {
        font-size: 14px;
        color: #222;
        margin-top: 0;
      }
    }
    /deep/ .van-grid-item__icon {
      position: absolute;
      right: -5px;
      top: -5px;
      font-size: 20px;
      color: #ccc;
    }
  }
  .active {
    /deep/ .van-grid-item__text {
      color: red !important;
    }
  }
}
</style>
