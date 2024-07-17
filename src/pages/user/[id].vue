<template>
    <v-container>
        <div class="mb-2">

            <v-card class="mx-auto" :disabled="UserCardLoading" :loading="UserCardLoading">
                <template v-slot:prepend>


                    <v-avatar class=" mb-2">
                        <v-img :alt="userinfo.info.user.display_name"
                            :src="'https://s4-1.wuyuan.1r.ink/user/' + userinfo.info.user.images"></v-img>
                    </v-avatar>
                </template>
                <template v-slot:title>
                    <span class="font-weight-black">{{ userinfo.info.user.display_name }}</span>
                </template>
                <template v-slot:loader="{ isActive }">
                    <v-progress-linear :active="isActive" height="4"
                        indeterminate></v-progress-linear>
                </template>
                <template v-slot:subtitle>
                    <v-chip> <v-icon icon="mdi-account-circle" start></v-icon>

                        ID:{{ userinfo.info.user.id }}
                    </v-chip> <v-chip> <v-icon icon="mdi-clock" start></v-icon>

                        {{ userinfo.info.user.regTime }}注册

                    </v-chip> <v-chip> <v-icon icon="mdi-tag" start></v-icon>

                        创作者</v-chip>
                    <span class=""></span>
                </template>

                <v-card-text class="bg-surface-light pt-4">
                    {{ userinfo.info.user.motto }} </v-card-text>
            </v-card>
        </div>
        <Projects :authorid='this.$route.params.id' ref="Projects" showinfo='true'></Projects>


        <div id="waline"></div>


    </v-container>
</template>

<script>
import request from '../../axios/axios'
import { init } from '@waline/client';
import Projects from "../../components/Projects.vue";

import '@waline/client/style';
export default {
    components: { Projects },

    data() {
        return {
            UserCardLoading: true,

            userinfo: { "status": "ok", "info": { "user": { "id": 0, "display_name": "加载中", "motto": "加载中", "images": "0ec4beb623e3bcdbe0f207c9804f0bc2", "regTime": "2020-08-30T00:35:37.000Z", "sex": 1, "username": "loading" }, "count": { "pythoncount": 0, "scratchcount": 0 } } }
            ,
            projects: [],
      scratchcount: 0,
      curPage: 1,
      totalPage: 1,
      limit: 8,
      search: {
        title: "",
        type: "",
        description: "",
        src: "",
        order: { name: "观看量升序", type: "view_up" },
        authorid: this.$route.params.id,
        type: { name: "所有", type: "" },
        typeitems: [
          { name: "所有", type: "" },
          { name: "Scratch", type: "scratch" },
          { name: "Python", type: "python" },
        ],
        orderitems: [
          { name: "观看量升序", type: "view_up" },
          { name: "观看量降序", type: "view_down" },
          { name: "时间升序", type: "time_up" },
          { name: "时间降序", type: "time_down" },
          { name: "序号升序", type: "id_up" },
          { name: "序号降序", type: "id_down" },
        ],
      },

        }
    },

    async created() {

        await this.getuserinfo()

        init({
            el: '#waline',
            serverURL: 'https://zerocat-waline.190823.xyz',
            path: 'scratchproject-' + this.$route.params.id,
            copyright: false,
            reaction: true,
            pageview: true,
            locale: {
                reactionTitle: "这个作品怎么样？"
            },
            emoji: [
                '//unpkg.com/@waline/emojis@1.1.0/weibo',
                '//unpkg.com/@waline/emojis@1.1.0/bilibili',
            ],
            dark: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
        });
    },
    methods: {


        async getuserinfo() {
            this.userinfo = await request({
                url: '/api/getuserinfo?id=' + this.$route.params.id,
                method: 'get',
            })
            this.$refs.Projects.onPageChange(1);

            this.UserCardLoading = false
            console.log(this.userinfo)
        },
    }
}


</script>
