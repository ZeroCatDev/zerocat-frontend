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
                不论怎样，你都需要确保对绑定账户内邮箱完全的控制。
                <v-list>
                    <v-list-item v-for="(provider, index) in availableProviders" :key="index">
                        <v-list-item-content>
                            <v-list-item-title>
                                <v-btn
                                    :style="getProviderStyle(provider.id)"
                                    @click="bindProvider(provider.id)"
                                >
                                    {{ provider.name }}
                                </v-btn>
                            </v-list-item-title>
                        </v-list-item-content>
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

const providerStyles = {
    google: {
        backgroundColor: '#4285F4',
        color: '#FFFFFF',
    },
    microsoft: {
        backgroundColor: '#F25022',
        color: '#FFFFFF',
    },
    github: {
        backgroundColor: '#333333',
        color: '#FFFFFF',
    },
    default: {
        backgroundColor: '#CCCCCC',
        color: '#000000',
    },
};

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

const prepareUnlink = (email, provider) => {
    providerToUnlink.value = provider;
    showVerifyDialog.value = true;
};

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

const bindProvider = (providerId) => {
    window.location.href = `${BASE_API}/account/oauth/bind/${providerId}?token=${localuser.getToken()}`;
};

const getProviderStyle = (providerId) => {
    return providerStyles[providerId] || providerStyles.default;
};

onMounted(() => {
    fetchOAuthAccounts();
    fetchUserEmails();
    fetchAvailableProviders();
});
</script> 