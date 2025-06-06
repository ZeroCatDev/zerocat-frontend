<template>
  <div ref="editorContainer" style="height: 100%; width: 100%"></div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

export default {
  name: "MonacoEditorComponent",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      default: "javascript",
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    locale: {
      type: String,
      default: "zh-cn", // 默认中文
    },
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const editorContainer = ref(null);
    let editor = null;
    let contentChangeDisposable = null;
    let resizeObserver = null;
    let monaco = null;

    // 初始化 Monaco Editor
    const initMonaco = () => {
      // 配置 require
      window.require.config({
        paths: {
          vs: "/monaco-editor/min/vs",
        },
        "vs/nls": {
          availableLanguages: {
            "*": props.locale,
          },
        },
      });

      // 加载 Monaco 和额外的语言特性
      window.require(["vs/editor/editor.main"], function (monacoInstance) {
        monaco = monacoInstance;

        // 注册额外的主题
        monaco.editor.defineTheme("monokai", {
          base: "vs-dark",
          inherit: true,
          rules: [
            { token: "comment", foreground: "88846f", fontStyle: "italic" },
            { token: "keyword", foreground: "f92672" },
            { token: "string", foreground: "e6db74" },
            { token: "number", foreground: "ae81ff" },
          ],
          colors: {
            "editor.background": "#272822",
            "editor.foreground": "#f8f8f2",
            "editorLineNumber.foreground": "#90908a",
            "editor.selectionBackground": "#49483e",
            "editor.lineHighlightBackground": "#3e3d32",
          },
        });

        createEditor();
      });
    };

    // 创建编辑器实例
    const createEditor = () => {
      if (!editorContainer.value || !monaco) return;

      // 合并默认选项和传入的选项
      const defaultOptions = {
        value: props.modelValue,
        language: props.language,
        theme: "monokai", // 使用新定义的主题
        fontSize: 14,
        tabSize: 2,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: "on",
        lineNumbers: "on",
        formatOnPaste: true,
        formatOnType: true,
        autoIndent: "full",
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: "on",
        quickSuggestions: true,
        snippetSuggestions: "top",
        renderControlCharacters: true,
        renderWhitespace: "selection",
        bracketPairColorization: {
          enabled: true,
        },
      };

      const options = { ...defaultOptions, ...props.options };

      // 创建编辑器
      editor = monaco.editor.create(editorContainer.value, options);

      // 监听内容变化
      contentChangeDisposable = editor.onDidChangeModelContent(() => {
        const value = editor.getValue();
        emit("update:modelValue", value);
        emit("change", value);
      });

      // 添加ResizeObserver以确保编辑器在容器大小变化时调整大小
      resizeObserver = new ResizeObserver(() => {
        if (editor) {
          editor.layout();
        }
      });

      resizeObserver.observe(editorContainer.value);

      // 确保编辑器初始布局正确
      setTimeout(() => {
        if (editor) {
          editor.layout();
        }
      }, 100);
    };

    // 销毁编辑器
    const disposeEditor = () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }

      if (contentChangeDisposable) {
        contentChangeDisposable.dispose();
        contentChangeDisposable = null;
      }

      if (editor) {
        editor.dispose();
        editor = null;
      }
    };

    // 监听 modelValue 变化
    watch(
      () => props.modelValue,
      (newValue) => {
        if (editor && newValue !== editor.getValue()) {
          editor.setValue(newValue);
        }
      }
    );

    // 监听 language 变化
    watch(
      () => props.language,
      (newLanguage) => {
        if (editor && monaco) {
          const model = editor.getModel();
          if (model) {
            monaco.editor.setModelLanguage(model, newLanguage);
          }
        }
      }
    );

    // 监听 options 变化
    watch(
      () => props.options,
      (newOptions) => {
        if (editor) {
          editor.updateOptions(newOptions);
        }
      },
      { deep: true }
    );

    // 监听 locale 变化
    watch(
      () => props.locale,
      (newLocale) => {
        // 本地化变更需要重新加载编辑器
        disposeEditor();

        // 重新配置本地化
        window.require.config({
          "vs/nls": {
            availableLanguages: {
              "*": newLocale,
            },
          },
        });

        // 重新加载编辑器
        window.require(["vs/editor/editor.main"], function (monacoInstance) {
          monaco = monacoInstance;
          createEditor();
        });
      }
    );

    // 组件挂载时创建编辑器
    onMounted(() => {
      // 检查是否已加载 loader.js
      if (!window.require) {
        // 如果没有加载，创建script标签加载
        const loaderScript = document.createElement("script");
        loaderScript.src = "/monaco-editor/min/vs/loader.js"; // 修改路径指向public目录
        loaderScript.onload = initMonaco;
        document.head.appendChild(loaderScript);
      } else {
        // 如果已加载，直接初始化
        initMonaco();
      }

      // 添加窗口大小变化监听
      window.addEventListener("resize", () => {
        if (editor) {
          editor.layout();
        }
      });
    });

    // 组件卸载前销毁编辑器
    onBeforeUnmount(() => {
      window.removeEventListener("resize", () => {
        if (editor) {
          editor.layout();
        }
      });
      disposeEditor();
    });

    return {
      editorContainer,
    };
  },
};
</script>
