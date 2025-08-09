<template>
  <v-card class="unified-auth" :max-width="maxWidth">
    <v-card-title class="text-h6 pb-2">
      <v-icon :icon="titleIcon" class="mr-2"></v-icon>
      {{ title }}
    </v-card-title>

    <v-card-subtitle v-if="subtitle" class="pb-4">
      {{ subtitle }}
    </v-card-subtitle>

    <v-card-text>
      <v-form @submit.prevent="handleSubmit" v-model="formValid">
        <!-- 认证方式选择器 -->
        <v-chip-group
          v-if="availableMethods.length > 1"
          v-model="selectedMethod"
          mandatory
          class="mb-4"
        >
          <v-chip
            v-if="availableMethods.includes('password')"
            value="password"
            prepend-icon="mdi-lock"
            variant="outlined"
          >
            密码认证
          </v-chip>
          <v-chip
            v-if="availableMethods.includes('email')"
            value="email"
            prepend-icon="mdi-email"
            variant="outlined"
          >
            邮箱认证
          </v-chip>
          <v-chip
            v-if="availableMethods.includes('totp')"
            value="totp"
            prepend-icon="mdi-shield-key"
            variant="outlined"
          >
            TOTP
          </v-chip>
          <v-chip
            v-if="availableMethods.includes('passkey') && isPasskeySupported"
            value="passkey"
            prepend-icon="mdi-fingerprint"
            variant="outlined"
          >
            Passkey
          </v-chip>
        </v-chip-group>

        <!-- 密码认证表单 -->
        <div v-if="selectedMethod === 'password'">
          <!-- 已登录用户显示用户信息 -->
          <v-card
            v-if="isUserLoggedIn"
            variant="outlined"
            class="mb-3 user-info-card"
          >
            <v-card-text class="py-3">
              <div class="d-flex align-center">

                <div class="flex-grow-1">
                  <div class="font-weight-medium">{{ UserInfo.display_name }}</div>
                  <div class="text-caption text-medium-emphasis">@{{ UserInfo.username }}</div>
                </div>
                <v-chip
                  color="success"
                  size="small"
                  variant="flat"
                  class="verified-badge"
                >
                  已登录
                </v-chip>
              </div>
            </v-card-text>
          </v-card>

          <!-- 未登录用户或手动输入模式 -->
          <v-text-field
            v-if="!isUserLoggedIn || showManualInput"
            v-model="passwordForm.identifier"
            :label="identifierLabel"
            :rules="[rules.required]"
            variant="outlined"
            prepend-inner-icon="mdi-account"
            class="mb-3"
            :disabled="loading"
            hint="请输入您的用户名或邮箱"
            persistent-hint
          />

          <!-- 已登录用户的切换按钮
          <div v-if="isUserLoggedIn" class="mb-3">
            <v-btn
              v-if="!showManualInput"
              @click="showManualInput = true"
              variant="outlined"
              size="small"
              prepend-icon="mdi-pencil"
            >
              使用其他账户
            </v-btn>
            <v-btn
              v-else
              @click="showManualInput = false; resetCurrentUserInfo()"
              variant="outlined"
              size="small"
              prepend-icon="mdi-account-check"
            >
              使用当前账户
            </v-btn>
          </div>-->

          <v-text-field
            v-model="passwordForm.password"
            label="密码"
            type="password"
            :rules="[rules.required]"
            variant="outlined"
            prepend-inner-icon="mdi-lock"
            :disabled="loading"
          />
        </div>

        <!-- 邮箱认证表单 -->
        <div v-if="selectedMethod === 'email'">
          <!-- 已登录用户的邮箱选择 -->
          <v-select
            v-if="isUserLoggedIn && userEmails.length > 0"
            v-model="emailForm.email"
            :items="emailSelectItems"
            label="选择邮箱地址"
            :rules="[rules.required]"
            variant="outlined"
            prepend-inner-icon="mdi-email"
            class="mb-3"
            :disabled="loading || emailForm.codeSent"
            :loading="emailsLoading"
            return-value="value"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" class="email-list-item">
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-email</v-icon>
                </template>
                <template v-slot:title>
                  <div class="d-flex align-center">
                    <span class="font-weight-medium">{{ item.title }}</span>
                    <v-chip
                      v-if="item.raw.is_primary"
                      color="primary"
                      size="small"
                      class="ml-2 primary-email-badge"
                      variant="flat"
                    >
                      主邮箱
                    </v-chip>
                  </div>
                </template>
                <template v-slot:subtitle>
                  <v-chip
                    :color="item.raw.verified ? 'success' : 'warning'"
                    size="small"
                    :class="item.raw.verified ? 'verified-badge' : 'unverified-badge'"
                    variant="flat"
                  >
                    {{ item.raw.verified ? '已验证' : '未验证' }}
                  </v-chip>
                </template>
              </v-list-item>
            </template>
          </v-select>

          <!-- 未登录用户或无邮箱时的手动输入 -->
          <v-text-field
            v-if="!isUserLoggedIn || (isUserLoggedIn && userEmails.length === 0)"
            v-model="emailForm.email"
            label="邮箱地址"
            type="email"
            :rules="[rules.required, rules.email]"
            variant="outlined"
            prepend-inner-icon="mdi-email"
            class="mb-3"
            :disabled="loading || emailForm.codeSent"
            hint="请输入您的邮箱地址"
            persistent-hint
          />

          <!-- 如果已登录但没有邮箱，显示提示 -->
          <v-alert
            v-if="isUserLoggedIn && userEmails.length === 0 && !emailsLoading"
            type="info"
            variant="tonal"
            class="mb-3"
          >
            <template v-slot:prepend>
              <v-icon>mdi-information</v-icon>
            </template>
            您的账户暂未绑定邮箱，请手动输入邮箱地址进行验证
          </v-alert>

          <!-- 发送验证码按钮 -->
          <v-btn
            v-if="!emailForm.codeSent"
            @click="sendVerificationCode"
            :loading="codeSending"
            variant="outlined"
            color="primary"
            class="mb-3"
            :disabled="!emailForm.email || loading"
            block
          >
            发送验证码
          </v-btn>

          <!-- 验证码输入 -->
          <div v-if="emailForm.codeSent">
            <v-text-field
              v-model="emailForm.code"
              label="验证码"
              :rules="[rules.required]"
              variant="outlined"
              prepend-inner-icon="mdi-numeric"
              class="mb-3"
              :disabled="loading"
            />

            <v-btn
              @click="resendCode"
              :disabled="resendCountdown > 0 || loading"
              variant="text"
              color="primary"
              size="small"
              class="mb-3"
            >
              {{ resendCountdown > 0 ? `重新发送 (${resendCountdown}s)` : '重新发送验证码' }}
            </v-btn>
          </div>
        </div>

        <!-- TOTP 认证表单 -->
        <div v-if="selectedMethod === 'totp'">
          <v-alert type="info" variant="tonal" class="mb-3" text="请输入您认证器中的6位一次性验证码"></v-alert>
          <div class="d-flex justify-center mb-3">
            <v-otp-input
              v-model="totpForm.code"
              :length="6"
              :disabled="loading"
              type="number"

            />
          </div>
        </div>

        <!-- Passkey 认证按钮 -->
        <div v-if="selectedMethod === 'passkey'">
          <v-alert type="info" variant="tonal" class="mb-3" text="使用设备内的Passkey进行快速验证"></v-alert>
          <v-btn color="primary" :loading="loading" :disabled="!isPasskeySupported" @click="handlePasskey">
            使用 Passkey 验证
          </v-btn>
        </div>

        <!-- 错误信息显示 -->
        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          class="mb-4"
          :text="errorMessage"
        />

        <!-- 操作按钮 -->
        <div class="d-flex justify-end gap-2">
          <v-btn
            v-if="showCancel"
            @click="handleCancel"
            variant="tonal"
            :disabled="loading"
            :append-icon="forceMode ? 'mdi-refresh' : 'mdi-close'"
          >
          取消
          </v-btn>

          <v-btn
            type="submit"
            color="primary"
            :loading="loading"
            :disabled="!canSubmit"
          >
            {{ submitText }}
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { useSudoStore } from '@/stores/sudo';
import { localuser } from '@/services/localAccount.js';
import { getEmails } from '@/services/emailService.js';

