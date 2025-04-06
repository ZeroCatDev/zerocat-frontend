<template>
  <div class="landing-page">
    <!-- 顶部导航 -->
    <v-app-bar flat color="surface" class="px-4 px-sm-10">
      <template v-slot:prepend>
        <div class="d-flex align-center">
          <span class="font-weight-bold primary--text">ZeroCat</span>
        </div>
      </template>

      <v-spacer></v-spacer>

      <v-btn
        variant="text"
        href="https://github.com/zerocatdev"
        target="_blank"
        class="hidden-sm-and-down"
      >
        <v-icon class="mr-2">mdi-github</v-icon>开源仓库
      </v-btn>

      <v-btn
        variant="text"
        to="/app/explore"
        class="hidden-sm-and-down"
      >
        <v-icon class="mr-2">mdi-rocket-launch</v-icon>浏览作品
      </v-btn>

      <v-btn
        variant="flat"
        color="primary"
        class="ml-4"
        to="/app/explore"
      >
        立即开始
      </v-btn>
    </v-app-bar>

    <!-- 主要内容 -->

      <!-- 首屏区域 -->
      <section class="hero-section py-16">
        <v-container>
          <v-row align="center">
            <v-col cols="12" md="6" class="text-center text-md-left">
              <div class="mb-8">
                <h1 class="mb-4 font-weight-bold">
                  <span class="primary--text">ZeroCat</span> - <Typewriter :strings="['编程社区新选择', '开源社区平台','新一代，开源，编程社区']" />
                </h1>
                <p class="mb-8 text-medium-emphasis">
                  新一代，开源，编程社区
                </p>
                <v-btn
                  color="primary"
                  variant="flat"
                  class="mr-4"
                  to="/app/explore"
                >
                  浏览作品
                </v-btn>
                <v-btn
                  variant="outlined"
                >
                  了解详情
                </v-btn>
              </div>

              <v-chip
                variant="outlined"
                color="primary"
                size="small"
                class="mt-4"
                href="https://www.rainyun.com/wuyuan_?s=zerocat"
                target="_blank"
              >
                由雨云提供技术支持
              </v-chip>
            </v-col>

            <v-col cols="12" md="6" class="d-none d-md-flex justify-center">
              <v-img
                src="https://cdn.jsdelivr.net/gh/houlangs/houlangs@main/hero-image.webp"
                max-width="400"
                contain
                class="hero-image"
              ></v-img>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- 特性区域 -->
      <section class="features-section py-12 bg-surface">
        <v-container>
          <v-row justify="center" class="mb-8">
            <v-col cols="12" md="8" class="text-center">
              <span class="text-overline text-primary">ZeroCat 特性</span>
              <h2 class="mb-2 font-weight-medium">为什么选择我们？</h2>
              <p class="text-medium-emphasis">开源、易用、功能丰富的编程社区平台</p>
            </v-col>
          </v-row>

          <v-row>
            <v-col v-for="(feature, i) in features" :key="i" cols="12" sm="6" md="4">
              <v-card variant="flat" class="h-100 pa-4">
                <v-icon :color="feature.color" size="36" class="mb-4">{{ feature.icon }}</v-icon>
                <div class="font-weight-medium mb-2">{{ feature.title }}</div>
                <p class="text-caption text-medium-emphasis">{{ feature.text }}</p>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- 项目统计 -->
      <section class="stats-section py-12">
        <v-container>
          <v-row justify="center">
            <v-col v-for="(stat, i) in stats" :key="i" cols="6" sm="4" lg="3">
              <v-card variant="flat" class="text-center py-6">
                <div class="text-primary font-weight-bold mb-1">{{ stat.title }}</div>
                <div class="text-caption text-medium-emphasis">{{ stat.subtitle }}</div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Scratcher社区 -->
      <section class="community-section py-12 bg-surface">
        <v-container>
          <v-row align="center">
            <v-col cols="12" md="6" class="order-2 order-md-1">
              <span class="text-overline text-primary">面向Scratcher</span>
              <h2 class="mb-4 font-weight-medium">寻找更广阔的编程社区？</h2>
              <p class="text-medium-emphasis mb-6">
                欢迎各位Scratcher加入ZeroCat，这里不仅有丰富的作品展示，还有更多编程资源和学习机会。
              </p>
              <v-btn color="primary" variant="flat" to="/app/explore">
                探索社区
              </v-btn>
            </v-col>

            <v-col cols="12" md="6" class="order-1 order-md-2 text-center mb-6 mb-md-0">
              <v-img
                src="https://cdn.jsdelivr.net/gh/houlangs/houlangs@main/community.webp"
                max-width="320"
                class="mx-auto"
              ></v-img>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- 团队成员 -->
      <section class="team-section py-12">
        <v-container>
          <v-row justify="center" class="mb-8">
            <v-col cols="12" md="8" class="text-center">
              <span class="text-overline text-primary">团队介绍</span>
              <h2 class="mb-2 font-weight-medium">厚浪开发组</h2>
              <p class="text-medium-emphasis">一支朝气蓬勃、热爱代码的创新团队</p>
            </v-col>
          </v-row>

          <v-row>
            <v-col v-for="(member, i) in teamMembers" :key="i" cols="6" sm="3">
              <v-card variant="flat" class="text-center pa-4" :href="member.link" target="_blank">
                <v-avatar size="80" class="mb-3">
                  <v-img :src="member.avatar" alt="团队成员"></v-img>
                </v-avatar>
                <div class="font-weight-medium">{{ member.title }}</div>
                <div class="text-caption text-medium-emphasis">{{ member.subtitle }}</div>
              </v-card>
            </v-col>
          </v-row>

          <v-row justify="center" class="mt-6">
            <v-col cols="12" md="8" class="text-center">
              <p class="text-caption bg-surface pa-3 rounded">
                <q>长江后浪推前浪，浮世新人换旧人</q> - 我们致力于使用最新技术，助力青少年上云
              </p>
              <v-btn
                variant="text"
                color="primary"
                size="small"
                class="mt-2"
                href="https://langs.ink/article/houlangs/"
                target="_blank"
              >
                了解更多团队信息
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- 开源信息 -->
      <section class="opensource-section py-12 bg-surface">
        <v-container>
          <v-row align="center">
            <v-col cols="12" md="6" class="text-center mb-6 mb-md-0">
              <v-icon color="primary" size="64">mdi-github</v-icon>
            </v-col>

            <v-col cols="12" md="6">
              <span class="text-overline text-primary">100% 开源</span>
              <h2 class="mb-4 font-weight-medium">开放所有代码，允许自由使用</h2>
              <p class="text-medium-emphasis mb-6">
                ZeroCat是国内少有的完整开源且内容完善的编程社区，我们向您提供了完整的在线编程解决方案
              </p>
              <v-btn
                color="primary"
                variant="flat"
                href="https://github.com/zerocatdev"
                target="_blank"
                prepend-icon="mdi-github"
              >
                访问 GitHub
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- 用户评价轮播 -->
      <section class="testimonials-section py-12">
        <v-container>
          <v-row justify="center" class="mb-8">
            <v-col cols="12" md="8" class="text-center">
              <span class="text-overline text-primary">用户评价</span>
              <h2 class="mb-2 font-weight-medium">他们怎么说</h2>
              <p class="text-medium-emphasis">来自社区成员的真实反馈</p>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-col cols="12" md="10">
              <v-carousel
                hide-delimiters
                height="320"
                show-arrows="hover"
              >
                <v-carousel-item
                  v-for="(testimonial, i) in testimonials"
                  :key="i"
                >
                  <v-card class="mx-auto h-100 d-flex flex-column justify-center pa-8" variant="flat">
                    <div class="text-center">
                      <v-rating
                        :model-value="5"
                        color="amber"
                        density="compact"
                        readonly
                        size="small"
                      ></v-rating>
                      <p class="my-6 text-medium-emphasis font-italic">
                        "{{ testimonial.quote }}"
                      </p>
                      <v-avatar size="64" class="mb-2" v-if="testimonial.avatar">
                        <v-img :src="testimonial.avatar"></v-img>
                      </v-avatar>
                      <div class="font-weight-medium">{{ testimonial.name }}</div>
                      <div class="text-caption text-medium-emphasis">{{ testimonial.title }}</div>
                    </div>
                  </v-card>
                </v-carousel-item>
              </v-carousel>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- 常见问题 -->
      <section class="faq-section py-12 bg-surface">
        <v-container>
          <v-row justify="center" class="mb-8">
            <v-col cols="12" md="8" class="text-center">
              <span class="text-overline text-primary">常见问题</span>
              <h2 class="mb-2 font-weight-medium">您可能想知道</h2>
              <p class="text-medium-emphasis">我们收集了一些常见问题的解答</p>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-col cols="12" md="8">
              <v-expansion-panels variant="accordion">
                <v-expansion-panel
                  v-for="(faq, i) in faqs"
                  :key="i"
                >
                  <v-expansion-panel-title>
                    {{ faq.question }}
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    {{ faq.answer }}
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- 订阅通讯
      <section class="newsletter-section py-12">
        <v-container>
          <v-row justify="center">
            <v-col cols="12" md="6" class="text-center">
              <h2 class="mb-4 font-weight-medium">订阅我们的通讯</h2>
              <p class="text-medium-emphasis mb-6">
                及时获取平台最新动态、技术教程和社区活动信息
              </p>

              <v-form @submit.prevent="submitNewsletter">
                <v-row>
                  <v-col cols="12" sm="8">
                    <v-text-field
                      v-model="newsletter.email"
                      label="您的邮箱地址"
                      variant="outlined"
                      hide-details
                      density="comfortable"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-btn
                      block
                      color="primary"
                      type="submit"
                      :loading="newsletter.loading"
                    >
                      订阅
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>

              <p class="text-caption text-medium-emphasis mt-4">
                我们尊重您的隐私，绝不会向第三方分享您的信息
              </p>
            </v-col>
          </v-row>
        </v-container>
      </section>-->

      <!-- 技术栈展示 -->
      <section class="tech-stack-section py-12 bg-surface">
        <v-container>
          <v-row justify="center" class="mb-8">
            <v-col cols="12" md="8" class="text-center">
              <span class="text-overline text-primary">技术栈</span>
              <h2 class="mb-2 font-weight-medium">我们使用的技术</h2>
              <p class="text-medium-emphasis">现代化的技术栈确保最佳用户体验</p>
            </v-col>
          </v-row>

          <v-row justify="center" align="center">
            <v-col
              v-for="(tech, i) in techStack"
              :key="i"
              cols="4" sm="3" md="2"
              class="text-center"
            >
              <v-tooltip :text="tech.name" location="top">
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-bind="props"
                    :icon="tech.icon"
                    size="x-large"
                    class="tech-icon mb-2"
                  ></v-icon>
                </template>
              </v-tooltip>
              <div class="text-caption">{{ tech.name }}</div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- 行动召唤 -->
      <section class="cta-section py-16 bg-primary">
        <v-container>
          <v-row justify="center">
            <v-col cols="12" md="8" class="text-center text-white">
              <h2 class="mb-4 font-weight-medium">准备好开始了吗？</h2>
              <p class="mb-8 text-white text-opacity-70">
                加入我们的编程社区，探索无限可能
              </p>
              <v-btn
                color="white"
                variant="elevated"
                to="/app/explore"
                class="mr-4"
              >
                浏览作品
              </v-btn>
              <v-btn
                color="white"
                variant="outlined"
              >
                了解更多
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- 页脚 -->
      <v-footer class="bg-surface py-6">
        <v-container>
          <v-row>
            <v-col cols="12" class="text-center">
              <p class="text-caption text-medium-emphasis mb-2">
                © {{ new Date().getFullYear() }} ZeroCat. Sunwuyuan & 厚浪开发组
              </p>
              <v-chip
                variant="outlined"
                size="x-small"
                class="ma-1"
                href="https://www.rainyun.com/wuyuan_?s=zerocat"
                target="_blank"
              >
                雨云
              </v-chip>

              <v-chip
                variant="outlined"
                size="x-small"
                class="ma-1"
                href="https://github.com/zerocatdev"
                target="_blank"
              >
                GitHub
              </v-chip>
            </v-col>
          </v-row>
        </v-container>
      </v-footer>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useHead } from '@unhead/vue';
