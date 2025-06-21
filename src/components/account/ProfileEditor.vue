<template>
  <v-form v-model="valid" @submit.prevent="updateProfile">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="profileData.display_name"
          :counter="20"
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
      <v-col cols="12" md="6">
        <v-text-field
          v-model="profileData.location"
          :counter="100"
          label="地点"
          variant="outlined"
          density="comfortable"
          :rules="locationRules"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :model-value="profileData.region?.text || ''"
          label="区域"
          variant="outlined"
          density="comfortable"
          readonly
          :rules="regionRules"
          persistent-hint
          hint="点击选择您所在的区域"
          @click="showRegionDialog = true"
        >
          <template v-slot:append>
            <v-btn
              variant="text"
              icon="mdi-map-marker"
              @click="showRegionDialog = true"
            ></v-btn>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="profileData.url"
          :counter="255"
          label="个人网站"
          variant="outlined"
          density="comfortable"
          :rules="urlRules"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="profileData.birthday"
          label="生日"
          type="date"
          variant="outlined"
          density="comfortable"
          :rules="birthdayRules"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="profileData.motto"
          :counter="500"
          label="一行简介"
          variant="outlined"
          density="comfortable"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-textarea
          label="详细介绍"
          v-model="profileData.bio"
          :counter="2000"
          variant="outlined"
          auto-grow
          rows="3"
          hint="支持Markdown格式"
          persistent-hint
        ></v-textarea>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="profileData.featured_projects"
          label="精选项目ID"
          variant="outlined"
          density="comfortable"
          type="number"
          hint="输入您的项目ID"
          persistent-hint
          :rules="projectIdRules"
        ></v-text-field>
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

    <!-- Region Selection Dialog -->
    <v-dialog v-model="showRegionDialog" max-width="600">
      <v-card>
        <v-card-title class="text-h5 pa-4">
          选择区域
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" @click="showRegionDialog = false"></v-btn>
        </v-card-title>

        <v-card-text class="pa-4">
          <v-text-field
            v-model="regionSearch"
            label="搜索区域"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            class="mb-4"
          ></v-text-field>

          <v-list lines="two" class="region-list">
            <v-list-item
              v-for="region in filteredRegions"
              :key="region.value"
              :title="region.text"
              :subtitle="region.value"
              @click="selectRegion(region)"
            >
              <template v-slot:prepend>
                <v-icon :color="profileData.region?.value === region.value ? 'primary' : undefined">
                  {{ profileData.region?.value === region.value ? 'mdi-check-circle' : 'mdi-earth' }}
                </v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="clearRegion"
          >
            清除选择
          </v-btn>
          <v-btn
            color="primary"
            @click="showRegionDialog = false"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script>
import { updateUserInfo } from "@/services/accountService";
import region_zh_CN from "@/constants/region_zh-CN.json";

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
      showRegionDialog: false,
      regionSearch: '',
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
      regionOptions: Object.entries(region_zh_CN).map(([value, text]) => ({
        value,
        text
      })),
      selectedGender: { state: "未知", abbr: "3" },
      genderOptions: [
        { state: "男", abbr: "0" },
        { state: "女", abbr: "1" },
        { state: "猫娘", abbr: "2" },
        { state: "未知", abbr: "3" },
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
  computed: {
    filteredRegions() {
      if (!this.regionSearch) return this.regionOptions;

      const search = this.regionSearch.toLowerCase();
      return this.regionOptions.filter(region =>
        region.text.toLowerCase().includes(search) ||
        region.value.toLowerCase().includes(search)
      );
    }
  },
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