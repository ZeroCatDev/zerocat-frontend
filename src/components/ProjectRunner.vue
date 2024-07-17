<template><div style="width: 100%; height: 100%;aspect-ratio: 4 / 3;"><iframe :src="embedurl" scrolling="no" frameborder="0" style="width: 100%; height: 100%;"></iframe></div></template>
<script>
export default {
    data() {
        return {
            embedurl: `/`,
            watchedtype: '',
            watchedid: ''
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
    watch
        : {
        type: function (newType) {
            if (newType === 'scratch') {
                this.embedurl = `http://localhost:8601/embed.html#${this.id}`
            }
        },
        id: function (newType) {

            this.watchedid = newType

        },
    }
}
</script>