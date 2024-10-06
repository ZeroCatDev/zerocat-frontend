<template>
  <v-layout>
    <v-app-bar color="transparent" flat>
      <div class="d-flex flex-1-1-0 ps-md-4">
        <v-avatar image="https://vuetifyjs.b-cdn.net/docs/images/logos/v.png" />
      </div>

      <div class="d-flex flex-1-1-0 pe-3">
        <v-btn
          append-icon="mdi-chevron-right"
          class="ms-auto text-none"
          slim
          text="账户"
          to="/account"
        />
      </div>
    </v-app-bar>

    <v-main :min-height="$vuetify.display.mdAndUp ? 1000 : 550">
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
            <span class="hidden-md-and-up">由</span>雨云作为基础设施
          </v-chip>

          <h1 class="text-h4 text-md-h2 font-weight-bold my-6">
            &lt; ZeroCat /&gt;
          </h1>

          <div class="text-body-1 text-medium-emphasis mb-10">
            新一代，开源，编程社区
          </div>

          <div class="d-flex ga-4 justify-center">
            <v-btn
              class="text-none"
              color="primary"
              flat
              to="/projects"
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

        <div class="v-bg position-absolute top-0 right-0 left-0 bottom-0">
          <div
            aria-hidden="true"
            class="overflow-hidden opacity-20 w-100 h-100"
          />
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
          src="../../src/assets/屏幕截图_27-8-2024_112550_github.com.jpeg"
        />
      </v-col>
    </v-row>
  </v-container>
  <v-container class="pa-md-12 pa-sm-6">
    <v-card class="pa-6 pa-md-12" :image="src" rounded="xl">
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
  <!--<v-container class="pa-md-12 pa-sm-6" fluid>
    <v-responsive
      class="text-center mx-auto mb-6 mb-md-12"
      max-width="700"
    >
      <h1 class="text-md-h4 font-weight-bold mb-4 text-sm-h5">
        Gain access for One Price
      </h1>

      <p class="text-subtitle-1 text-medium-emphasis">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi,
        ratione debitis quis est labore voluptatibus! Eaque cupiditate
        minima, at placeat totam.
      </p>
    </v-responsive>

    <v-sheet
      border
      class="mx-auto pa-2"
      max-width="1000"
      rounded="xl"
    >
      <v-row>
        <v-col cols="12" md="4">
          <v-card
            border
            class="h-100 flex-column d-flex align-center justify-center pa-4"
            color="grey"
            rounded="xl"
            variant="tonal"
          >
            <div class="text-subtitle-1 font-weight-medium mb-3 opacity-70 text-high-emphasis">
              Pay once, get access forever
            </div>

            <div class="text-h3 mb-8 text-high-emphasis font-weight-bold">
              $199
              <small class="text-overline">USD</small>
            </div>

            <v-btn
              class="mb-5 text-none"
              color="success"
              max-height="36"
              max-width="256"
              rounded="lg"
              text="Get access"
              variant="flat"
              width="100%"
            />

            <div class="text-caption text-medium-emphasis w-75 text-center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </div>
          </v-card>
        </v-col>

        <v-col class="pa-6" cols="12" md="8">
          <h2 class="text-h5 font-weight-bold mb-4">Lifetime subscription</h2>

          <p class="text-medium-emphasis mb-4">
            Get the most out of Vuetify with a lifetime subscription. This
            is a limited time offer and will not be available in the future.
            Get access to all current and future features, including full
            access to all snips components.
          </p>

          <div class="d-flex align-center mb-8">
            <span
              class="text-primary text-no-wrap text-body-2 font-weight-medium me-4"
            >What you get</span>

            <v-divider />
          </div>

          <v-row dense>
            <v-col
              v-for="feature in features"
              :key="feature"
              cols="12"
              md="6"
            >
              <v-icon color="success" icon="$success" />

              <span class="text-caption ms-2"> {{ feature }} </span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>-->
</template>

<style scoped>
.v-bg {
  filter: blur(128px);
  pointer-events: none;
}

.v-bg > div {
  background: linear-gradient(
    to bottom right,
    rgb(var(--v-theme-surface-variant)),
    rgb(var(--v-theme-primary))
  );
  z-index: -10;
  clip-path: polygon(
    5% 20%,
    15% 10%,
    30% 15%,
    40% 5%,
    50% 25%,
    60% 15%,
    75% 30%,
    85% 20%,
    90% 40%,
    70% 50%,
    85% 70%,
    65% 60%,
    50% 85%,
    35% 70%,
    20% 80%,
    10% 60%,
    5% 40%
  );
}
</style>
<script>
import { ref } from "vue";
import request from "../axios/axios";
import $vuetify from "@/plugins/vuetify";

export default {
  data() {
    return {
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
          title: "林雨",
          subtitle: "Jacopo的好朋友(为什么会放这一条?)",
          avatar: "https://langs.ink/linyu-logo.jpg",
          link: "#",
        },
        {
          title: "加入我们",
          subtitle:
            "虽然Jacopo说不招人，但你依然可以投个自我介绍试试，也许呢？",
          avatar: "https://langs.ink/jacopo-logo.webp",
          link: "mailto:1847261658@qq.com",
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
        console.log(res);
        this.stats = [
          {
            title: res.user,
            subtitle: "用户",
          },
          {
            title: res.project,
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

<style scoped>
.v-bg {
  filter: blur(128px);
  pointer-events: none;
}

.v-bg > div {
  background: linear-gradient(
    to bottom right,
    rgb(var(--v-theme-surface-variant)),
    rgb(var(--v-theme-primary))
  );
  z-index: -10;
  clip-path: polygon(
    5% 20%,
    15% 10%,
    30% 15%,
    40% 5%,
    50% 25%,
    60% 15%,
    75% 30%,
    85% 20%,
    90% 40%,
    70% 50%,
    85% 70%,
    65% 60%,
    50% 85%,
    35% 70%,
    20% 80%,
    10% 60%,
    5% 40%
  );
}
</style>
