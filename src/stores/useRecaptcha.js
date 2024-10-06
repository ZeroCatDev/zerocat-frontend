export function initRecaptcha(id, product) {
  console.log(import.meta.env.VITE_APP_GEEID);
  initGeetest4(
    {
      captchaId: import.meta.env.VITE_APP_GEEID,
      product: product || "float",
    },
    function (captchaObj) {
      window.gt4 = captchaObj;
      captchaObj.appendTo(`#${id}`);
      captchaObj
        .onReady(function () {
          console.log(`Challenge Ready`);
        })
        .onSuccess(function () {
          console.log(`Challenge Success`);
        })
        .onError(function () {
          console.log(`Challenge Error`);
        });
    }
  );
}

export function getResponse() {
  return window.gt4.getValidate();
}

export function resetCaptcha() {
  window.gt4.reset();
}
