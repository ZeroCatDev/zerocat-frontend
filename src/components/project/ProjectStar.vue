<template>
  <v-btn-group border density="compact" rounded="lg" size="x-small">
    <v-btn
      @click="toggleStar"
      variant="tonal"
      class="text-none"
      text="Star"
      :loading="starLoading"
    >
      <template v-slot:prepend>
        <v-icon
          :icon="isStarred ? 'mdi-star' : 'mdi-star-outline'"
          :color="isStarred ? 'yellow' : ''"
        />
      </template>
      {{ isStarred ? "Starred" : "Star" }} {{ starCount }}
    </v-btn>
    <v-divider color="surface-light" vertical />
    <v-menu :close-on-content-click="false" v-model="menu">
      <template v-slot:activator="{ props }">
        <v-btn class="px-5" icon="mdi-menu-down" v-bind="props" />
      </template>
      
      <v-card min-width="300" max-width="400">
        <v-progress-linear
          v-if="listLoading"
          indeterminate
          color="primary"
        ></v-progress-linear>
        
        <v-list>
          <div v-for="list in myLists" :key="list.id">
            <v-list-item
              :prepend-icon="list.hasProject ? 'mdi-check-circle' : 'mdi-playlist-plus'"
              :active="list.hasProject"
              :prepend-icon-color="list.hasProject ? 'success' : undefined"
              @click.stop="toggleListItem(list.id)"
            >
              <v-list-item-title>{{ list.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ list.description }}</v-list-item-subtitle>
            </v-list-item>
          </div>
          <v-divider class="my-2"></v-divider>
          <v-list-item @click.stop="isVisibleDialog = true">
            <template v-slot:prepend>
              <v-icon>mdi-plus</v-icon>
            </template>
            <v-list-item-title>新建列表</v-list-item-title>
          </v-list-item>
        </v-list>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="关闭" variant="text" @click="menu = false"></v-btn>
        </v-card-actions>
      </v-card>
      
      <v-dialog v-model="isVisibleDialog" width="auto" min-width="400" @click:outside="isVisibleDialog = false">
        <v-card prepend-icon="mdi-format-list-bulleted" title="新建列表" border>
          <v-card-text>
            <v-text-field
              label="标题"
              required
              hint="将便于查找"
              v-model="newListInfo.title"
              :rules="[v => !!v || '标题不能为空']"
            ></v-text-field>
            <v-text-field
              label="简介"
              hint="简要描述列表内容"
              v-model="newListInfo.description"
            ></v-text-field>
            <v-select
              v-model="newListInfo.state"
              :items="listStates"
              item-title="state"
              item-value="abbr"
              label="列表状态"
            ></v-select>
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
              @click.stop="createNewList"
              :loading="creatingList"
              :disabled="!newListInfo.title"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-menu>
  </v-btn-group>
</template>

<script>
import { 
  checkStarStatus, 
  starProject, 
  unstarProject, 
  getProjectStarCount,
  getMyProjectLists,
  addProjectToList,
  removeProjectFromList,
  createProjectList
} from "../../services/projectListService";
import request from "../../axios/axios";

