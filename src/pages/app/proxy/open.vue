<template>
  <v-container>
    <v-card subtitle="这是Scratch上的内容" title="ZeroCatScratchMirror" border>
      <v-card-text class="bg-surface-light pt-4">
        我们使用这种方式促进Scratch及其社区的发展，这些内容是按照<a
          >署名-相同方式共享 2.0 通用</a
        >协议传播的，您可以在<a>https://creativecommons.org/licenses/by-sa/2.0/</a>查看协议全文。
      </v-card-text>
      <template v-slot:actions>
        <v-btn href="https://scratch.mit.edu/explore/projects/all"
          >Scratch上的发现页</v-btn
        >
        <v-btn href="https://scratch.mit.edu/terms_of_use" target="_blank"
          >Scratch使用条款</v-btn
        >
      </template> </v-card
    ><br />
    <v-text-field
      label="输入Scratch作品ID"
      variant="outlined"
      v-model="scratchprojectid"
    ></v-text-field>
    <v-btn
      :to="'/proxy/' + scratchprojectid"
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
      :to="'/proxy/studio/' + scratchstudioid"
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
      :to="'/proxy/user/' + scratchusername"
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
