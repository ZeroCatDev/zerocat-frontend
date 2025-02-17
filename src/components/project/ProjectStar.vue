<template>
  <v-btn-group border density="compact" rounded="lg" size="x-small">
    <v-btn
      @click="ToggleStarProject()"
      variant="tonal"
      class="text-none"
      text="Star"
    >
      <template v-slot:prepend>
        <v-icon
          :icon="star ? 'mdi-star' : 'mdi-star-outline'"
          :color="star ? 'yellow' : ''"
        />
      </template>
      {{ star ? "Starred" : "Star" }} {{ starinfo.count }}
    </v-btn>
    <v-divider color="surface-light" vertical />
    <v-menu :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-btn class="px-5" icon="mdi-menu-down" v-bind="props" />
      </template>
      <v-list>
        <div v-for="item in projectLists" :key="item.id">
          <v-list-item
            :append-icon="
              item.include == true ? 'mdi-minus-circle' : 'mdi-plus-circle'
            "
            :active="item.include == true"
            color="primary"
            @click="
              item.include == true
                ? removeProjectFromList(item.id)
                : addProjectToList(item.id)
            "
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
          </v-list-item>
        </div>
        <v-list-item @click="isVisibleDialog = true">新建列表</v-list-item>
      </v-list>
      <v-dialog v-model="isVisibleDialog" width="auto" min-width="400">
        <v-card prepend-icon="mdi-xml" title="新建列表" border>
          <v-card-text>
            <v-text-field
              label="标题"
              required
              hint="将便于查找"
              v-model="projectlistInfo.title"
            ></v-text-field>
            <v-textarea
              label="描述"
              v-model="projectlistInfo.description"
            ></v-textarea>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text="关闭"
              variant="plain"
              @click="isVisibleDialog = false"
            ></v-btn>
            <v-btn
              color="primary"
              text="创建"
              variant="tonal"
              @click="
                newProjectList();
                isVisibleDialog = false;
              "
              :disabled="created"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-menu>
  </v-btn-group>
</template>

<script>
import openEdit from "../../stores/openEdit";
import request from "../../axios/axios";
import { localuser } from "../../services/localAccount";
export default {
  data() {
    return {
      projectlistInfo: {
        title: "新建项目列表",
        description: "",
      },
      created: false,
      newId: 0,
      isVisibleDialog: false,
      openEdit,
      localuser: localuser,
      userinfo: localuser.user,
      star: false,
      starinfo: {},
      projectLists: [],
      localuser: localuser,
    };
  },
  props: {
    projectId: {
      type: Number,
      required: true,
    },
    starcount: {
      type: Number,
      required: true,
    },
  },
  watch: {
    projectId: {
      immediate: true,
      handler(newVal) {
        this.getStarStatus(newVal);
        this.getProjectList(newVal);
      },
    },
  },
  methods: {
    getStarStatus(projectId) {
      if (!projectId) return;
      request({
        url: `/projectlist/checkstar?projectid=${projectId}`,
        method: "get",
      }).then((res) => {
        this.star = res.data.star;
        this.starinfo = res.data;
        this.starinfo.count = Number(this.starcount);
      });
    },
    ToggleStarProject() {
      if (this.star == 0) {
        request({
          url: `/projectlist/star`,
          method: "post",
          data: {
            projectid: this.projectId,
          },
        }).then((res) => {
          this.star = res.data.star;
          this.starinfo.count = Number(this.starinfo.count) + 1;
        });
      } else {
        request({
          url: `/projectlist/unstar`,
          method: "post",
          data: {
            projectid: this.projectId,
          },
        }).then((res) => {
          this.star = res.data.star;
          this.starinfo.count = Number(this.starinfo.count) - 1;
        });
      }
    },
    async getProjectList(projectId) {
      if (!projectId) return;
      this.projectLists = (
        await request({
          url: "/projectlist/check?projectid=" + projectId,
          method: "get",
        })
      ).data.data;
    },
    async addProjectToList(id) {
      await request({
        url: "/projectlist/add",
        data: {
          userid: this.userinfo.id,
          projectid: this.projectId,
          listid: id,
        },
        method: "post",
      }).then((res) => {
        this.$toast.add({
          severity: "info",
          summary: "info",
          detail: res.data.message,
          life: 3000,
        });
        this.getProjectList(this.projectId);
      });
    },
    async removeProjectFromList(id) {
      await request({
        url: "/projectlist/remove",
        data: {
          projectid: this.projectId,
          listid: id,
        },
        method: "post",
      }).then((res) => {
        this.$toast.add({
          severity: "info",
          summary: "info",
          detail: res.data.message,
          life: 3000,
        });
        this.getProjectList(this.projectId);
      });
    },
    async newProjectList() {
      await request
        .post("/projectlist/create", this.projectlistInfo)
        .then((res) => {
          this.$toast.add({
            severity: "info",
            summary: "info",
            detail: res.data,
            life: 3000,
          });
          if (res.data.status == "success") {
            this.newId = res.data.id;
          }
        });
      this.getProjectList(this.projectId);
    },
  },
};
</script>
