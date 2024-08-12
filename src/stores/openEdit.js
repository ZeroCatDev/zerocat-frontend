export default function open(id,type) {
  if (type == 'scratch') {
    window.open('/scratch/editor.html#' + id)
  }
  if (type == 'python') {
    window.open('/python/edit.html?id=' + id)
  }
  if (type == 'text') {
    window.open('/python/edit.html?id=' + id)
  }
}
