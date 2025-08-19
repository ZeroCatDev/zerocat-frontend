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

    <v-dialog v-model="dialog" >
      <v-card>
        <v-card-title>选择作品类型</v-card-title>
        <v-card-text>
          <v-container>
            <v-card-item>
              <v-card-title>特殊类型</v-card-title>
              <v-card-subtitle
                >使用 Scratch编辑器、纯文本展示器</v-card-subtitle
              >
            </v-card-item>
            <v-row>
              <v-col
                v-for="(type, key) in specialTypes"
                :key="key"
                cols="12"
                sm="6"
              >
                <v-card
                  :color="modelValue === key ? 'primary' : undefined"
                  class="pa-4 cursor-pointer"
                  :variant="modelValue === key ? 'tonal':undefined"
                  @click="selectLanguage(key)"
                  border
                  hover
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

            <!-- 编程语言部分 --><v-card-item>
              <v-card-title>编程语言</v-card-title>
              <v-card-subtitle>使用 CodeRun 在线运行代码</v-card-subtitle>
            </v-card-item>
            <v-row>
              <v-col
                v-for="(lang, key) in languages"
                :key="key"
                cols="12"
                sm="6"
              >
                <v-card
                  :color="modelValue === key ? 'primary' : undefined"
                  class="pa-4 cursor-pointer"
                  :variant="modelValue === key ? 'tonal':undefined"
                  @click="selectLanguage(key)"
  border
                  hover
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
import languages from "@/constants/programming_languages.js";
import specialTypes from "@/constants/special_languages.js";


export default {
  name: "LanguageSelector",
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "选择编程语言",
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialog: false,
      languages,
      specialTypes,
    };
  },
  methods: {
    selectLanguage(key) {
      this.$emit("update:modelValue", key);
      this.dialog = false;
    },
  },
};
</script>
