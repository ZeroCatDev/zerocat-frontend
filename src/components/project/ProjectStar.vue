<template>
  <v-btn @click="ToggleStarProject()" :color="star ? 'yellow' : ''" prepend-icon="mdi-star" variant="tonal">Star</v-btn
  >{{ projectLists }}
</template>
<script>
import NewProjectList from "@/components/projectlist/NewProjectList.vue";
import { localuser } from "@/middleware/userMiddleware";
import request from "../../axios/axios";
export default {
  components: { NewProjectList },

  name: "addtolist",
  data() {
    return {
      localuser: localuser,
      userinfo: localuser.user,
      newProjectListDialog: false,
      projectLists: "",
      star: false,
    };
  },
  methods: {
    getStarStatus() {
      request({
        url: `/projectlist/checkstar?projectid=${this.$route.params.id}`,
        method: "get",
      }).then((res) => {
        this.star = res.data.star;
      });
    },
    ToggleStarProject() {
      if (this.star==0) {
        request({
          url: `/projectlist/star`,
          method: "post",
          data: {
            projectid: this.$route.params.id,
          },
        }).then((res) => {
          this.star = res.data.star;
        });
      } else {
        request({
          url: `/projectlist/unstar`,
          method: "post",
          data: {
            projectid: this.$route.params.id,
          },
        }).then((res) => {
          this.star = res.data.star;
        });
      }
    },
  },
  mounted() {
    this.getStarStatus();
  },
};
</script>
