<template>
    <div class="oauth-binding">
        <v-card>
            <v-card-title>
                <h2>已绑定的 OAuth 账号</h2>
            </v-card-title>
            <v-card-text>
                <v-list>
                    <v-list-item-group>
                        <v-list-item v-for="(account, index) in oauthAccounts" :key="index">
                            <v-list-item-content>
                                <v-list-item-title>{{ account.contact_value }}</v-list-item-title>
                                <v-list-item-subtitle>{{ account.contact_type }}</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn @click="prepareUnlink(account.contact_value, account.contact_type)"
                                    color="red">解绑</v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
                <v-alert v-if="message" :type="messageType">{{ message }}</v-alert>
            </v-card-text>
        </v-card>

        <!-- 验证码对话框 -->
        <verify-email v-model="showVerifyDialog" :email="primaryEmail" @verified="confirmUnlink" />

        <!-- 可绑定的 OAuth 提供商 -->
        <v-card class="mt-4">
            <v-card-title>
                <h2>可绑定的 OAuth 提供商</h2>
            </v-card-title>
            <v-card-text>
                绑定提供商是按照邮箱验证的，也就是说你需要先将你的邮箱绑定到账户才会将这个登录提供商的oauth绑定到账户。
                <v-list>
                    <v-list-item v-for="(provider, index) in availableProviders" :key="index">
                        <v-list-item-content>
                            <v-list-item-title>{{ provider.name }}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-btn @click="bindProvider(provider.id)" color="primary">绑定</v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/axios/axios';
import { localuser } from '@/services/localAccount';
import VerifyEmail from '@/components/verifyEmail.vue';

const oauthAccounts = ref([]);
const message = ref('');
const messageType = ref('info');
const showVerifyDialog = ref(false);
const primaryEmail = ref('');
const providerToUnlink = ref('');
const availableProviders = ref([]);
const BASE_API = import.meta.env.VITE_APP_BASE_API
// 获取用户绑定的 OAuth 账号
const fetchOAuthAccounts = async () => {
    try {
        const response = await axios.post('/account/oauth/bound', { userid: localuser.user.value.id });
        if (response.data.status === 'success') {
            oauthAccounts.value = response.data.data;
        } else {
            message.value = response.data.message;
            messageType.value = 'error';
        }
    } catch (error) {
        message.value = error.response?.data?.message || '获取绑定的 OAuth 账号失败';
        messageType.value = 'error';
    }
};

// 获取用户的邮箱列表
const fetchUserEmails = async () => {
    try {
        const response = await axios.get('/account/emails');
        if (response.data.status === 'success') {
            const emails = response.data.data;
            const primary = emails.find(email => email.is_primary);
            if (primary) {
                primaryEmail.value = primary.contact_value;
            }
        } else {
            message.value = response.data.message;
            messageType.value = 'error';
        }
    } catch (error) {
        message.value = error.response?.data?.message || '获取邮箱列表失败';
        messageType.value = 'error';
    }
};

// 获取可绑定的 OAuth 提供商
const fetchAvailableProviders = async () => {
    try {
        const response = await axios.get('/account/oauth/providers');
        if (response.data.status === 'success') {
            availableProviders.value = response.data.data;
        } else {
            message.value = response.data.message;
            messageType.value = 'error';
        }
    } catch (error) {
        message.value = error.response?.data?.message || '获取可绑定的 OAuth 提供商失败';
        messageType.value = 'error';
    }
};

// 准备解绑操作，显示验证码对话框
const prepareUnlink = (email, provider) => {
    providerToUnlink.value = provider;
    showVerifyDialog.value = true;
};

// 确认解绑操作
const confirmUnlink = async (code) => {
    try {
        const response = await axios.post('/account/confirm-unlink-oauth', {
            email: primaryEmail.value,
            code,
            provider: providerToUnlink.value
        });

        if (response.data.status === 'success') {
            message.value = '成功解绑 OAuth 账号';
            messageType.value = 'success';
            fetchOAuthAccounts();
        } else {
            message.value = response.data.message || '解绑失败';
            messageType.value = 'error';
        }
    } catch (error) {
        message.value = error.response?.data?.message || '解绑 OAuth 账号失败';
        messageType.value = 'error';
    }
};

// 绑定 OAuth 提供商
const bindProvider = (providerId) => {
    window.location.href = `${BASE_API}/account/oauth/${providerId}?token=${localuser.getToken()}`;
};

// 页面加载时获取 OAuth 账号和邮箱列表
onMounted(() => {
    fetchOAuthAccounts();
    fetchUserEmails();
    fetchAvailableProviders();
});
</script>

<style scoped>
.oauth-binding {
    padding: 20px;
}
</style>
