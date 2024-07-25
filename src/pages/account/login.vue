<template>
    <v-container>
        <v-card class="mx-auto" :href="BASE_API + '/user/login?redirect=new'">
            <template v-slot:prepend>
                <v-icon icon="mdi-web"></v-icon>
            </template>
            <template v-slot:append>
                <v-icon icon="mdi-arrow-right-circle"></v-icon>
            </template>
            <template v-slot:title>
                <span>在 ZeroCat 完成登录</span> </template><template v-slot:subtitle>
                <span>您将在 {{ BASE_API }} 完成登录</span> </template><v-card-text class="bg-surface-light pt-4">
                您将会跳转至ZeroCat账户登录页面，完成登录后，您将会被重定向回ZeroCatNext。
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import {localuser} from '@/stores/user';
export default {
    data() {
        return {
            BASE_API: import.meta.env.VITE_APP_BASE_API,
        };
    },

    created() {
        if (localuser.islogin == true) {
            this.$router.push("/");
        }
    },
    methods: {},
};
</script>
