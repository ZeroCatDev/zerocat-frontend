<template>
    <v-card :href="'/projects/play?id=' + info.id">



        <v-img v-if="info.type == 'scratch'" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" class="align-end"
            color="surface-variant" :src="'https://s4-1.wuyuan.1r.ink/scratch_slt/' + info.id"
            lazy-src="../assets/scratchdefault.png">
            <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                </div>
            </template>
            <v-card-title class="text-white">
                {{ info.title }}</v-card-title>
        </v-img>


        <v-card-item v-if="info.type == 'python'">

            <v-card-title class="text-white">
                {{ info.title }} </v-card-title>
            <v-card-subtitle class="text-white">
                {{ info.description }} </v-card-subtitle>

        </v-card-item>



        <v-card-item>
            <template v-slot:prepend>
                <v-avatar size="32">
                    <v-img :alt="user.display_name" :src="'https://s4-1.wuyuan.1r.ink/user/' + user.images"></v-img>
                </v-avatar>
            </template>
            <v-card-title class="text-white">
                {{ user.display_name }} </v-card-title>
            <v-card-subtitle class="text-white">
                {{ user.motto }} </v-card-subtitle>

        </v-card-item>
    </v-card>
</template>
<script>
export default {
    data() {
        return {

        }
    },


    props:
    {
        info: {
            type: Object,
            default: ''
        },

        user: {
            type: Object,
            default: '{ "id": 1, "username": "yxhyh", "display_name": "已销号用户", "motto": "已销号用户", "images": "0ec4beb623e3bcdbe0f207c9804f0bc2" }'
        }
    }

}
</script>