export default {
  props: {
    projectId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      isStarred: false,
      starCount: 0,
      starLoading: false,
      listLoading: false,
      creatingList: false,
      isVisibleDialog: false,
      menu: false,
      myLists: [],
      newListInfo: {
        title: "",
        description: "",
        state: "private"
      },
      listStates: [
        { state: "私密", abbr: "private" },
        { state: "公开", abbr: "public" },
      ]
    };
  },
  async created() {
    await this.checkStarStatus();
    await this.getStarCount();
  },
  watch: {
    menu(val) {
      if (val) {
        this.fetchMyLists();
      }
    }
  },
  methods: {
    async checkStarStatus() {
      try {
        const response = await checkStarStatus(this.projectId);
        if (response.status === "success") {
          this.isStarred = response.star;
        }
      } catch (error) {
        console.error("检查收藏状态失败:", error);
      }
    },
    
    async getStarCount() {
      try {
        const response = await getProjectStarCount(this.projectId);
        if (response.status === "success") {
          this.starCount = response.data;
        }
      } catch (error) {
        console.error("获取收藏数失败:", error);
      }
      this.$emit('star-updated');
    },
    
    async toggleStar() {
      this.starLoading = true;
      try {
        const response = this.isStarred 
          ? await unstarProject(this.projectId)
          : await starProject(this.projectId);
        
        if (response.status === "success") {
          this.isStarred = !this.isStarred;
          await this.getStarCount();
          
          this.$toast.add({
            severity: "success",
            summary: "成功",
            detail: response.message,
            life: 2000,
          });
        }
      } catch (error) {
        console.error("切换收藏状态失败:", error);
        this.$toast.add({
          severity: "error",
          summary: "错误",
          detail: "操作失败",
          life: 3000,
        });
      } finally {
        this.starLoading = false;
      }
    },
    
    async fetchMyLists() {
      this.listLoading = true;
      try {
        // 直接使用 check 接口获取列表和项目状态
        const response = await request.get(`/projectlist/lists/check?projectid=${this.projectId}`);
        if (response.data.status === "success") {
          this.myLists = response.data.data || [];
        } else {
          console.error("获取列表状态失败:", response.data.message);
        }
      } catch (error) {
        console.error("获取我的列表失败:", error);
      } finally {
        this.listLoading = false;
      }
    },
    
    async toggleListItem(listId) {
      // 不设置整体加载状态，避免菜单关闭
      const list = this.myLists.find(l => l.id === listId);
      if (!list) return;
      
      // 只更新当前项的加载状态
      list.loading = true;
      
      try {
        let response;
        if (list.hasProject) {
          // 如果已在列表中，则移除
          response = await removeProjectFromList(listId, this.projectId);
          
          if (response.status === "success") {
            this.$toast.add({
              severity: "success",
              summary: "成功",
              detail: "已从列表中移除",
              life: 3000,
            });
            // 更新本地状态
            list.hasProject = false;
          }
        } else {
          // 如果不在列表中，则添加
          response = await addProjectToList(listId, this.projectId);
          
          if (response.status === "success") {
            this.$toast.add({
              severity: "success",
              summary: "成功",
              detail: "已添加到列表",
              life: 3000,
            });
            // 更新本地状态
            list.hasProject = true;
          }
        }
      } catch (error) {
        console.error("操作列表失败:", error);
        this.$toast.add({
          severity: "error",
          summary: "错误",
          detail: "操作失败",
          life: 3000,
        });
      } finally {
        // 移除当前项的加载状态
        list.loading = false;
      }
    },
    
    async createNewList() {
      if (!this.newListInfo.title) return;
      
      this.creatingList = true;
      try {
        const response = await createProjectList(this.newListInfo);
        
        if (response.status === "success") {
          this.$toast.add({
            severity: "success",
            summary: "成功",
            detail: "列表创建成功",
            life: 3000,
          });
          
          // 重置表单
          this.newListInfo = {
            title: "",
            description: "",
            state: "private"
          };
          
          // 关闭对话框，但保持菜单打开
          this.isVisibleDialog = false;
          
          // 如果创建成功，自动将当前项目添加到新列表
          if (response.data && response.data.id) {
            await addProjectToList(response.data.id, this.projectId);
          }
          
          // 刷新列表
          await this.fetchMyLists();
        } else {
          this.$toast.add({
            severity: "error",
            summary: "错误",
            detail: response.message || "创建列表失败",
            life: 3000,
          });
        }
      } catch (error) {
        console.error("创建列表失败:", error);
        this.$toast.add({
          severity: "error",
          summary: "错误",
          detail: "创建列表失败",
          life: 3000,
        });
      } finally {
        this.creatingList = false;
      }
    }
  }
};
</script>
