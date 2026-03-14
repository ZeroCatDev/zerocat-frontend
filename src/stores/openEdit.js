export default function open(id, type, username, projectname) {
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
  if (type == "article") {
    if (username && projectname) {
      window.location.href = `/${username}/articles/${projectname}/edit`;
    } else {
      window.location.href = `/app/articles/edit?id=${id}`;
    }
  }
}