import axios from '@/axios/axios';
import Typewriter from '@/components/Typewriter.vue';
// 设置页面元数据
useHead({
  title: 'ZeroCat - 新一代开源编程社区',
  meta: [
    { name: 'description', content: '国内少有的完整开源且内容完善的编程社区，提供完整的在线编程解决方案' }
  ]
});

// 特性数据
const features = [
  {
    icon: 'mdi-code-tags',
    color: 'primary',
    title: '开源代码',
    text: '100%开源，允许自由使用和贡献'
  },
  {
    icon: 'mdi-account-group',
    color: 'secondary',
    title: '活跃社区',
    text: '拥有大量用户和作品展示'
  },
  {
    icon: 'mdi-school',
    color: 'info',
    title: '学习资源',
    text: '提供丰富的学习资源和教程'
  },
  {
    icon: 'mdi-cloud',
    color: 'success',
    title: '云端服务',
    text: '由雨云提供可靠的云端服务'
  },
  {
    icon: 'mdi-view-dashboard',
    color: 'warning',
    title: '直观界面',
    text: '现代化界面设计，操作简单直观'
  },
  {
    icon: 'mdi-security',
    color: 'error',
    title: '安全可靠',
    text: '确保用户数据和作品安全'
  }
];

// 统计数据
const stats = ref([
  {
    title: '1+',
    subtitle: '开发者'
  }
]);

