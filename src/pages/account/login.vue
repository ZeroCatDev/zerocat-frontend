<template>
    <v-container>
        <v-card class="mx-auto" :href="BASE_API+'/user/login'" max-width="344" rel="noopener"
            target="_blank">  <template v-slot:prepend>

            <v-icon icon="mdi-web"></v-icon>
        </template> <template v-slot:append>

<v-icon icon="mdi-open-in-new"></v-icon>
</template>
            <template v-slot:title>
      <span >在ZeroCat完成登录</span>
    </template><template v-slot:subtitle>
      <span >您将在{{ BASE_API }}完成登录</span>
    </template><v-card-text class="bg-surface-light pt-4">
我们很想说这是为了您的隐私与安全性的选择，但事实上是我们没有迁移登录页面    </v-card-text>
            </v-card>
    </v-container>
</template>

<script>
import request from '../../axios/axios'
export default {
    data() {
        return {
            BASE_API: import.meta.env.VITE_APP_BASE_API
        }
    },

    async created() {

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
