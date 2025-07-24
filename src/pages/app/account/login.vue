<template>
  <div>
    <AuthCard subtitle="登录你的账户">
      <LoginForm @login-success="handleLoginSuccess" @login-error="handleLoginError"/>
    </AuthCard>
  </div>
</template>

<script>
import {useHead} from "@unhead/vue";
import {localuser} from "@/services/localAccount";
import AuthCard from "@/components/AuthCard.vue";
import LoginForm from "@/components/account/LoginForm.vue";

export default {
  components: {AuthCard, LoginForm},

  setup() {
    // Check if user is already logged in
    if (localuser.isLogin.value === true) {
      router.push("/app/dashboard");
    }

    // Set page title
    useHead({
      title: "登录",
    });

    const handleLoginSuccess = (response) => {
      console.log("Login success:", response);
    };

    const handleLoginError = (error) => {
      console.error("Login error:", error);
    };

    return {
      handleLoginSuccess,
      handleLoginError,
    };
  },
};
</script>