// 团队成员
const teamMembers = [
  {
    title: '孙悟元',
    subtitle: '全栈',
    avatar: 'https://langs.ink/sunwuyuan-logo.webp',
    link: 'https://wuyuan.dev'
  },
  {
    title: 'Jacopo',
    subtitle: '站长',
    avatar: 'https://langs.ink/jacopo-logo.webp',
    link: 'https://github.com/houlangs'
  },
  {
    title: 'Guaning',
    subtitle: '后端',
    avatar: 'https://langs.ink/guaning-logo.webp',
    link: 'https://github.com/iguaning'
  },
  {
    title: '时迁酱',
    subtitle: '前端',
    avatar: 'https://langs.ink/shiqian-logo.webp',
    link: 'https://github.com/timeshiftsauce'
  },
  {
    title: 'Chris Z',
    subtitle: 'AI',
    avatar: 'https://langs.ink/chris-logo.webp',
    link: '#'
  },
  {
    title: 'WaterMAN',
    subtitle: '如你所见，水',
    avatar: '#',
    link: '#'
  }
];

// 用户评价数据
const testimonials = [
  {
    quote: '各位scratcher们，是不是嫌自己的社区太少了？ 那就来zerocat吧！',
    name: '吾家九尾',
    title: 'Scratcher',
  },

];

