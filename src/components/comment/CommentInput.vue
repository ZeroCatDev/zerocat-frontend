<template>
  <v-card class="mt-2" elevation hover border>
    <v-card-title class="headline">为{{ name }}评论</v-card-title>
    <v-card-text>
      <v-form @submit.prevent>
        <v-textarea
          :model-value="modelValue"
          @update:model-value="$emit('update:modelValue', $event)"
          label="评论"
          dense
          auto-grow
          :rules="rules"
          required
        ></v-textarea>
        <v-btn
          color="primary"
          @click="$emit('submit')"
          border
        >
          评论
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const rules = [
  value => !!value || '不可为空'
]
</script>