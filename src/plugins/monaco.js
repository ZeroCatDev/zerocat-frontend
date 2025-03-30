import * as monaco from 'monaco-editor'

// 设置 Monaco 编辑器的语言为中文
monaco.editor.setOptions({
  'semanticHighlighting.enabled': true
})

// 尝试加载中文语言包
try {
  // 这里可以尝试加载中文语言包，但需要额外的配置
  // 由于Monaco Editor的本地化比较复杂，可能需要额外的步骤
  // 这里只是一个示例
  fetch('https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs/editor/editor.main.nls.zh-cn.js')
    .then(response => response.text())
    .then(data => {
      // 执行加载的脚本
      eval(data)
    })
    .catch(err => {
      console.warn('无法加载Monaco Editor中文语言包:', err)
    })
} catch (e) {
  console.warn('加载Monaco Editor中文语言包时出错:', e)
}

// 自定义主题
monaco.editor.defineTheme('myCustomTheme', {
  base: 'vs',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#f5f5f5',
  }
})

export default monaco 