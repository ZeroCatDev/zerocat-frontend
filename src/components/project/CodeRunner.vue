<template>
  <div>
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-select
              v-model="selectedLanguage"
              :items="languageOptions"
              class="mb-4"
              item-title="name"
              item-value="key"
              label="Select Language"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-textarea

              v-model="code"
              :label="currentLanguage.placeholder || 'Enter code here'"
              :placeholder="currentLanguage.sample"
              auto-grow
              class="mb-4"
              rows="10"

            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <CodeRunTerminal
      ref="terminal"
      :auto-run="false"
      :code="code"
      :language="selectedLanguage"
    ></CodeRunTerminal>
  </div>
</template>

<script>
import CodeRunTerminal from '@/components/admin/CodeRunTerminal.vue'
import programmingLanguages from '@/constants/programming_languages.js'

export default {
  name: 'CodeRunner',

  components: {
    CodeRunTerminal
  },

  props: {
    projectType: {
      type: String,
      required: true,
      validator: value => ['scratch', 'code'].includes(value)
    },
    initialCode: {
      type: String,
      default: ''
    },
    initialLanguage: {
      type: String,
      default: 'python'
    }
  },

  data() {
    return {
      code: this.initialCode,
      selectedLanguage: this.initialLanguage,
      programmingLanguages
    }
  },

  computed: {
    languageOptions() {
      return Object.entries(this.programmingLanguages).map(([key, lang]) => ({
        key,
        name: lang.name
      }))
    },
    currentLanguage() {
      return this.programmingLanguages[this.selectedLanguage] || {}
    }
  },

  methods: {
    runCode() {
      if (this.$refs.terminal) {
        this.$refs.terminal.runCode()
      }
    }
  },

  watch: {
    initialCode(newVal) {
      this.code = newVal
    },
    initialLanguage(newVal) {
      this.selectedLanguage = newVal
    }
  }
}
</script>

<style scoped>
.v-card {
  margin-bottom: 1rem;
}
</style>
