<template>
  <v-layout>
    <v-main height="90vh">
      <v-container class="h-100 d-flex align-center justify-center">
        <div class="w-100 w-md-50 text-center">
          <v-chip
            border="thin opacity-25"
            color="surface"
            variant="flat"
            target="_blank"
            href="https://www.rainyun.com/wuyuan_?s=zerocat"
            append-icon="mdi-arrow-right"
          >
            <span class="hidden-sm-and-down">ZeroCat使用</span>
            <span class="hidden-md-and-up">由</span>雨云提供计算服务
          </v-chip>
          <br />
          <h1 class="text-h4 text-md-h2 font-weight-bold my-6">
            <Typewriter :config="{}">&lt; ZeroCat /&gt;</Typewriter>
          </h1>

          <div class="text-body-1 text-medium-emphasis mb-10">
            新一代，开源，编程社区
          </div>

          <div class="d-flex ga-4 justify-center">
            <v-btn
              class="text-none"
              color="primary"
              flat
              to="/app/explore"
              rounded="lg"
              text="浏览作品"
            />

            <v-btn
              append-icon="mdi-chevron-right"
              class="text-none"
              flat
              rounded="lg"
              text="了解更多"
            />
          </div>
        </div>

      </v-container>
    </v-main>
  </v-layout>
  <v-container class="pa-md-12 pa-sm-6">
    <v-row align="center">
      <v-col class="text-center text-lg-left pa-6 pa-md-12" cols="12" lg="6">
        <v-responsive class="mx-auto" max-width="500">
          <h1 class="text-h5 text-md-h4 font-weight-bold mb-4">
            开放所有代码，允许自由使用
          </h1>

          <p class="text-subtitle-2 text-medium-emphasis mb-6">
            自豪的作为国内少有的完整开源且内容完善的编程社区，我们向您提供了完整的在线编程解决方案
          </p>

          <v-btn
            class="mr-4 text-none"
            color="primary"
            size="small"
            text="Github"
            variant="flat"
            href="https://github.com/zerocatdev"
            target="_blank"
          />

          <v-btn
            append-icon="mdi-arrow-right"
            class="text-none"
            size="small"
            text="了解更多"
            variant="text"
          />
        </v-responsive>
      </v-col>

      <v-col cols="12" lg="6">
        <v-img
          cover
          min-height="440"
          position="left"
          :rounded="$vuetify.display.smAndDown ? true : 'e-lg'"
          src="../../src/assets/ZeroCatLogo.svg"
        />
      </v-col>
    </v-row>
  </v-container>
  <v-container class="pa-md-12 pa-sm-6">
    <v-card class="pa-6 pa-md-12" rounded="xl" border>
      <p class="text-sm-h5 text-subtitle-1 text-medium-emphasis mb-6">
        各位scratcher们，是不是嫌自己的社区太少了？ 那就来zerocat吧！
      </p>

      <v-list-item class="px-0" subtitle="开发者" title="吾家九尾" />
    </v-card> </v-container
  ><v-responsive min-height="500">
    <v-container class="pa-6 pa-md-12 text-center flex-column">
      <h1 class="font-weight-bold mb-4 text-h5 text-sm-h4">受到用户喜爱</h1>

      <p class="text-subtitle-1 text-medium-emphasis mb-10">
        以下是部分统计数据
      </p>

      <v-row dense justify="center">
        <v-col v-for="(stat, i) in stats" :key="i" cols="12" lg="3" md="6">
          <v-sheet class="pa-6" rounded="lg" variant="flat">
            <v-list-item class="text-center" :subtitle="stat.subtitle">
              <template #title>
                <p class="text-h4 font-weight-bold pb-2">
                  {{ stat.title }}
                </p>
              </template>
            </v-list-item>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-responsive>
  <v-container class="pa-md-12 pa-sm-6">
    <v-row>
      <v-col cols="12" lg="4" md="12">
        <p class="text-h5 font-weight-bold text-sm-h4">我们的团队成员</p>

        <p class="mt-4 text-body-1 text-medium-emphasis">
          <v-chip
            border="thin opacity-25"
            color="surface"
            variant="flat"
            href="https://langs.ink/article/houlangs/"
          >
            这是厚浪开发组的简介↓ </v-chip
          ><br />
          <br />
          这是一支极具创新能力的团队，我们朝气蓬勃，充满活力，热爱代码。<br />

          我们善于使用最新的技术，我们的与老一代云服务提供商——雨云有着密切的沟通，与他们一同助力青少年上云<br />
          <br />
          <v-alert
            border="start"
            border-color="deep-blue accent-4"
            elevation="2"
          >
            长江后浪推前浪<br />浮世新人换旧人
          </v-alert>
        </p>
      </v-col>

      <v-col cols="12" lg="8" md="12">
        <v-row justify="center">
          <v-col v-for="(item, i) in teams" :key="i" cols="12" sm="6">
            <v-list-item
              class="px-0"
              :subtitle="item.subtitle"
              :title="item.title"
              :href="item.link"
            >
              <template #prepend>
                <v-avatar
                  color="surface-light"
                  :image="item.avatar"
                  :size="48"
                />
              </template>
            </v-list-item>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
  <v-container class="pa-md-12 pa-sm-6 bg-primary text-center" fluid>
    <h1 class="font-weight-bold mb-4 text-h5 text-sm-h5">
      长江后浪推前浪 浮世新人换旧人
    </h1>

    <p class="text-subtitle-2 opacity-60 mb-6 w-100 w-md-50 mx-auto">
      您所使用的服务由厚浪提供
    </p>

    <v-btn
      class="mr-4 text-none"
      color="primary"
      size="small"
      text="访问作品"
      variant="flat"
      to="/projects"
    />

    <v-btn
      append-icon="mdi-arrow-right"
      class="text-none"
      size="small"
      text="了解更多"
      variant="text"
    />
  </v-container>
