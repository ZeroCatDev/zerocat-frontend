<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-card hover border>
          <v-card-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-download-box"></v-icon>
            </template>
            <v-card-title>Auto Scratch-Desktop Mirror</v-card-title>
            <v-card-subtitle>Scratch桌面版镜像</v-card-subtitle></v-card-item
          >
          <v-card-text class="bg-surface-light pt-4">
            Auto Scratch-Desktop Mirror 是一个基于 GitHub Action
            的开源镜像项目，它会每周自动从 Scratch 官方网站下载最新的 Scratch
            3.0 安装包并上传至 GitHub Release 提供给用户以供下载。
          </v-card-text>
        </v-card>

        <v-card class="mt-7" hover border>
          <v-card-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-heart"></v-icon> </template
            ><v-card-title>感谢ASDM的开发者们</v-card-title>
            <v-card-subtitle
              >以下附 ASDM 的原始声明</v-card-subtitle
            ></v-card-item
          >
          <v-card-text class="bg-surface-light pt-4">
            Auto Scratch Desktop Mirror 是一个 Scratch
            桌面版的开源下载镜像项目。我们通过 Github Workflow 自动下载 Scratch
            官网的 Scratch 桌面版程序，并透过 CDN 或 Github Pages
            提供，以方便中国大陆地区的用户下载。
            <p class="font-weight-light mt-2 text-caption">
              项目开源于
              <a href="https://github.com/scratch-bar/asdm">GitHub</a>，本版本由
              waterblock79 开发。
              <br />
              感谢: Scratch Team, GitHub, Vue.js, Vuetify.js
              以及所有为这个项目添砖加瓦的人们!
            </p>
          </v-card-text>
          <v-card-text
            >此版本开源于
            <a href="https://github.com/sunwuyuan/AutoScratchDesktopMirror"
              >GitHub</a
            >
            <br />
            任何问题欢迎加QQ群沟通 964979747<br />

            <p class="font-weight-light mt-2 text-caption">
              此站点目前由 <a href="https://wuyuan.dev">孙悟元</a>(<a
                href="https://zerocat.wuyuan.dev"
                >ZeroCat社区</a
              >) 维护。<br />

              感谢: Scratch Team, GitHub, Vue.js, Vuetify.js, scratch-bar,
              waterblock79 , wrj2009 以及所有为这个项目添砖加瓦的人们!
            </p>
          </v-card-text></v-card
        >
      </v-col>
      <v-col cols="12" md="6">
        <v-card hover :loading="loading" border>
          <v-card-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-download"></v-icon>
            </template>
            <v-card-title class="font-weight-black"
              >下载 Scratch 3.0</v-card-title
            >
            <v-card-subtitle>公益Scratch桌面版镜像</v-card-subtitle>
          </v-card-item>

          <v-card-text class="bg-surface-light pt-4">
            未正确加载下载地址？您可以尝试在应用商店中下载
            <a
              href="https://apps.apple.com/cn/app/scratch-desktop/id1446785996?mt=12"
              class="on-surface"
              >Mac OS 版本</a
            >
            和
            <a
              href="https://www.microsoft.com/zh-cn/p/scratch-3/9pfgj25jl6x3"
              class="on-surface"
              >Windows 10 以上版本</a
            >
            的 Scratch 桌面版。

            <p class="mt-2 font-weight-bold">
              该版本镜像于 {{ release.date }}，Scratch 版本为
              {{ release.scratch_version }}。
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-bind:disabled="release.stat == 0"
              v-bind:href="`https://${download_source.abbr}${release.url.windows}`"
              variant="tonal"
            >
              <v-icon right icon="mdi-microsoft-windows"></v-icon>
              Windows 下载
            </v-btn>
            <v-btn
              v-bind:disabled="release.stat == 0"
              v-bind:href="`https://${download_source.abbr}${release.url.macos}`"
              variant="tonal"
            >
              <v-icon right icon="mdi-apple"></v-icon>
              MacOS 下载
            </v-btn></v-card-actions
          >
        </v-card>
        <v-card hover :loading="loading" class="mt-7" border>
          <v-card-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-download"></v-icon>
            </template>
            <v-card-title class="font-weight-black"
              >下载 Scratch Link</v-card-title
            >
            <v-card-subtitle>公益ScratchLink镜像</v-card-subtitle>
          </v-card-item>

          <v-card-text class="bg-surface-light pt-4">
            未正确加载下载地址？您可以尝试在应用商店中下载
            <a
              href="https://itunes.apple.com/us/app/scratch-link/id1408863490"
              class="on-surface"
              >Mac OS 版本</a
            >
            和
            <a
              href="https://www.microsoft.com/store/productId/9N48XLLCZH0X"
              class="on-surface"
              >Windows 10 以上版本</a
            >
            的 Scratch 桌面版。

            <p class="mt-2 font-weight-bold">
              该版本镜像于 {{ release.date }}，ScratchLink版本为
              {{ release.scratch_link_version }}。
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-bind:disabled="release.stat == 0"
              v-bind:href="`https://${download_source.abbr}${release.url.windows_link}`"
              variant="tonal"
            >
              <v-icon right icon="mdi-microsoft-windows"></v-icon>
              Windows 下载
            </v-btn>
            <v-btn
              v-bind:disabled="release.stat == 0"
              v-bind:href="`https://${download_source.abbr}${release.url.macos_link}`"
              variant="tonal"
            >
              <v-icon right icon="mdi-apple"></v-icon>
              MacOS 下载
            </v-btn></v-card-actions
          >
        </v-card>
        <v-card class="mt-7" hover border>
          <v-card-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-server"></v-icon>
            </template>
            <v-card-title class="font-weight-black">设置下载源</v-card-title>
            <v-card-subtitle>如无法下载请检查此处</v-card-subtitle>
          </v-card-item>

          <v-card-text>
            默认使用
            <b
              ><a href="https://mirror.ghproxy.com/" class="on-surface"
                >ghproxy</a
              ></b
            >
            镜像源<br />
            通常情况下您<b>不需要更改下载源</b>，但如果默认下载源不可用，您可以更改为另外一个，或者自定义下载源。
            <br />
            <br />
            <v-select
              v-model="download_source"
              :hint="`${download_source.state}, ${download_source.abbr}`"
              :items="download_source_list"
              item-title="state"
              item-value="abbr"
              label="Select"
              persistent-hint
              return-object
              single-line
            ></v-select>
            <br />
            <v-text-field label="可直接编辑" v-model="download_source.abbr">
            </v-text-field>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<!-- ZeroCatNext中request会直接返回body的内容，所以代码不通用 -->