export default {
  name: 'UnifiedAuth',

  props: {
    title: {
      type: String,
      default: '身份验证'
    },
    subtitle: {
      type: String,
      default: ''
    },
    purpose: {
      type: String,
      default: 'sudo'
    },
    identifierLabel: {
      type: String,
      default: '用户名或邮箱'
    },
    submitText: {
      type: String,
      default: '验证'
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    forceMode: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: [String, Number],
      default: 400
    },
    userId: {
      type: Number,
      default: null
    }
  },

  data() {
    return {
      sudoStore: useSudoStore(),
      formValid: false,
      loading: false,
      codeSending: false,
      errorMessage: '',
      availableMethods: ['password'],
      selectedMethod: 'password',
      isPasskeySupported: !!(window.PublicKeyCredential),
      resendCountdown: 0,
      resendTimer: null,
      emailsLoading: false,
      userEmails: [],
      showManualInput: false,
      passwordForm: {
        identifier: '',
        password: ''
      },
      emailForm: {
        email: '',
        code: '',
        codeId: null,
        codeSent: false
      },
      totpForm: {
        code: ''
      },
      localuser,
      UserInfo: localuser.user.value,
      rules: {
        required: value => !!value || '此字段必填',
        email: value => {
          const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return pattern.test(value) || '请输入有效的邮箱地址';
        }
      }
    };
  },

  computed: {
    titleIcon() {
      switch (this.purpose) {
        case 'sudo': return 'mdi-shield-account';
        case 'login': return 'mdi-login';
        default: return "mdi-shield-account";
      }
    },

    isUserLoggedIn() {
      return localuser.isLogin.value;
    },

    emailSelectItems() {
      return this.userEmails.map(email => ({
        title: email.contact_value,
        value: email.contact_value,
        raw: email
      }));
    },

    canSubmit() {
      if (!this.formValid || this.loading) return false;

      if (this.selectedMethod === 'password') {
        // 已登录且未开启手动输入模式时，只需要密码
        if (this.isUserLoggedIn && !this.showManualInput) {
          return this.passwordForm.password;
        }
        // 其他情况需要用户名和密码
        return this.passwordForm.identifier && this.passwordForm.password;
      }

      if (this.selectedMethod === 'email') {
        return this.emailForm.email && this.emailForm.code && this.emailForm.codeSent;
      }

      if (this.selectedMethod === 'totp') {
        return !!this.totpForm.code;
      }

      return false;
    },

  },

  watch: {
    selectedMethod() {
      this.errorMessage = '';
      this.passwordForm = { identifier: '', password: '' };
      this.emailForm = { email: '', code: '', codeId: null, codeSent: false };
      this.totpForm = { code: '' };
      this.showManualInput = false;

      if (this.resendTimer) {
        clearInterval(this.resendTimer);
        this.resendTimer = null;
        this.resendCountdown = 0;
      }

      // 当切换到邮箱认证时，加载用户邮箱并自动选中主邮箱
      if (this.selectedMethod === 'email') {
        this.loadUserEmailsAndSelect();
      }

      // 当切换到密码认证时，如果已登录则自动填充用户信息
      if (this.selectedMethod === 'password' && this.isUserLoggedIn) {
        this.fillCurrentUserInfo();
      }
    }
  },

  methods: {

    fillCurrentUserInfo() {
      if (this.isUserLoggedIn) {
        this.passwordForm.identifier = localuser.user.value.username;
      }
    },

    resetCurrentUserInfo() {
      this.passwordForm.identifier = '';
      this.passwordForm.password = '';
    },
    async loadAuthMethods() {
      const result = await this.sudoStore.getAuthMethods();
      if (result.success) {
        const methods = Array.isArray(result.methods) ? [...result.methods] : ['password'];
        if (this.isPasskeySupported && !methods.includes('passkey')) methods.push('passkey');
        this.availableMethods = methods;
        if (methods.length > 0) {
          this.selectedMethod = methods[0];
        }
      }
    },

    async loadUserEmails() {
      if (!this.isUserLoggedIn) {
        this.userEmails = [];
        return;
      }

      this.emailsLoading = true;
      try {
        const response = await getEmails();
        if (response.status === 'success') {
          this.userEmails = response.data || [];
        } else {
          this.userEmails = [];
        }
      } catch (error) {
        console.error('获取邮箱列表失败:', error);
        this.userEmails = [];
      } finally {
        this.emailsLoading = false;
      }
    },

    async loadUserEmailsAndSelect() {
      await this.loadUserEmails();

      // 如果有邮箱列表，自动选中主邮箱
      if (this.userEmails.length > 0) {
        const primaryEmail = this.userEmails.find(email => email.is_primary);
        if (primaryEmail) {
          this.emailForm.email = primaryEmail.contact_value;
        } else {
          // 如果没有主邮箱，选择第一个已验证的邮箱
          const verifiedEmail = this.userEmails.find(email => email.verified);
          if (verifiedEmail) {
            this.emailForm.email = verifiedEmail.contact_value;
          } else {
            // 如果没有已验证的邮箱，选择第一个邮箱
            this.emailForm.email = this.userEmails[0].contact_value;
          }
        }
      }
    },

    async sendVerificationCode() {
      if (!this.emailForm.email) return;

      this.codeSending = true;
      this.errorMessage = '';

      try {
        const result = await this.sudoStore.sendVerificationCode(this.emailForm.email, this.userId);

        if (result.success) {
          this.emailForm.codeId = result.data.code_id;
          this.emailForm.codeSent = true;
          this.startResendCountdown();
        } else {
          this.errorMessage = result.message;
        }
      } finally {
        this.codeSending = false;
      }
    },

    async resendCode() {
      this.emailForm.codeSent = false;
      this.emailForm.code = '';
      this.emailForm.codeId = null;
      await this.sendVerificationCode();
    },

    startResendCountdown() {
      this.resendCountdown = 60;
      this.resendTimer = setInterval(() => {
        this.resendCountdown--;
        if (this.resendCountdown <= 0) {
          clearInterval(this.resendTimer);
          this.resendTimer = null;
        }
      }, 1000);
    },

    async handleSubmit() {
      if (!this.formValid) return;

      this.loading = true;
      this.errorMessage = '';

      try {
        let result;

        if (this.selectedMethod === 'password') {
          result = await this.sudoStore.authenticateWithPassword(
            this.passwordForm.identifier,
            this.passwordForm.password
          );
        } else if (this.selectedMethod === 'email') {
          result = await this.sudoStore.authenticateWithEmail(
            this.emailForm.codeId,
            this.emailForm.code
          );
        } else if (this.selectedMethod === 'totp') {
          result = await this.sudoStore.authenticateWithTotp(
            this.totpForm.code
          );
        } else if (this.selectedMethod === 'passkey') {
          result = await this.sudoStore.authenticateWithPasskey();
        }

        if (result.success) {
          this.$emit('success', result.data);
        } else {
          this.errorMessage = result.message;
          this.$emit('error', result.message);
        }
      } finally {
        this.loading = false;
      }
    },

    async handlePasskey() {
      if (!this.isPasskeySupported) return;
      this.loading = true;
      this.errorMessage = '';
      try {
        const result = await this.sudoStore.authenticateWithPasskey();
        if (result.success) {
          this.$emit('success', result.data);
        } else {
          this.errorMessage = result.message;
          this.$emit('error', result.message);
        }
      } finally {
        this.loading = false;
      }
    },

    handleCancel() {
      if (this.forceMode) {
        window.location.reload();
        return;
      }
      this.$emit('cancel');
    },

    cleanup() {
      if (this.resendTimer) {
        clearInterval(this.resendTimer);
        this.resendTimer = null;
      }
    }
  },

  mounted() {
    this.loadAuthMethods();

    // 如果邮箱认证可用，预加载用户邮箱
    if (this.availableMethods.includes('email')) {
      this.loadUserEmailsAndSelect();
    }

    // 如果已登录且选择的是密码认证，自动填充用户信息
    if (this.isUserLoggedIn && this.selectedMethod === 'password') {
      this.fillCurrentUserInfo();
    }
  },

  beforeDestroy() {
    this.cleanup();
  }
};
</script>

