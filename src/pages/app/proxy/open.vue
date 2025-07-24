<template>
  <v-container>
    <proxylicense url="https://scratch.mit.edu/explore/projects/all"></proxylicense>
    <br/>
    <v-text-field
      v-model="scratchprojectid"
      label="输入Scratch作品ID"
      variant="outlined"
    ></v-text-field>
    <v-btn
      :disabled="scratchprojectid == ''"
      :to="'/app/proxy/' + scratchprojectid"
      color="primary"
    >打开
    </v-btn
    >
    <br/><br/>
    <v-text-field
      v-model="scratchstudioid"
      label="输入Scratch工作室ID"
      variant="outlined"
    ></v-text-field>
    <v-btn
      :disabled="scratchstudioid == ''"
      :to="'/app/proxy/studio/' + scratchstudioid"
      color="primary"
    >打开
    </v-btn
    >
    <br/><br/>
    <v-text-field
      v-model="scratchusername"
      label="输入Scratch用户名称"
      variant="outlined"
    ></v-text-field>
    <v-btn
      :disabled="scratchusername == ''"
      :to="'/app/proxy/user/' + scratchusername"
      color="primary"
    >打开
    </v-btn
    >
    <br/>
  </v-container>
</template>

<script>
import {useHead} from "@unhead/vue";

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
  async created() {
  },
  methods: {},
};
</script>
