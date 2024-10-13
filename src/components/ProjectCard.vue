<template>
  <v-card rounded="lg" >
    <v-card :to="'/projects/' + info.id" style="aspect-ratio: 4/3" rounded="lg" >
      <v-img
        :src="'https://s4-1.wuyuan.1r.ink/scratch_slt/' + info.id"
        class="align-end"
        lazy-src="../assets/43-lazyload.png"
        height="100%"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        cover
      >
        <v-card-item>
          <v-card-title>{{ info.title }} </v-card-title>
          <v-card-subtitle>{{ info.description }} </v-card-subtitle>
        </v-card-item>
        <!--<v-card-text>
                    <v-chip size="small">{{ item.type }}</v-chip>
                  </v-card-text>-->
      </v-img>
      <!-- v-img 高度与 v-card-item 一致 -->
    </v-card>

    <!--<v-card flat :to="'/user/' + info.authorid">


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

      </v-card-item></v-card>-->

    <v-card-actions v-if="actions">
      <div v-for="action in actions" :key="action.name">
        <v-btn @click="action.function(info.id, info)">{{ action.name }}</v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  data() {
    return {
      tags: [],
    };
  },

  props: {
    info: {
      type: Object,
      default: "",
    },

    user: {
      type: Object,
      default:
        '{ "id": 1, "username": "yxhyh", "display_name": "已销号用户", "motto": "已销号用户", "images": "0ec4beb623e3bcdbe0f207c9804f0bc2" }',
    },
    actions: {
      type: Array,
      required: false,
    },
  },
  watch: {
    info: {
      immediate: true,
      handler(newVal) {
        if (newVal.tags) {
          this.tags = newVal.tags.split(",");
        } else {
          this.tags = [];
        }
      },
    },
  },
  methods: {
    callFunction(action) {
      action(this.info.id, this.info);
    },
  },
};
</script>