// 常见问题数据
const faqs = [
  {
    question: 'ZeroCat是什么？',
    answer: 'ZeroCat是一个开源的编程社区平台，专为青少年设计，提供作品展示、社区交流和学习资源等功能。'
  },
  {
    question: '如何开始使用ZeroCat？',
    answer: '点击页面上的"立即开始"按钮，注册一个账号，然后就可以开始浏览或上传您的作品了。'
  },
  {
    question: 'ZeroCat是否完全免费？',
    answer: '是的，ZeroCat是一个完全免费的开源平台，所有功能都可以免费使用。'
  },
  {
    question: '我可以如何贡献代码？',
    answer: 'ZeroCat是开源项目，您可以在GitHub上fork我们的代码库，提交PR来贡献代码或提出改进建议。'
  },
  {
    question: '如何联系ZeroCat团队？',
    answer: '您可以通过GitHub平台或访问我们的开发者个人网站联系团队成员。'
  }
];

// 技术栈数据
const techStack = [
{ name: 'Express', icon: 'mdi-server' },
{ name: 'Prisma', icon: 'mdi-database' },
  { name: 'Vue.js', icon: 'mdi-vuejs' },
  { name: 'JavaScript', icon: 'mdi-language-javascript' },
  { name: 'Node.js', icon: 'mdi-nodejs' },
  { name: 'Git', icon: 'mdi-git' },
  { name: 'Docker', icon: 'mdi-docker' },
  { name: 'Vuetify', icon: 'mdi-vuetify' },
  { name: 'REST API', icon: 'mdi-api' },
  { name: 'Scratch', icon: 'mdi-cat' },
];

