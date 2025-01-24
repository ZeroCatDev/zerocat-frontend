<template>
  <div>
    <div :id="recaptchaId"></div>
    <v-btn @click="resetCaptcha" variant="text">刷新</v-btn>
  </div>
</template>

<script>
import "https://static.geetest.com/v4/gt4.js";

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
      console.log(import.meta.env.VITE_APP_GEEID);
      initGeetest4(
        {
          captchaId: import.meta.env.VITE_APP_GEEID,
          product: this.product,
        },
        (captchaObj) => {
          window.gt4 = captchaObj;
          captchaObj.appendTo(`#${this.recaptchaId}`);
          captchaObj
            .onReady(() => {
              console.log(`Challenge Ready`);
            })
            .onSuccess(() => {
              console.log(`Challenge Success`);
            })
            .onError(() => {
              console.log(`Challenge Error`);
            });
        }
      );
    },
    resetCaptcha() {
      window.gt4.reset();
    },
    getResponse() {
      return window.gt4.getValidate();
    },
  },
};
</script>
