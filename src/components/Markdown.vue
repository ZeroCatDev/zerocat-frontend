<template>
  <!-- 使用默认插槽传入的内容 -->
  <div v-html="sanitizedHtmlContent" ></div>
</template>

<script>
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import createDOMPurify from "dompurify";
import { full as emojiPlugin } from "markdown-it-emoji";
// 初始化并配置 MarkdownIt 实例
function createMarkdownInstance() {
  const md = new MarkdownIt({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs"><code>${
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
          }</code></pre>`;
        } catch (error) {
          console.error("代码高亮出错：", error);
        }
      }
      return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    },
    breaks: true,
    linkify: true,
    typographer: true,
    html: true,
  });

  // 加载插件
  md.use(emojiPlugin);
  return md;
}

// 配置 DOMPurify，添加链接安全性和过滤规则
function createSanitizeFunction() {
  const DOMPurify = createDOMPurify(window);

  // 配置链接处理
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.href && !node.href.startsWith("about:blank#")) {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "nofollow noreferrer noopener");
    }
    if (node.hasAttribute("xlink:href") || node.hasAttribute("href")) {
      node.setAttribute("xlink:show", "new");
    }
    if ("preload" in node) {
      node.setAttribute("preload", "none");
    }
  });

  // 返回实际的内容过滤函数
  return (content) =>
    DOMPurify.sanitize(content, {
      FORBID_TAGS: ["form", "input", "style"],
      FORBID_ATTR: ["autoplay", "style"],
    });
}

export default {
  name: "Markdown",

  data() {
    return {
      markdownInstance: createMarkdownInstance(),
      sanitizeContent: createSanitizeFunction(),
    };
  },

  computed: {
    // 渲染并安全处理内容
    sanitizedHtmlContent() {
      // 通过 slot 的内容作为 Markdown 输入
      const rawContent = this.$slots.default ? this.$slots.default()[0].children : "";
      const renderedMarkdown = this.markdownInstance.render(rawContent);
      return this.sanitizeContent(renderedMarkdown);
    },
  },
};
</script>

<style scoped>
/* Scoped styling, if needed */
</style>
