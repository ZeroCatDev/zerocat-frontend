<template>
    <v-container>
        <v-card class="mx-auto" rel="noopener" target="_blank">
            <template v-slot:title>
                <span>您正在登录一个账户</span>
            </template><template v-slot:subtitle>
                <span>其他页面传来了一个登录请求，正常情况下它会被自动处理</span>
            </template><v-card-text class="bg-surface-light pt-4">传入的token是：<br />
                {{ token }}
                <br />
                <br />处理后的数据是：<br />
                {{ user }}
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { jwtDecode } from "jwt-decode";
import {localuser} from '@/stores/user';


import request from '../../axios/axios'
export default {
    data() {
        return {
            token: this.$route.query.token || '无',
            user: {},
            BASE_API: import.meta.env.VITE_APP_BASE_API
        }
    },

    async created() {
        if (this.$route.query.token) {
            try {

                this.user = jwtDecode(this.token);
                localStorage.setItem("token", this.token); // 将JWT令牌存储到本地存储中
                this.user = jwtDecode(localStorage.getItem("token")); // 从本地存储中获取并解码JWT令牌
                console.log(this.user);
                localuser.loaduser()
                this.$router.push({ path: '/' })

            } catch (error) {
                this.user = error
            }


        }else{
            console.log('无token')
        }
    },
    methods: {
        async getproject() {
            this.project = await request({
                url: '/api/projectinfo?id=' + this.$route.params.id,
                method: 'get',
            })
            console.log(this.project)
        },
    }
}


</script>
