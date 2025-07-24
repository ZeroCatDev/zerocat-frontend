<template>
  <v-form v-model="valid" @submit.prevent="changeUsername">
    <v-row>
      <v-col cols="12" md="8">
        <v-text-field
          v-model="username"
          :counter="10"
          :rules="usernameRules"
          density="comfortable"
          label="用户名"
          required
          variant="outlined"
        ></v-text-field>
        <div class="text-caption text-medium-emphasis">用户名只能包含小写字母</div>
      </v-col>
      <v-col cols="12">
        <v-btn
          :disabled="!valid"
          :loading="loading"
          class="px-6"
          color="primary"
          prepend-icon="mdi-check"
          size="large"
          @click="changeUsername"
        >
          保存用户名
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import {updateUsername} from "@/services/accountService";

export default {
  name: "UsernameEditor",
  props: {
    userData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      valid: false,
      username: this.userData.username || '',
      usernameRules: [
        v => !!v || "用户名是必填项",
        v => (v && v.length <= 10) || "用户名不能超过10个字符",
        v => /^[a-z]+$/.test(v) || "用户名只能包含小写字母"
      ]
    };
  },
  watch: {
    userData: {
      handler(newVal) {
        this.username = newVal.username || '';
      },
      immediate: true
    }
  },
  methods: {
    async changeUsername() {
      if (!this.valid) return;

      this.loading = true;
      try {
        const response = await updateUsername({
          username: this.username
        });

        this.$emit('username-updated', response);
      } catch (error) {
        this.$emit('error', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
