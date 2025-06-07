<template>
  <div style="display: flex; justify-content: space-between" class="mb-2">
    <div>
      <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn
            rounded="lg"
            variant="tonal"
            class="text-none"
            prepend-icon="mdi-git"
            append-icon="mdi-menu-down"
            v-bind="props"
          >
            <template v-slot:prepend><v-icon /></template>
            {{ currentBranch }}
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item
            v-for="item in branches"
            :key="item"
            :title="item.name"
            :subtitle="item.description"
            :value="item.name"
            :active="item.name === currentBranch"
            @click="navigateToBranch(item.name)"
          ></v-list-item>
        </v-list>
      </v-menu>
      <v-btn
        class="ml-2"
        variant="text"
        :to="`/${username}/${projectname}/branches`"
        >{{ branches.length }}个分支</v-btn
      >
    </div>
    <v-menu :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-btn
          variant="tonal"
          class="text-none"
          prepend-icon="mdi-history"
          rounded="lg"
          append-icon="mdi-menu-down"
          v-bind="props"
        >
          <template v-slot:prepend><v-icon /></template>
          {{ branchHistory.length }} 次提交
        </v-btn>
      </template>

      <v-list dense>
        <v-list-item
          v-for="item in branchHistory"
          :key="item"
          :title="item.commit_message"
          :subtitle="`${item.commit_date} - #${item.author_id}`"
          :active="item.id === currentCommitId"
          @click="navigateToCommit(item.id)"
        ></v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'ProjectBranchNav',
  props: {
    username: {
      type: String,
      required: true
    },
    projectname: {
      type: String,
      required: true
    },
    currentBranch: {
      type: String,
      required: true
    },
    currentCommitId: {
      type: String,
      default: 'latest'
    },
    branches: {
      type: Array,
      required: true
    },
    branchHistory: {
      type: Array,
      required: true
    }
  },
  methods: {
    navigateToBranch(branchName) {
      this.$router.push(
        `/${this.username}/${this.projectname}/tree/${branchName}`
      );
    },
    navigateToCommit(commitId) {
      this.$router.push(
        `/${this.username}/${this.projectname}/commit/${commitId}`
      );
    }
  }
}
</script>