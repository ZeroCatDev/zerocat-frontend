<template>
  <div ref="editorContainer" style="height: 100%; width: 100%"></div>
</template>

<script>
import {ref, onMounted, onBeforeUnmount, watch} from "vue";

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
      default: "zh-cn",
    },
    projectType: {
      type: String,
      default: "",
    }
  },
  emits: ["update:modelValue", "change", "monaco-ready"],
  setup(props, {emit}) {
    const editorContainer = ref(null);
    let editor = null;
    let contentChangeDisposable = null;
    let resizeObserver = null;
    let monaco = null;
    let disposables = [];

    // 清理所有资源
    const disposeAll = () => {
      // 清理所有注册的disposables
      disposables.forEach(d => d?.dispose());
      disposables = [];

      // 清理编辑器实例
      if (editor) {
        try {
          const model = editor.getModel();
          if (model) {
            model.dispose();
          }
          editor.dispose();
        } catch (e) {
          console.error('Error disposing editor:', e);
        }
        editor = null;
      }

      // 清理ResizeObserver
      if (resizeObserver) {
        try {
          resizeObserver.disconnect();
        } catch (e) {
          console.error('Error disconnecting resize observer:', e);
        }
        resizeObserver = null;
      }

      // 清理内容变化监听器
      if (contentChangeDisposable) {
        try {
          contentChangeDisposable.dispose();
        } catch (e) {
          console.error('Error disposing content change listener:', e);
        }
        contentChangeDisposable = null;
      }

      // 清理monaco实例
      monaco = null;

      // 清理DOM
      if (editorContainer.value) {
        editorContainer.value.innerHTML = '';
      }
    };

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
            {token: "comment", foreground: "88846f", fontStyle: "italic"},
            {token: "keyword", foreground: "f92672"},
            {token: "string", foreground: "e6db74"},
            {token: "number", foreground: "ae81ff"},
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

        // 通知父组件 Monaco 已加载完成
        emit('monaco-ready', {
          monaco: monaco,
          editor: editor,
          availableLanguages: monaco.languages.getLanguages()
        });
      });
    };

    // 创建编辑器实例
    const createEditor = () => {
      if (!editorContainer.value || !monaco) return;

      // 如果有项目类型，尝试设置对应的语言
      let initialLanguage = props.language;
      if (props.projectType) {
        const projectLang = props.projectType.split('-')[0].toLowerCase();
        const availableLangs = monaco.languages.getLanguages();
        const matchedLang = availableLangs.find(lang => lang.id === projectLang);
        if (matchedLang) {
          initialLanguage = matchedLang.id;
        }
      }

      // VSCode风格的默认选项
      const defaultOptions = {
        value: props.modelValue,
        language: initialLanguage,
        theme: "vs-dark",
        fontSize: 14,
        tabSize: 2,
        minimap: {
          enabled: true,
          scale: 2,
          showSlider: "mouseover"
        },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: "on",
        lineNumbers: "on",
        renderLineHighlight: "all",
        formatOnPaste: true,
        formatOnType: true,
        autoIndent: "full",
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: "on",
        quickSuggestions: {
          other: true,
          comments: true,
          strings: true
        },
        snippetSuggestions: "top",
        renderControlCharacters: true,
        renderWhitespace: "selection",
        bracketPairColorization: {
          enabled: true,
          independentColorPoolPerBracketType: true
        },
        guides: {
          bracketPairs: true,
          indentation: true,
          highlightActiveIndentation: true,
          bracketPairsHorizontal: true
        },
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
        smoothScrolling: true,
        mouseWheelZoom: true,
        padding: {
          top: 5,
          bottom: 5
        },
        folding: true,
        foldingHighlight: true,
        unfoldOnClickAfterEndOfLine: true,
        links: true,
        contextmenu: true,
        mouseWheelScrollSensitivity: 1,
        roundedSelection: true,
        scrollbar: {
          verticalScrollbarSize: 12,
          horizontalScrollbarSize: 12,
          useShadows: true,
          verticalHasArrows: false,
          horizontalHasArrows: false,
          arrowSize: 0
        }
      };

      const options = {...defaultOptions, ...props.options};

      // 创建编辑器
      editor = monaco.editor.create(editorContainer.value, options);

      // 监听内容变化
      contentChangeDisposable = editor.onDidChangeModelContent(() => {
        const value = editor.getValue();
        emit("update:modelValue", value);
        emit("change", value);
      });
      disposables.push(contentChangeDisposable);

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

      // 添加编辑器焦点变化监听
      const focusDisposable = editor.onDidFocusEditorText(() => {
        // 获得焦点时强制重新布局
        editor.layout();
      });
      disposables.push(focusDisposable);

      // 添加编辑器配置变化监听
      const configurationDisposable = editor.onDidChangeConfiguration(() => {
        // 配置变化时强制重新布局
        editor.layout();
      });
      disposables.push(configurationDisposable);
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
      {deep: true}
    );

    // 监听 locale 变化
    watch(
      () => props.locale,
      (newLocale) => {
        // 本地化变更需要重新加载编辑器
        disposeAll();

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

    // 监听 projectType 变化
    watch(
      () => props.projectType,
      (newType) => {
        if (editor && monaco && newType) {
          const projectLang = newType.split('-')[0].toLowerCase();
          const availableLangs = monaco.languages.getLanguages();
          const matchedLang = availableLangs.find(lang => lang.id === projectLang);
          if (matchedLang) {
            const model = editor.getModel();
            if (model) {
              monaco.editor.setModelLanguage(model, matchedLang.id);
            }
          }
        }
      }
    );

    // 组件挂载时创建编辑器
    onMounted(() => {
      // 检查是否已加载 loader.js
      if (!window.require) {
        // 如果没有加载，创建script标签加载
        const loaderScript = document.createElement("script");
        loaderScript.src = "/monaco-editor/min/vs/loader.js";
        loaderScript.onload = initMonaco;
        document.head.appendChild(loaderScript);
      } else {
        // 如果已加载，直接初始化
        initMonaco();
      }

      // 添加窗口大小变化监听
      const handleResize = () => {
        if (editor) {
          editor.layout();
        }
      };
      window.addEventListener("resize", handleResize);

      // 添加到disposables以便清理
      disposables.push({
        dispose: () => window.removeEventListener("resize", handleResize)
      });
    });

    // 组件卸载前清理所有资源
    onBeforeUnmount(() => {
      disposeAll();
    });

    return {
      editorContainer,
    };
  },
};
</script>
