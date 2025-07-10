<template>
  <v-dialog v-model="dialogModel" width="auto">
    <v-card hover border>
      <v-container>
        <!-- Main Comment -->
        <v-card class="mb-2" elevation hover border>
          <CommentContent :comment="comment" :s3-bucket-url="s3BucketUrl" />
          <v-card-actions>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" v-bind="props" border></v-btn>
              </template>
              <v-list border>
                <v-list-item
                  v-if="isOwnComment"
                  prepend-icon="mdi-delete"
                  @click="$emit('delete', comment.id)"
                >
                  <v-list-item-title>删除</v-list-item-title>
                </v-list-item>
                <v-list-item
                  prepend-icon="mdi-reply"
                  @click="replyId = comment.id"
                >
                  <v-list-item-title>回复</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-actions>
        </v-card>

        <!-- Child Comments -->
        <v-card
          v-for="child in comment?.children || []"
          :key="child.id"
          class="mb-2"
          elevation
          hover
          border
        >
          <CommentContent :comment="child" :s3-bucket-url="s3BucketUrl" />
          <v-card-actions>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" v-bind="props" border></v-btn>
              </template>
              <v-list border>
                <v-list-item
                  v-if="isOwnComment(child)"
                  prepend-icon="mdi-delete"
                  @click="$emit('delete', child.id)"
                >
                  <v-list-item-title>删除</v-list-item-title>
                </v-list-item>
                <v-list-item
                  prepend-icon="mdi-reply"
                  @click="replyId = child.id"
                >
                  <v-list-item-title>回复</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-actions>
        </v-card>

        <!-- Reply Form -->
        <v-card class="mt-4" elevation hover border>
          <v-card-title class="headline d-flex align-center">
            回复评论 {{ replyId }}
            <v-btn
              v-if="replyId"
              class="ml-2"
              @click="replyId = null"
              variant="text"
            >
              取消
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent>
              <v-textarea
                v-model="replyText"
                label="评论"
                dense
                auto-grow
                :rules="rules"
                required
              ></v-textarea>
              <v-btn
                color="primary"
                @click="handleReply"
                border
              >
                评论
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { localuser } from "@/services/localAccount"
import CommentContent from './CommentContent.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  comment: {
    type: Object,
    required: true
  },
  s3BucketUrl: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'reply', 'delete'])

const replyId = ref(null)
const replyText = ref('')

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const rules = [
  value => !!value || '不可为空'
]

const isOwnComment = (comment) => {
  return comment.user_id === localuser.user.id
}

const handleReply = () => {
  if (!replyText.value) return

  emit('reply', {
    replyTo: replyId.value,
    rootId: props.comment.id,
    text: replyText.value
  })

  replyText.value = ''
  replyId.value = null
}
</script>