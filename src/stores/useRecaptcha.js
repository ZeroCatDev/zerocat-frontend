import { ref } from 'vue';

export default function useRecaptcha() {
  const recaptcha = ref(null);

  const initRecaptcha = () => {
    window.recaptcha = {
      siteKey: '1x00000000000000000000AA',
      callback: function (token) {
        console.log(`Challenge Success ${token}`);
      },
    };

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?compat=recaptcha&onload=onloadCallback';
    script.async = true;
    script.defer = true;

    document.head.appendChild(script);
  };

  return {
    recaptcha,
    initRecaptcha,
  };
}
