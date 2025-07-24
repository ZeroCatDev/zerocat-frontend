<template>
  <div>
    <v-text-field
      :label="label"
      :model-value="modelValue"
      :required="required"
      append-inner-icon="mdi-menu-down"
      readonly
      variant="outlined"
      @click="dialog = true"
    ></v-text-field>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>选择作品类型</v-card-title>
        <v-card-text>
          <v-container>
            <!-- 特殊类型部分 -->
            <v-card-subtitle class="px-0 pt-0">特殊类型</v-card-subtitle>
            <v-row>
              <v-col v-for="(type, key) in specialTypes" :key="key" cols="12" sm="6">
                <v-card
                  :color="modelValue === key ? 'primary' : undefined"
                  class="pa-4 cursor-pointer"
                  variant="outlined"
                  @click="selectLanguage(key)"
                >
                  <div class="d-flex align-center">
                    <v-icon :icon="type.icon" class="mr-2"></v-icon>
                    <div>
                      <div class="text-subtitle-1">{{ type.name }}</div>
                      <div class="text-caption">{{ type.description }}</div>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <!-- 编程语言部分 -->
            <v-card-subtitle class="px-0">编程语言</v-card-subtitle>
            <v-row>
              <v-col v-for="(lang, key) in languages" :key="key" cols="12" sm="6">
                <v-card
                  :color="modelValue === key ? 'primary' : undefined"
                  class="pa-4 cursor-pointer"
                  variant="outlined"
                  @click="selectLanguage(key)"
                >
                  <div class="d-flex align-center">
                    <v-icon :icon="lang.icon" class="mr-2"></v-icon>
                    <div>
                      <div class="text-subtitle-1">{{ lang.name }}</div>
                      <div class="text-caption">{{ key }}</div>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import languages from '@/constants/programming_languages.js'

const specialTypes = {
  'scratch': {
    name: 'Scratch',
    description: '图形化编程语言',
    icon: 'mdi-puzzle',
  },
  'scratch-clipcc': {
    name: 'ClipCC',
    description: 'ClipCC增强版Scratch',
    icon: 'mdi-puzzle-outline',
  },
  'text': {
    name: '纯文本',
    description: '普通文本文件',
    icon: 'mdi-text',
  }
}

export default {
  name: 'LanguageSelector',
  props: {
    modelValue: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: '选择编程语言'
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false,
      languages,
      specialTypes
    }
  },
  methods: {
    selectLanguage(key) {
      this.$emit('update:modelValue', key)
      this.dialog = false
    }
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  opacity: 0.8;
}
</style>
