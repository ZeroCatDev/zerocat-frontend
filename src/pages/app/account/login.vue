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
import { useRoute, useRouter } from "vue-router";
import AuthCard from "@/components/AuthCard.vue";
import LoginForm from "@/components/account/LoginForm.vue";

export default {
  components: {AuthCard, LoginForm},

  setup() {
    const route = useRoute();
    const router = useRouter();
    
    // Check if user is already logged in
    if (localuser.isLogin.value === true) {
      // If there's a redirect parameter, go there, otherwise go to dashboard
      const redirectPath = route.query.redirect;
      const targetPath = redirectPath ? decodeURIComponent(redirectPath) : "/app/dashboard";
      router.push(targetPath);
    }

    // Set page title
    useHead({
      title: "登录",
    });

    const handleLoginSuccess = (response) => {
      console.log("Login success:", response);
      
      // After successful login, redirect to the requested page or dashboard
      const redirectPath = route.query.redirect;
      const targetPath = redirectPath ? decodeURIComponent(redirectPath) : "/app/dashboard";
      router.push(targetPath);
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
