<template>
  <div v-if='type === "scratch"'>
    <div style="width: 100%; height: 100%;aspect-ratio: 4 / 3;"><iframe :src="embedurl" scrolling="no" frameborder="0"
        style="width: 100%; height: 100%;"></iframe></div>
  </div>
  <div v-if='type === "python"'>
    <div style="width: 100%; height: 100%;aspect-ratio: 4 / 3;"><iframe :src="pythonplayer" scrolling="no"
        frameborder="0" style="width: 100%; height: 100%;"></iframe></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      embedurl: `/`,
      watchedtype: '',
      watchedid: '',
      pythonplayer: '',
    }
  },


  props: {
    type: {
      type: String,
      default: 'text',
    },
    id: {
      type: String,
      default: '1',
    },

  },

  watch: {
    type: function (newType) {
      this.watchedtype = newType
      if (newType === 'scratch') {
        this.embedurl = import.meta.env.VITE_APP_SCARATCH + '/embed.html#' + this.id
      }
      if (newType === 'python') {
        this.pythonplayer = import.meta.env.VITE_APP_PYTHON + '/nextplay.html?id=' + this.id
      }
    },
    id: function (newType) {
      this.watchedid = newType
    },
  }
}
</script>
