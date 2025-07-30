<template>
  <v-form v-model="valid" @submit.prevent="updateProfile">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="profileData.display_name"
          :counter="20"
          :rules="nameRules"
          density="comfortable"
          label="显示名称"
          required
          variant="outlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          v-model="selectedGender"
          :items="genderOptions"
          density="comfortable"
          item-title="state"
          item-value="abbr"
          label="性别"
          persistent-hint
          return-object
          variant="outlined"
        ></v-select>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="profileData.location"
          :counter="100"
          :rules="locationRules"
          density="comfortable"
          label="地点"
          variant="outlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :model-value="profileData.region?.text || ''"
          :rules="regionRules"
          density="comfortable"
          hint="点击选择您所在的区域"
          label="区域"
          persistent-hint
          readonly
          variant="outlined"
          @click="showRegionDialog = true"
        >
          <template v-slot:append>
            <v-btn
              icon="mdi-map-marker"
              variant="text"
              @click="showRegionDialog = true"
            ></v-btn>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="profileData.url"
          :counter="255"
          :rules="urlRules"
          density="comfortable"
          label="个人网站"
          variant="outlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="profileData.birthday"
          :rules="birthdayRules"
          density="comfortable"
          label="生日"
          type="date"
          variant="outlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="profileData.motto"
          :counter="500"
          density="comfortable"
          label="一行简介"
          variant="outlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-textarea
          v-model="profileData.bio"
          :counter="2000"
          auto-grow
          hint="支持Markdown格式"
          label="详细介绍"
          persistent-hint
          rows="3"
          variant="outlined"
        ></v-textarea>
      </v-col>

      <v-col cols="12" md="6">
        <ProjectSelector
          v-model="profileData.featured_projects"
          :multiple="false"
          :author="'me'"
        />
        <v-text-field
        disabled
          v-model="profileData.featured_projects"
          :rules="projectIdRules"
          density="comfortable"
          hint="输入您的项目ID"
          label="精选项目ID"
          persistent-hint
          type="number"
          variant="outlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-btn
          :disabled="!valid"
          :loading="loading"
          class="px-6"
          color="primary"
          prepend-icon="mdi-content-save"
          size="large"
          @click="updateProfile"
        >
          保存资料
        </v-btn>
      </v-col>
    </v-row>

    <RegionSelector
      v-model="showRegionDialog"
      :selected-region="profileData.region"
      @clear="clearRegion"
      @select="selectRegion"
    />
  </v-form>
</template>

<script>
import {updateUserInfo} from "@/services/accountService";
import region_zh_CN from "@/constants/region_zh-CN.json";
import RegionSelector from "./RegionSelector.vue";
import ProjectSelector from "../shared/ProjectSelector.vue";

export default {
  name: "ProfileEditor",
  components: {
    RegionSelector,
    ProjectSelector
  },
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
      showRegionDialog: false,
      profileData: {
        display_name: this.userData.display_name || '',
        motto: this.userData.motto || '',
        bio: this.userData.bio || '',
        location: this.userData.location || '',
        region: this.userData.region ? {
          value: this.userData.region,
          text: region_zh_CN[this.userData.region] || ''
        } : null,
        url: this.userData.url || '',
        birthday: this.userData.birthday || '',
        featured_projects: this.userData.featured_projects || ''
      },
      selectedGender: {state: "未知", abbr: "3"},
      genderOptions: [
        {state: "男", abbr: "0"},
        {state: "女", abbr: "1"},
        {state: "猫娘", abbr: "2"},
        {state: "未知", abbr: "3"},
      ],
      nameRules: [
        v => !!v || "名称是必填项",
        v => (v && v.length <= 20) || "名称不能超过20个字符"
      ],
      locationRules: [
        v => !v || v.length <= 100 || "地址不能超过100个字符"
      ],
      regionRules: [
        v => !v || v.length <= 100 || "区域不能超过100个字符"
      ],
      urlRules: [
        v => !v || v.length <= 255 || "URL不能超过255个字符",
        v => !v || /^https?:\/\/.*/.test(v) || "URL必须以http://或https://开头"
      ],
      birthdayRules: [
        v => !v || /^\d{4}-\d{2}-\d{2}$/.test(v) || "生日格式必须为YYYY-MM-DD"
      ],
      projectIdRules: [
        v => !v || /^\d+$/.test(v) || "项目ID必须是数字"
      ]
    };
  },
  computed: {},
  watch: {
    userData: {
      handler(newVal) {
        this.profileData = {
          display_name: newVal.display_name || '',
          motto: newVal.motto || '',
          bio: newVal.bio || '',
          location: newVal.location || '',
          region: newVal.region ? {
            value: newVal.region,
            text: region_zh_CN[newVal.region] || ''
          } : null,
          url: newVal.url || '',
          birthday: newVal.birthday ? this.formatDateForInput(newVal.birthday) : '',
          featured_projects: newVal.featured_projects || ''
        };
        this.selectedGender = this.genderOptions.find(item => item.abbr == newVal.sex) || this.genderOptions[3];
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    formatDateForInput(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    },
    selectRegion(region) {
      this.profileData.region = region;
      this.showRegionDialog = false;
    },
    clearRegion() {
      this.profileData.region = null;
      this.showRegionDialog = false;
    },
    async updateProfile() {
      if (!this.valid) return;

      this.loading = true;
      try {
        const response = await updateUserInfo({
          display_name: this.profileData.display_name,
          motto: this.profileData.motto,
          bio: this.profileData.bio,
          location: this.profileData.location,
          region: this.profileData.region?.value || '',
          sex: this.selectedGender.abbr,
          url: this.profileData.url,
          birthday: this.profileData.birthday,
          featured_projects: this.profileData.featured_projects || undefined
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

<style scoped>
.region-list {
  max-height: 400px;
  overflow-y: auto;
}
</style>
