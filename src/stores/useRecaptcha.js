export function initRecaptcha(id) {
  const script = document.createElement("script");
  script.src =
  import.meta.env.VITE_APP_REURL;
  script.async = true;
  script.defer = true;

  document.head.appendChild(script);
  window.onloadCallback = function () {
    window.grecaptcha.render(`#${id}`, {
      sitekey: import.meta.env.VITE_APP_REKEY,
      callback: function (token) {
        console.log(`Challenge Success ${token}`);
      },
    });
  };
}

export function getResponse() {
  return window.grecaptcha.getResponse();
}

export function resetCaptcha() {
  window.grecaptcha.reset();
}
