<template>
  <v-btn @click="ToggleStarProject()" :color="star ? 'yellow' : ''" prepend-icon="mdi-star" variant="tonal">Star {{ starinfo.count }}</v-btn
  >{{ projectLists }}
</template>
<script>
import NewProjectList from "@/components/projectlist/NewProjectList.vue";
import { localuser } from "@/middleware/userMiddleware";
import request from "../../axios/axios";
export default {
  components: { NewProjectList },

  name: "addtolist",
  props: {
    projectId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      localuser: localuser,
      userinfo: localuser.user,
      newProjectListDialog: false,
      projectLists: "",
      star: false,
      starinfo: {},
    };
  },
  watch: {
    projectId: {
      immediate: true,
      handler(newVal) {
        this.getStarStatus(newVal);
      },
    },
  },
  methods: {
    getStarStatus(projectId) {
      request({
        url: `/projectlist/checkstar?projectid=${projectId}`,
        method: "get",
      }).then((res) => {
        this.star = res.data.star;
        this.starinfo = res.data;
      });
    },
    ToggleStarProject() {
      if (this.star==0) {
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
  },
};
</script>
