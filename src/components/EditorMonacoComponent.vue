<template>
  <div ref="editorContainer" class="editor-monaco-container"></div>
</template>

<script>
import * as monaco from 'monaco-editor';

export default {
  name: 'EditorMonacoComponent',
  props: {
    value: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: 'javascript'
    },
    options: {
      type: Object,
      default: () => ({})
    },
    height: {
      type: String,
      default: '100%'
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:value', 'change', 'monaco-ready'],
  data() {
    return {
      editor: null,
      model: null,
      isDestroyed: false,
      defaultOptions: {
        theme: 'vs-dark',
        fontSize: 14,
        tabSize: 2,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: 'on',
        lineNumbers: 'on',
        glyphMargin: true,
        folding: true,
        lineDecorationsWidth: 10,
        lineNumbersMinChars: 3,
        contextmenu: true,
        find: {
          autoFindInSelection: 'always'
        }
      }
    };
  },
  watch: {
    value(newValue) {
      if (this.editor && !this.isDestroyed && newValue !== this.getValue()) {
        this.setValue(newValue);
      }
    },
    language(newValue) {
      if (this.model && !this.isDestroyed) {
        monaco.editor.setModelLanguage(this.model, newValue);
      }
    },
    options: {
      deep: true,
      handler(newOptions) {
        if (this.editor && !this.isDestroyed) {
          this.editor.updateOptions(newOptions);
        }
      }
    },
    readonly(newValue) {
      if (this.editor && !this.isDestroyed) {
        this.editor.updateOptions({ readOnly: newValue });
      }
    }
  },
  mounted() {
    this.initMonaco();
  },
  beforeUnmount() {
    this.destroyEditor();
  },
  methods: {
    initMonaco() {
      if (this.isDestroyed) return;

      const container = this.$refs.editorContainer;
      if (!container) return;

      container.style.height = this.height;

      const editorOptions = {
        ...this.defaultOptions,
        ...this.options,
        value: this.value,
        language: this.language,
        readOnly: this.readonly
      };

      try {
        this.editor = monaco.editor.create(container, editorOptions);
        this.model = this.editor.getModel();

        this.editor.onDidChangeModelContent(() => {
          if (!this.isDestroyed) {
            const value = this.getValue();
            this.$emit('update:value', value);
            this.$emit('change', value);
          }
        });

        this.$nextTick(() => {
          if (!this.isDestroyed) {
            this.$emit('monaco-ready', {
              monaco,
              editor: this.editor,
              model: this.model,
              availableLanguages: monaco.languages.getLanguages()
            });
          }
        });
      } catch (error) {
        console.error('Failed to initialize Monaco editor:', error);
      }
    },

    destroyEditor() {
      this.isDestroyed = true;
      
      if (this.editor) {
        try {
          if (this.model) {
            this.model.dispose();
            this.model = null;
          }
          this.editor.dispose();
        } catch (error) {
          console.error('Error disposing Monaco editor:', error);
        } finally {
          this.editor = null;
        }
      }
    },

    getValue() {
      if (!this.editor || this.isDestroyed) return '';
      try {
        return this.editor.getValue();
      } catch (error) {
        console.error('Error getting editor value:', error);
        return '';
      }
    },

    setValue(value) {
      if (!this.editor || this.isDestroyed) return;
      try {
        const currentValue = this.editor.getValue();
        if (value !== currentValue) {
          this.editor.setValue(value || '');
        }
      } catch (error) {
        console.error('Error setting editor value:', error);
      }
    },

    focus() {
      if (this.editor && !this.isDestroyed) {
        try {
          this.editor.focus();
        } catch (error) {
          console.error('Error focusing editor:', error);
        }
      }
    },

    layout() {
      if (this.editor && !this.isDestroyed) {
        try {
          this.editor.layout();
        } catch (error) {
          console.error('Error laying out editor:', error);
        }
      }
    },

    getPosition() {
      if (!this.editor || this.isDestroyed) return null;
      try {
        return this.editor.getPosition();
      } catch (error) {
        console.error('Error getting editor position:', error);
        return null;
      }
    },

    setPosition(position) {
      if (!this.editor || this.isDestroyed || !position) return;
      try {
        this.editor.setPosition(position);
      } catch (error) {
        console.error('Error setting editor position:', error);
      }
    }
  }
};
</script>

<style scoped>
.editor-monaco-container {
  width: 100%;
  min-height: 100px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}
</style>