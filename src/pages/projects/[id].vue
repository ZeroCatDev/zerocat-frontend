<template>
  <v-container> <v-row><v-col cols="8" md="8" lg="8" xl="8" sm="8" xs="8">
        <ProjectRunner :type="project.type" :id="project.id" />
      </v-col>

      <v-col cols="4">
        <v-card hover><v-card-item>
            <v-card-title>{{ project.title }}</v-card-title>
            <v-card-subtitle>{{ project.description }}</v-card-subtitle>
          </v-card-item>
          <div class="px-4 d-flex  ga-2 mb-2">

            <v-chip pill> <v-avatar start>
                <v-img :src="'https://s4-1.wuyuan.1r.ink/user/' + project.author_images"></v-img>
              </v-avatar>{{ project.author_display_name }}</v-chip>


          </div>
          <div class="px-4 d-flex  ga-2 mb-2">
            <v-chip pill prepend-icon="mdi-eye">{{ project.view_count }}浏览</v-chip>
            <v-chip pill prepend-icon="mdi-clock">{{ project.time }}</v-chip>
          </div>
          <div class="px-4 d-flex  ga-2 mb-2">
            <v-chip pill prepend-icon="mdi-xml" v-if="project.state == 'public'">开源作品</v-chip>
            <v-chip pill prepend-icon="mdi-xml" v-if="project.state == 'private'">私密作品</v-chip>

            <v-chip pill prepend-icon="mdi-application">{{ project.type }}</v-chip>
          </div>
          <div class="px-4">
            <v-card hover href="#" variant="tonal" :to="'/user/' + project.authorid">
              <v-card-item>
                <template v-slot:prepend>
                  <v-avatar>
                    <v-img :alt="project.author_display_name"
                      :src="'https://s4-1.wuyuan.1r.ink/user/' + project.author_images"></v-img>
                  </v-avatar>
                </template>
                <v-card-title class="text-white">
                  {{ project.author_display_name }} </v-card-title>
                <v-card-subtitle class="text-white">
                  {{ project.author_motto }} </v-card-subtitle>

              </v-card-item></v-card>
          </div>

          <br />
        </v-card>
      </v-col>



    </v-row>


    <div id="waline"></div>


  </v-container>
</template>

<script>
import request from '../../axios/axios'
import { init } from '@waline/client';
import ProjectRunner from '../../components/ProjectRunner.vue';
import '@waline/client/style';
export default {
  components: { ProjectRunner },
  data() {
    return {
      project: {},

    }
  },

  async created() {

    await this.getproject()
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
