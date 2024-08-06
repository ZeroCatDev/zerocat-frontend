<template>
  <div>
    <div id="recaptcha-container"></div>
  </div>
</template>

<script>
import useRecaptcha from '../stores/useRecaptcha';

export default {
  setup() {
    const { recaptcha, initRecaptcha } = useRecaptcha();

    initRecaptcha();

    return {
      recaptcha,
    };
  },
};
</script>
