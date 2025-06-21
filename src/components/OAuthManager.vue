<template>
    <div class="oauth-binding">
        <v-card>
            <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-link-variant</v-icon>
                <h2>已绑定的 OAuth 账号</h2>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col v-for="(account, index) in oauthAccounts"
                           :key="index"
                           cols="12" sm="6" md="4">
                        <v-card elevation="2" class="oauth-account-card" @click="showAccountDetails(account)">
                            <v-card-text>
                                <div class="d-flex align-center mb-2">
                                    <v-avatar :color="getProviderStyle(account.contact_type.replace('oauth_', '')).backgroundColor" size="40" class="mr-3">
                                        <v-icon :color="getProviderStyle(account.contact_type.replace('oauth_', '')).color">
                                            {{ getProviderIcon(account.contact_type) }}
                                        </v-icon>
                                    </v-avatar>
                                    <div>
                                        <div class="text-h6">{{ getProviderName(account.contact_type) }}</div>
                                        <div class="text-caption">ID: {{ account.contact_id }}</div>
                                    </div>
                                </div>
                                <v-chip small :color="account.verified ? 'success' : 'warning'" class="mr-2">
                                    {{ account.verified ? '已验证' : '未验证' }}
                                </v-chip>
                                <v-chip small :color="account.is_primary ? 'primary' : 'grey'" class="mr-2">
                                    {{ account.is_primary ? '主账号' : '关联账号' }}
                                </v-chip>
                                <div class="mt-2 text-caption">
                                    绑定时间: {{ formatDate(account.created_at) }}
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-alert v-if="message" :type="messageType" class="mt-4">{{ message }}</v-alert>
            </v-card-text>
        </v-card>

        <!-- 账号详细信息对话框 -->
        <v-dialog v-model="showDetailsDialog" max-width="500">
            <v-card>
                <v-card-title class="headline d-flex align-center">
                    <v-avatar :color="getProviderStyle(selectedAccount?.contact_type?.replace('oauth_', '') || '').backgroundColor" size="40" class="mr-3">
                        <v-icon :color="getProviderStyle(selectedAccount?.contact_type?.replace('oauth_', '') || '').color">
                            {{ getProviderIcon(selectedAccount?.contact_type || '') }}
                        </v-icon>
                    </v-avatar>
                    {{ selectedAccount ? getProviderName(selectedAccount.contact_type) : '' }} 账号详情
                </v-card-title>
                <v-card-text>
                    <v-list dense>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-subtitle class="text--primary mb-1">绑定 ID</v-list-item-subtitle>
                                <v-list-item-title>{{ selectedAccount?.contact_id || '-' }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item v-if="selectedAccount?.metadata">
                            <v-list-item-content>
                                <v-list-item-subtitle class="text--primary mb-1">平台用户 ID</v-list-item-subtitle>
                                <v-list-item-title>{{ selectedAccount.metadata.id || '-' }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item v-if="selectedAccount?.metadata">
                            <v-list-item-content>
                                <v-list-item-subtitle class="text--primary mb-1">用户名</v-list-item-subtitle>
                                <v-list-item-title>{{ selectedAccount.metadata.name || '-' }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item v-if="selectedAccount?.metadata">
                            <v-list-item-content>
                                <v-list-item-subtitle class="text--primary mb-1">邮箱</v-list-item-subtitle>
                                <v-list-item-title>{{ selectedAccount.metadata.email || '-' }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-subtitle class="text--primary mb-1">验证状态</v-list-item-subtitle>
                                <v-list-item-title>
                                    <v-chip small :color="selectedAccount?.verified ? 'success' : 'warning'">
                                        {{ selectedAccount?.verified ? '已验证' : '未验证' }}
                                    </v-chip>
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-subtitle class="text--primary mb-1">账号类型</v-list-item-subtitle>
                                <v-list-item-title>
                                    <v-chip small :color="selectedAccount?.is_primary ? 'primary' : 'grey'">
                                        {{ selectedAccount?.is_primary ? '主账号' : '关联账号' }}
                                    </v-chip>
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-subtitle class="text--primary mb-1">绑定时间</v-list-item-subtitle>
                                <v-list-item-title>{{ selectedAccount ? formatDate(selectedAccount.created_at) : '-' }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-subtitle class="text--primary mb-1">最后更新</v-list-item-subtitle>
                                <v-list-item-title>{{ selectedAccount ? formatDate(selectedAccount.updated_at) : '-' }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="showDetailsDialog = false">关闭</v-btn>
                    <v-btn
                        color="error"
                        text
                        @click="prepareUnlink"
                        :disabled="!selectedAccount"
                    >
                        <v-icon left>mdi-link-variant-off</v-icon>
                        解除绑定
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- 解绑确认对话框 -->
        <v-dialog v-model="showUnlinkDialog" max-width="500">
            <v-card>
                <v-card-title class="headline">
                    <v-icon left color="warning">mdi-alert</v-icon>
                    确认解除绑定
                </v-card-title>
                <v-card-text>
                    <p class="mb-2">您确定要解除以下 OAuth 账号的绑定吗？</p>
                    <v-alert type="warning" text dense>
                        <strong>提供商：</strong>{{ selectedAccount ? getProviderName(selectedAccount.contact_type) : '' }}<br>
                        <strong>绑定 ID：</strong>{{ selectedAccount?.contact_id || '-' }}<br>
                        <template v-if="selectedAccount?.metadata">
                            <strong>用户名：</strong>{{ selectedAccount.metadata.name || '-' }}<br>
                            <strong>平台邮箱：</strong>{{ selectedAccount.metadata.email || '-' }}
                        </template>
                    </v-alert>
                    <p class="mt-2 text-caption">解除绑定后，您需要重新进行身份验证才能重新绑定此账号。</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="showUnlinkDialog = false">取消</v-btn>
                    <v-btn color="error" @click="initiateUnlink">
                        <v-icon left>mdi-link-variant-off</v-icon>
                        确认解除绑定
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- 验证码对话框 -->
        <verify-email v-model="showVerifyDialog" :email="primaryEmail" @verified="confirmUnlink" />

        <!-- 可绑定的 OAuth 提供商 -->
        <v-card class="mt-4">
            <v-card-title class="d-flex align-center">
                <v-icon class="mr-2">mdi-link-plus</v-icon>
                <h2>可绑定的 OAuth 提供商</h2>
            </v-card-title>
            <v-card-text>
                <v-alert type="info" text>
                    不论怎样，你都需要确保对绑定账户内邮箱完全的控制。
                </v-alert>
                <v-row class="mt-2">
                    <v-col v-for="(provider, index) in filteredProviders"
                           :key="index"
                           cols="12" sm="6" md="4">
                        <v-btn
                            block
                            height="50"
                            :style="getProviderStyle(provider.id)"
                            @click="bindProvider(provider.id)"
                            class="text-none"
                        >
                            <v-icon left>{{ getProviderIcon(provider.id) }}</v-icon>
                            绑定 {{ provider.name }}
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/axios/axios';
import { localuser } from '@/services/localAccount';
import VerifyEmail from '@/components/verifyEmail.vue';

const oauthAccounts = ref([]);
const message = ref('');
const messageType = ref('info');
const showVerifyDialog = ref(false);
const showUnlinkDialog = ref(false);
const primaryEmail = ref('');
const selectedAccount = ref(null);
const availableProviders = ref([]);
const BASE_API = import.meta.env.VITE_APP_BASE_API;
const showDetailsDialog = ref(false);

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
    "40code": {
        backgroundColor: '#000000',
        color: '#FFFFFF',
    },
    linuxdo: {
        backgroundColor: '#FFD700',
        color: '#000000',
    },
    default: {
        backgroundColor: '#CCCCCC',
        color: '#000000',
    },
};

const providerIcons = {
    google: 'mdi-google',
    microsoft: 'mdi-microsoft',
    github: 'mdi-github',
    "40code": 'mdi-code-braces',
    linuxdo: 'mdi-linux',
    default: 'mdi-link',
};

const getProviderIcon = (providerId) => {
    const id = providerId.replace('oauth_', '').toLowerCase();
    return providerIcons[id] || providerIcons.default;
};

const getProviderName = (providerId) => {
    const id = providerId.replace('oauth_', '').toLowerCase();
    const provider = availableProviders.value.find(p => p.id.toLowerCase() === id);
    return provider ? provider.name : id.charAt(0).toUpperCase() + id.slice(1);
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
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

const showAccountDetails = (account) => {
    selectedAccount.value = account;
    showDetailsDialog.value = true;
};

const prepareUnlink = () => {
    showDetailsDialog.value = false;
    showUnlinkDialog.value = true;
};

const initiateUnlink = () => {
    showUnlinkDialog.value = false;
    showVerifyDialog.value = true;
};

const confirmUnlink = async (code) => {
    try {
        const response = await axios.post('/account/confirm-unlink-oauth', {
            email: primaryEmail.value,
            code,
            provider: selectedAccount.value.contact_type
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
    } finally {
        selectedAccount.value = null;
    }
};

const bindProvider = (providerId) => {
    window.location.href = `${BASE_API}/account/oauth/bind/${providerId}?token=${localuser.getToken()}`;
};

const getProviderStyle = (providerId) => {
    return providerStyles[providerId] || providerStyles.default;
};

const filteredProviders = computed(() => {
    // 获取已绑定的提供商类型列表，移除 oauth_ 前缀
    const boundProviders = oauthAccounts.value.map(account =>
        account.contact_type.toLowerCase().replace('oauth_', '')
    );
    // 过滤掉已绑定的提供商
    return availableProviders.value.filter(provider =>
        !boundProviders.includes(provider.id.toLowerCase())
    );
});

onMounted(() => {
    fetchOAuthAccounts();
    fetchUserEmails();
    fetchAvailableProviders();
});
</script>

<style scoped>
.oauth-account-card {
    transition: all 0.3s ease;
    cursor: pointer;
}

.oauth-account-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;
}
</style>