<script>
import request from "../../axios/axios";
import { useHead } from '@unhead/vue'

export default {
  setup() {
    useHead({
      title: 'ZeroCat - ASDM',
      meta: [
        { name: 'description', content: 'Download and explore Auto Scratch-Desktop Mirror (ASDM) on ZeroCat.' },
        { name: 'keywords', content: 'ZeroCat, ASDM, Auto Scratch-Desktop Mirror, download, explore' }
      ]
    });
  },
  data() {
    return {
      release: {
        stat: 0, // 0 => 加载中，1 => 加载成功，其他 => 加载失败:错误信息
        url: {
          windows: "",
          macos: "",
          windows_link: "",
          macos_link: "",
        },
        date: "一周以内",
        scratch_version: "未知",
        scratch_link_version: "未知",
      },
      download_source: {
        state: "ghproxy",
        abbr: "mirror.ghproxy.com/https://github.com",
      },

      download_source_list: [
        { state: "Github", abbr: "github.com" },
        {
          state: "gh.api.99988866.xyz",
          abbr: "gh.api.99988866.xyz/https://github.com",
        },
        { state: "ghproxy", abbr: "mirror.ghproxy.com/https://github.com" },
        { state: "自定义", abbr: "" },
      ],
      loading: false,
      scratch_proxy: import.meta.env.VITE_APP_SCRATCH_PROXY,
    };
  },

  created() {
    this.loading = true;
    this.release.stat = 0;
    request
      .get(this.scratch_proxy + "/asdm")
      .then((res) => {
        this.release.stat = 1;
        this.release.url.windows = res.assets
          .filter((element) => {
            return element["name"] == "scratch-win.exe";
          })[0]
          .browser_download_url.replace("https://github.com", "");
        this.release.url.macos = res.assets
          .filter((element) => {
            return element["name"] == "scratch-mac.dmg";
          })[0]
          .browser_download_url.replace("https://github.com", "");
        this.release.url.windows_link = res.assets
          .filter((element) => {
            return element["name"] == "scratch-link-win.zip";
          })[0]
          .browser_download_url.replace("https://github.com", "");
        this.release.url.macos_link = res.assets
          .filter((element) => {
            return element["name"] == "scratch-link-mac.zip";
          })[0]
          .browser_download_url.replace("https://github.com", "");
        this.release.date = new Date(res.published_at).toLocaleString();
        this.release.scratch_version = JSON.parse(
          res.body
        ).scratch_version.split("-")[0];
        this.release.scratch_link_version = JSON.parse(
          res.body
        ).scratch_version.split("-")[1];
        this.loading = false;
      })
      .catch((err) => {
        console.log(err);
        axios
          .get(
            "https://api.github.com/repos/sunwuyuan/AutoScratchDesktopMirror/releases/latest"
          )
          .then((res) => {
            this.release.stat = 1;
            this.release.url.windows = res.assets
              .filter((element) => {
                return element["name"] == "scratch-win.exe";
              })[0]
              .browser_download_url.replace("https://github.com", "");
            this.release.url.macos = res.assets
              .filter((element) => {
                return element["name"] == "scratch-mac.dmg";
              })[0]
              .browser_download_url.replace("https://github.com", "");
            this.release.url.windows_link = res.assets
              .filter((element) => {
                return element["name"] == "scratch-link-win.zip";
              })[0]
              .browser_download_url.replace("https://github.com", "");
            this.release.url.macos_link = res.assets
              .filter((element) => {
                return element["name"] == "scratch-link-mac.zip";
              })[0]
              .browser_download_url.replace("https://github.com", "");
            this.release.date = new Date(res.published_at).toLocaleString();
            this.release.scratch_version = JSON.parse(
              res.body
            ).scratch_version.split("-")[0];
            this.release.scratch_link_version = JSON.parse(
              res.body
            ).scratch_version.split("-")[1];

            this.loading = false;
          })
          .catch((err) => {
            this.release.stat = 0;
            this.release.stat = err.response.status;
            this.loading = false;
            return;
          });
      });
  },
};
</script>
