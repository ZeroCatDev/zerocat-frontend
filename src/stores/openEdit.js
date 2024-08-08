export default function open(id,type) {
  if (type == 'scratch') {
    window.open(import.meta.env.VITE_APP_SCARATCH + '/editor.html#' + id)
  }
  if (type == 'python') {
    window.open(import.meta.env.VITE_APP_PYTHON + '/edit.html?id=' + id)
  }
  if (type == 'text') {
    window.open(import.meta.env.VITE_APP_PYTHON + '/edit.html?id=' + id)
  }
}
