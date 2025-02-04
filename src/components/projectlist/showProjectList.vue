<template>
      <showProjects :projectIds="projectIds" />
</template>

<script>
import { getProjectListById } from "@/services/projectService"; // Assuming this service exists
import showProjects from "../project/showProjects.vue";

export default {
  props: {
    listId: {
      type: String,
      required: true,
    },
  },
  components: {
    showProjects,
  },
  data() {
    return {
      projectIds: [],
    };
  },
  async created() {
    await this.fetchProjectList();
  },
  methods: {
    async fetchProjectList() {
      const response = await getProjectListById(this.listId);
      if (response) {
        this.projectIds = response.projects; // Assuming the response structure
      }
    },
  },
};
</script>