</template>

<script>
import { ref } from "vue";
import request from "../axios/axios";
import $vuetify from "@/plugins/vuetify";
import { localuser } from "@/middleware/userMiddleware";
import Typewriter from "../components/Typewriter.vue";
import { useHead } from "@unhead/vue";
export default {
  components: { Typewriter },
  setup() {
    useHead({});
  },
  data() {
    return {
      localuser,
      teams: [
        {
          title: "孙悟元",
          subtitle: "开发者",
          avatar: "https://langs.ink/sunwuyuan-logo.webp",
          link: "https://wuyuan.dev",
        },
        {
          title: "Jacopo",
          subtitle: "站长",
          avatar: "https://langs.ink/jacopo-logo.webp",
          link: "https://github.com/houlangs",
        },
        {
          title: "Guaning",
          subtitle: "开发者",
          avatar: "https://langs.ink/guaning-logo.webp",
          link: "https://github.com/iguaning",
        },
        {
          title: "时迁酱",
          subtitle: "开发者",
          avatar: "https://langs.ink/shiqian-logo.webp",
          link: "https://github.com/timeshiftsauce",
        },

        {
          title: "加入我们/合作/拉赞助",
          subtitle: "欢迎",
          avatar: "https://langs.ink/jacopo-logo.webp",
          link: "https://1r.ink/join",
        },
      ],
      stats: ref([
        {
          title: "1+",
          subtitle: "开发者",
        },
      ]),
    };
  },
  methods: {
    getinfo() {
      request.get("/api/info").then((res) => {
        console.log(res.data);
        this.stats = [
          {
            title: res.data.user,
            subtitle: "用户",
          },
          {
            title: res.data.project,
            subtitle: "作品",
          },
          {
            title: "1+",
            subtitle: "开发者",
          },
        ];
      });
    },
  },
  mounted() {
    this.getinfo();
  },
};
</script>
