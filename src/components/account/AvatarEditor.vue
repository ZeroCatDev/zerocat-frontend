<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-file-input
        label="上传头像"
        accept="image/*"
        @change="onFileChange"
        placeholder="选择图片上传"
        prepend-icon="mdi-camera"
        variant="outlined"
        density="comfortable"
        show-size
        :rules="[
          v => (!v || !v.length || v[0].size < 2000000) || '头像大小不能超过2MB'
        ]"
      ></v-file-input>
      <div class="text-caption text-medium-emphasis">图片将被自动压缩</div>
    </v-col>
    <v-col cols="12" md="6" class="d-flex align-center justify-center">
      <v-sheet
        :class="['rounded-lg overflow-hidden', 'elevation-2']"
        width="150"
        height="150"
      >
        <v-img
          :src="previewImage || (s3BucketUrl + '/user/' + userData.avatar)"
          height="150"
          width="150"
          cover
          class="bg-grey-lighten-3"
        >
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-icon icon="mdi-image" size="64" color="grey-darken-1"></v-icon>
            </div>
          </template>
        </v-img>
      </v-sheet>
    </v-col>
    <v-col cols="12">
      <v-btn
        @click="uploadAvatar"
        :disabled="!avatarFile"
        color="primary"
        size="large"
        prepend-icon="mdi-cloud-upload"
        class="px-6"
        :loading="loading"
      >
        上传头像
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import Compressor from "compressorjs";
import { uploadUserAvatar } from "@/services/accountService";

export default {
  name: "AvatarEditor",
  props: {
    userData: {
      type: Object,
      required: true
    },
    s3BucketUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      avatarFile: null,
      previewImage: null
    };
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files ? event.target.files[0] : null;
      if (file instanceof File && file.type.startsWith("image/")) {
        new Compressor(file, {
          quality: 0.8,
          maxWidth: 500,
          maxHeight: 500,
          success: (compressedFile) => {
            this.previewImage = URL.createObjectURL(compressedFile);
            this.avatarFile = compressedFile;
          },
          error: (err) => {
            console.error("图片压缩出错：", err.message);
            this.$emit('error', {
              message: "图片压缩出错：" + err.message
            });
          },
        });
      } else if (file) {
        this.$emit('error', {
          message: "请选择有效的图片文件"
        });
      }
    },
    async uploadAvatar() {
      if (!this.avatarFile) return;

      this.loading = true;
      try {
        const formData = new FormData();
        formData.append("zcfile", this.avatarFile);

        const response = await uploadUserAvatar("", formData);
        this.$emit('avatar-updated', response);

        // Reset after successful upload
        this.avatarFile = null;
      } catch (error) {
        this.$emit('error', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>