<style scoped>
.unified-auth {
  width: 100%;
}

.gap-2 {
  gap: 8px;
}

/* 邮箱选择框的自定义样式 */
.v-select .v-field__input {
  align-items: center;
}

/* 邮箱下拉选项的美化 */
.v-list-item {
  transition: background-color 0.2s ease;
}

.v-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.08);
}

.email-list-item {
  border-radius: 8px;
  margin: 4px 8px;
  padding: 8px 12px;
}

.email-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.12);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 芯片样式优化 */
.v-chip {
  font-weight: 500;
  letter-spacing: 0.025em;
}

.v-chip.v-chip--size-small {
  height: 22px;
  font-size: 0.75rem;
}

/* 提示信息样式优化 */
.v-alert {
  border-radius: 8px;
}

.v-alert .v-alert__prepend {
  align-self: flex-start;
  margin-top: 2px;
}

/* 加载状态优化 */
.v-progress-circular {
  margin: 0 auto;
}

/* 表单输入框的悬停效果 */
.v-text-field:hover .v-field__outline,
.v-select:hover .v-field__outline {
  border-color: rgba(var(--v-theme-primary), 0.6);
}

/* 表单过渡动画 */
.v-text-field,
.v-select {
  transition: all 0.2s ease;
}

/* 按钮组样式 */
.d-flex.justify-end {
  margin-top: 16px;
}

