<template>
  <div class="update-birthday.vue">
    <!-- 导航栏 -->
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user";
// import dayjs from "@/utils/dayjs";
export default {
  name: "UpdateBirthday",
  components: {},
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value),
    };
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: "保存中",
        forbidClick: true,
      });
      //   const date = dayjs(this.currentDate).format("YYYY-MM-DD");
      const date = `${this.currentDate.getFullYear()}-${this.currentDate.getMonth() +
        1}-${this.currentDate.getDate()}`;
      await updateUserProfile({
        birthday: date,
      });
      this.$emit("input", date);
      this.$emit("close");
      this.$toast.success("保存成功");
    },
  },
};
</script>

<style></style>