// 订阅表单
const newsletter = ref({
  email: '',
  loading: false
});

// 提交订阅
const submitNewsletter = async () => {
  try {
    newsletter.value.loading = true;
    // TODO: 实际的API调用，目前只是模拟
    await new Promise(resolve => setTimeout(resolve, 1000));
    newsletter.value.email = '';
    alert('订阅成功！感谢您的关注。');
  } catch (error) {
    console.error('订阅失败', error);
    alert('订阅失败，请稍后再试。');
  } finally {
    newsletter.value.loading = false;
  }
};

// 获取统计信息
const getInfo = async () => {
  try {
    const response = await axios.get('/api/info');
    const data = response.data;

    stats.value = [
      {
        title: data.user || '0+',
        subtitle: '用户'
      },
      {
        title: data.project || '0+',
        subtitle: '作品'
      },
      {
        title: '1+',
        subtitle: '开发者'
      },
      {
        title: '100%',
        subtitle: '开源'
      }
    ];
  } catch (error) {
    console.error('获取统计信息失败', error);
  }
};

onMounted(() => {
  getInfo();
});
</script>

<style scoped>
.landing-page {
  --section-spacing: 4rem;
  scroll-behavior: smooth;
}

.hero-section {
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at 50% 50%, rgba(var(--v-theme-primary), 0.08) 0%, rgba(var(--v-theme-primary), 0) 70%);
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -150px;
  right: -150px;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(var(--v-theme-primary), 0.1) 0%, rgba(var(--v-theme-primary), 0) 70%);
  z-index: 0;
}

.hero-section::after {
  content: '';
  position: absolute;
  bottom: -100px;
  left: -100px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(var(--v-theme-secondary), 0.08) 0%, rgba(var(--v-theme-secondary), 0) 70%);
  z-index: 0;
}

.hero-image {
  animation: float 6s ease-in-out infinite;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15));
  position: relative;
  z-index: 1;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
  100% {
    transform: translateY(0px);
  }
}

.features-section {
  position: relative;
  overflow: hidden;
}

.features-section::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0) 70%);
  z-index: 0;
}

.features-section .v-card {
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  position: relative;
  z-index: 1;
}

.features-section .v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.team-section {
  position: relative;
  overflow: hidden;
}

.team-section::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(var(--v-theme-secondary), 0.05) 0%, rgba(var(--v-theme-secondary), 0) 70%);
  z-index: 0;
}

.team-section .v-card {
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  position: relative;
  z-index: 1;
}

.team-section .v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.cta-section {
  position: relative;
  overflow: hidden;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: -100px;
  right: -100px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
  z-index: 0;
}

.cta-section::after {
  content: '';
  position: absolute;
  bottom: -80px;
  left: -80px;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
  z-index: 0;
}

.testimonials-section {
  position: relative;
  overflow: hidden;
}

.testimonials-section::before {
  content: '';
  position: absolute;
  top: 50px;
  right: 50px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(var(--v-theme-info), 0.05) 0%, rgba(var(--v-theme-info), 0) 70%);
  z-index: 0;
}

.faq-section {
  position: relative;
}

.faq-section::before {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(var(--v-theme-warning), 0.03) 0%, rgba(var(--v-theme-warning), 0) 70%);
  z-index: 0;
}

.newsletter-section {
  position: relative;
}

.newsletter-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0) 70%);
  z-index: 0;
}

.tech-stack-section {
  position: relative;
}

.tech-icon {
  transition: all 0.3s ease;
}

.tech-icon:hover {
  transform: scale(1.2);
  color: var(--v-theme-primary);
}
</style>
