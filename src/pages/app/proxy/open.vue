<template>
  <v-container>
    <proxylicense url="https://scratch.mit.edu/explore/projects/all"></proxylicense><br />
    <v-text-field
      label="输入Scratch作品ID"
      variant="outlined"
      v-model="scratchprojectid"
    ></v-text-field>
    <v-btn
      :to="'/app/proxy/' + scratchprojectid"
      :disabled="scratchprojectid == ''"
      color="primary"
      >打开</v-btn
    ><br /><br />
    <v-text-field
      label="输入Scratch工作室ID"
      variant="outlined"
      v-model="scratchstudioid"
    ></v-text-field>
    <v-btn
      :to="'/app/proxy/studio/' + scratchstudioid"
      :disabled="scratchstudioid == ''"
      color="primary"
      >打开</v-btn
    ><br /><br />
    <v-text-field
      label="输入Scratch用户名称"
      variant="outlined"
      v-model="scratchusername"
    ></v-text-field>
    <v-btn
      :to="'/app/proxy/user/' + scratchusername"
      :disabled="scratchusername == ''"
      color="primary"
      >打开</v-btn
    ><br />
  </v-container>
</template>

<script>
import { useHead } from "@unhead/vue";

export default {
  setup() {
    useHead({
      title: "Open Scratch Content",
    });
  },
  data() {
    return {
      scratchprojectid: "",
      scratchstudioid: "",
      scratchusername: "",
    };
  },
  async created() {},
  methods: {},
};
</script>
