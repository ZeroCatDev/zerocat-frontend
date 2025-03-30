<template>
  <div>
    <v-select
      label="许可证"
      :items="licenseOptions"
      item-title="text"
      item-value="value"
      v-model="selectedLicense"
      :variant="variant"
      :hint="hint"
    ></v-select>
    <p v-if="showHelp" class="text-caption text-medium-emphasis">
      许可证告诉其他人他们可以和不能使用您的代码。
      <a href="https://docs.github.com/zh/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository" target="_blank">了解有关许可证的更多信息</a>
      或<a href="https://choosealicense.com/" target="_blank">选择一个许可证</a>。
    </p>
  </div>
</template>

<script>
export default {
  name: 'LicenseSelector',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    variant: {
      type: String,
      default: 'outlined'
    },
    hint: {
      type: String,
      default: '选择适合您项目的许可证'
    },
    showHelp: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      licenseOptions: [
        { text: "None", value: "" },
        { text: "Apache License 2.0", value: "apache-2.0" },
        { text: "GNU General Public License v3.0", value: "gpl-3.0" },
        { text: "MIT License", value: "mit" },
        { text: 'BSD 2-Clause "Simplified" License', value: "bsd-2-clause" },
        {
          text: 'BSD 3-Clause "New" or "Revised" License',
          value: "bsd-3-clause",
        },
        { text: "Boost Software License 1.0", value: "bsl-1.0" },
        { text: "Creative Commons Zero v1.0 Universal", value: "cc0-1.0" },
        { text: "Eclipse Public License 2.0", value: "epl-2.0" },
        { text: "GNU Affero General Public License v3.0", value: "agpl-3.0" },
        { text: "GNU General Public License v2.0", value: "gpl-2.0" },
        { text: "GNU Lesser General Public License v2.1", value: "lgpl-2.1" },
        { text: "Mozilla Public License 2.0", value: "mpl-2.0" },
        { text: "The Unlicense", value: "unlicense" },
      ]
    };
  },
  computed: {
    selectedLicense: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  }
};
</script> 