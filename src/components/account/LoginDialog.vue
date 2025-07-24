<template>
  <v-dialog v-model="dialog" width="400">
    <template v-slot:activator="{ props }">
      <v-btn rounded="xl" v-bind="props">登录</v-btn>
    </template>

    <v-card rounded="xl">
      <v-card-title></v-card-title>
      <v-card-text>
        <v-btn
          class="float-right"
          icon="mdi-open-in-new"
          size="small"
          to="/app/account/login"
          variant="text"
          @click="dialog = false"
        ></v-btn>

        <h5 class="text-h5 font-weight-semibold mb-1">欢迎来到ZeroCat！ 👋🏻</h5>
        <p class="mb-0">登录你的账户</p>

        <LoginForm
          :showLinks="true"
          :showOAuth="true"
          @close="dialog = false"
          @login-success="handleLoginSuccess"
          @login-error="handleLoginError"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import {ref} from "vue";
import LoginForm from "./LoginForm.vue";

export default {
  name: "LoginDialog",
  components: {LoginForm},

  setup(props, {emit}) {
    const dialog = ref(false);

    const handleLoginSuccess = (response) => {
      dialog.value = false;
      emit("login-success", response);
    };

    const handleLoginError = (error) => {
      emit("login-error", error);
    };

    return {
      dialog,
      handleLoginSuccess,
      handleLoginError,
    };
  },
};
</script>
