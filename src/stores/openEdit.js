export default function open(id, type) {
  if (type == "scratch") {
    if (localStorage.getItem("embedurl")) {
      window.open(
        localStorage.getItem("embedurl") + "/editor.html?id=" + id
      );
    } else {
      window.open("/scratch/editor.html?id=" + id);
    }
  }
  if (type == "python") {
    window.open("/python/edit.html?id=" + id);
  }
  if (type == "text") {
    window.open("/python/edit.html?id=" + id);
  }
}
