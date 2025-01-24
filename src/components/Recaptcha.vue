<template>
  <div>
    <div :id="recaptchaId"></div>
    <v-btn @click="resetCaptcha" variant="text">刷新</v-btn>
  </div>
</template>

<script>
import "https://static.geetest.com/v4/gt4.js";
import { initRecaptcha } from "@/stores/useRecaptcha";

export default {
  props: {
    recaptchaId: {
      type: String,
      required: true,
    },
    product: {
      type: String,
      default: "popup",
    },
  },
  mounted() {
    this.initRecaptcha();
  },
  methods: {
    initRecaptcha() {
      initRecaptcha(this.recaptchaId, this.product);
    },
    resetCaptcha() {
      this.initRecaptcha();
    },
  },
};
</script>
