<template>
  <v-form v-model="valid" @submit.prevent="updateProfile">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="profileData.display_name"
          :counter="10"
          label="显示名称"
          variant="outlined"
          density="comfortable"
          required
          :rules="nameRules"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          v-model="selectedGender"
          :items="genderOptions"
          item-title="state"
          item-value="abbr"
          label="性别"
          variant="outlined"
          density="comfortable"
          persistent-hint
          return-object
        ></v-select>
      </v-col>
      <v-col cols="12">
        <v-textarea
          label="个人简介"
          v-model="profileData.motto"
          :counter="500"
          variant="outlined"
          auto-grow
          rows="3"
        ></v-textarea>
      </v-col>
      <v-col cols="12">
        <v-btn
          @click="updateProfile"
          :disabled="!valid"
          color="primary"
          size="large"
          prepend-icon="mdi-content-save"
          class="px-6"
          :loading="loading"
        >
          保存资料
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { updateUserInfo } from "@/services/accountService";

export default {
  name: "ProfileEditor",
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
      profileData: {
        display_name: this.userData.display_name || '',
        motto: this.userData.motto || '',
      },
      selectedGender: { state: "未知", abbr: "3" },
      genderOptions: [
        { state: "男", abbr: "0" },
        { state: "女", abbr: "1" },
        { state: "猫娘", abbr: "2" },
        { state: "未知", abbr: "3" },
      ],
      nameRules: [
        v => !!v || "名称是必填项",
        v => (v && v.length <= 10) || "名称不能超过10个字符"
      ]
    };
  },
  watch: {
    userData: {
      handler(newVal) {
        this.profileData.display_name = newVal.display_name || '';
        this.profileData.motto = newVal.motto || '';
        this.selectedGender = this.genderOptions.find(item => item.abbr == newVal.sex) || this.genderOptions[3];
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    async updateProfile() {
      if (!this.valid) return;

      this.loading = true;
      try {
        const response = await updateUserInfo({
          display_name: this.profileData.display_name,
          aboutme: this.profileData.motto,
          sex: this.selectedGender.abbr,
        });

        this.$emit('profile-updated', response);
      } catch (error) {
        this.$emit('error', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>