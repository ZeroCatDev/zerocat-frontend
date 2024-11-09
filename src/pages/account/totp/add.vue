<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="text-h5">启用二步验证 (2FA)</v-card-title>

          <v-card-text>
            <!-- 显示二维码和相关指示 -->
            <v-alert v-if="errorMessage" type="error" dismissible>
              {{ errorMessage }}
            </v-alert>

            <div v-if="authotpUrl">
              <v-img
                :src="qrCodeUrl"
                alt="QR Code"
                class="ma-auto"
                max-width="250"
              />
              <p class="text-center mt-4">
                扫描二维码并将生成的验证码输入到下方。
              </p>
            </div>

            <!-- 用户输入验证码 -->
            <v-text-field
              v-model="totpCode"
              label="请输入验证码"
              type="number"
              outlined
              dense
              :disabled="!authotpUrl"
            />

            <v-btn
              color="primary"
              :loading="loading"
              @click="activateTOTP"
              block
              :disabled="!totpCode || !authotpUrl"
            >
              启用二步验证
            </v-btn>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="secondary"
              @click="generateTOTP"
              :loading="loading"
              block
            >
              创建 TOTP
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import QRCode from 'qrcode';
import request from "@/axios/axios";

export default {
  name: 'TotpGenerator',
  data() {
    return {
      loading: false,
      totpCode: '',
      authotpUrl: '',
      totp_id: '',
      qrCodeUrl: '',
      errorMessage: ''
    };
  },
  methods: {
    // 请求 TOTP 生成 URL
    async generateTOTP() {
      this.loading = true;
      this.errorMessage = '';

      try {
        const response = await request.post('/account/totp/generate');

        // 获取 otpauth_url
        this.authotpUrl = response.data.otpauth_url;
        this.totp_id = response.data.totp_id;
        // 使用 QRCode 库生成二维码
        this.qrCodeUrl = await QRCode.toDataURL(this.authotpUrl);

      } catch (error) {
        this.errorMessage = error.response?.data?.message || '发生未知错误';
      } finally {
        this.loading = false;
      }
    },

    // 激活 TOTP 验证码
    async activateTOTP() {
      if (!this.totpCode) {
        this.errorMessage = '请输入验证码';
        return;
      }

      this.loading = true;
      this.errorMessage = '';

      try {
        const response = await request.post('/account/totp/activate', {
          totp_token: this.totpCode,
          totp_id: this.totp_id
        });

        if (response.data.status === 'success') {
          this.$toast.add({
            severity: "success",
            summary: "成功",
            detail: "验证器激活成功",
            life: 3000,
          });
        } else {
          this.errorMessage = '验证码无效，请重试';
        }

      } catch (error) {
        this.errorMessage = error.response?.data?.message || '发生未知错误';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.v-alert {
  margin-top: 16px;
}
.v-img {
  max-width: 250px;
}
</style>
