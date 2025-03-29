<template>
  <div>
    <v-card v-if="loading" class="mb-4">
      <v-card-text class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-card-text>
    </v-card>
    
    <template v-else>
      <v-card v-if="lists.length === 0" class="mb-4">
        <v-card-text class="text-center">
          <v-alert type="info" variant="tonal">
            该用户暂无公开项目列表
          </v-alert>
        </v-card-text>
      </v-card>
      
      <v-row v-else>
        <v-col cols="12" xs="12" sm="6" md="4" lg="3" xl="2" xxl="2" v-for="item in lists" :key="item.id">
          <v-card rounded="lg">
            <v-card :to="'/app/projectlist/' + item.id" rounded="lg" :title="item.title" :subtitle="item.description"
              variant="tonal">
            </v-card>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script>
import { getUserPublicLists } from "../../services/projectListService";

export default {
  name: "UserProjectLists",
  props: {
    userId: {
      type: [Number, String],
      required: true
    },
    projectLists: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      localLists: []
    };
  },
  computed: {
    lists() {
      // 如果传入了列表数据，则使用传入的数据，否则使用从API获取的数据
      return this.projectLists.length > 0 ? this.projectLists : this.localLists;
    }
  },
  watch: {
    userId: {
      immediate: true,
      handler(newVal) {
        if (newVal && this.projectLists.length === 0) {
          this.fetchUserLists();
        }
      }
    }
  },
  methods: {
    async fetchUserLists() {
      this.loading = true;
      try {
        const response = await getUserPublicLists(this.userId);
        if (response.status === "success") {
          this.localLists = response.data || [];
        } else {
          console.error("获取用户列表失败:", response.message);
        }
      } catch (error) {
        console.error("获取用户列表失败:", error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script> 