.v-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.025em;
}

/* 邮箱状态指示器 */
.email-status-chip {
  margin-left: 8px;
  font-weight: 500;
}

/* 主邮箱标识样式 */
.primary-email-badge {
  background: linear-gradient(135deg, var(--v-theme-primary), var(--v-theme-primary-darken-1));
  color: white;
  box-shadow: 0 2px 4px rgba(var(--v-theme-primary), 0.3);
}

/* 验证状态样式 */
.verified-badge {
  background: linear-gradient(135deg, var(--v-theme-success), var(--v-theme-success-darken-1));
  color: white;
}

.unverified-badge {
  background: linear-gradient(135deg, var(--v-theme-warning), var(--v-theme-warning-darken-1));
  color: white;
}

/* 响应式优化 */
@media (max-width: 600px) {
  .v-card-title {
    font-size: 1.1rem !important;
    padding-bottom: 8px;
  }

  .v-card-subtitle {
    font-size: 0.875rem !important;
    padding-bottom: 16px;
  }

  .v-text-field,
  .v-select {
    margin-bottom: 12px;
  }

  .v-chip {
    font-size: 0.7rem;
    height: 20px;
  }
}

/* 暗色主题适配 */
.v-theme--dark .v-list-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.v-theme--dark .v-alert {
  background-color: rgba(var(--v-theme-surface-variant), 0.8);
}
</style>
