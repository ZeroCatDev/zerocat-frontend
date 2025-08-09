# Sudo Token 管理系统

这是一个完整的sudo token管理系统，提供了统一的身份认证界面和token管理功能。

## 核心功能

- ✅ **统一认证界面** - 支持密码和邮箱验证码两种认证方式
- ✅ **Token管理** - 自动处理token存储、过期检查、缓冲时间
- ✅ **弹框认证** - 当需要sudo权限时自动弹出认证对话框
- ✅ **HTTP集成** - 自动为需要sudo的API请求添加认证头
- ✅ **响应式状态** - 实时显示认证状态和剩余时间
- ✅ **错误处理** - 完善的错误处理和用户反馈

## 文件结构

```
src/
├── services/
│   └── sudoService.js          # API服务层
├── stores/
│   └── sudo.js                 # Pinia状态管理
├── components/auth/
│   ├── UnifiedAuth.vue         # 统一认证组件
│   ├── SudoDialog.vue         # Sudo认证弹框
│   ├── SudoManager.vue        # Sudo管理主组件
│   └── SudoExample.vue        # 使用示例
└── composables/
    └── useSudoManager.js      # 全局composable
```

## 快速开始

### 1. 在App.vue中添加SudoManager组件

```vue
<template>
  <div id="app">
    <!-- 你的应用内容 -->
    <router-view />
    
    <!-- 添加sudo管理器 -->
    <SudoManager 
      ref="sudoManager"
      :show-status="true"
      :user-id="currentUserId"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import SudoManager from '@/components/auth/SudoManager.vue';
import { useSudoManager } from '@/composables/useSudoManager';

const sudoManager = ref();
const { setSudoDialogComponent, createSudoInterceptor } = useSudoManager();

onMounted(() => {
  // 注册全局sudo管理器
  setSudoDialogComponent(sudoManager.value);
  
  // 为axios添加sudo拦截器
  createSudoInterceptor(axios);
});
</script>
```

### 2. 在组件中使用

```vue
<script setup>
import { useSudoManager } from '@/composables/useSudoManager';

const { requireSudo, optionalSudo, isSudoValid } = useSudoManager();

// 基本用法
const deleteUser = async () => {
  try {
    // 请求sudo认证
    const sudoToken = await requireSudo({
      title: '删除用户',
      subtitle: '此操作不可逆，请验证身份',
      persistent: true
    });
    
    // 执行需要sudo权限的操作
    await api.deleteUser(userId);
  } catch (error) {
    console.error('操作失败:', error);
  }
};

// 可选认证
const exportData = async () => {
  const sudoToken = await optionalSudo({
    title: '导出数据',
    subtitle: '验证身份可导出敏感数据，否则导出公开数据'
  });
  
  if (sudoToken) {
    // 导出完整数据
    await api.exportFullData();
  } else {
    // 导出公开数据
    await api.exportPublicData();
  }
};
</script>
```

### 3. HTTP请求自动处理

```javascript
// 标记需要sudo的请求
const response = await axios({
  method: 'delete',
  url: '/admin/users/123',
  requireSudo: true  // 自动处理sudo认证
});

// 或者手动添加sudo token
const config = sudoManager.addSudoToRequest({
  method: 'post',
  url: '/admin/settings',
  data: { key: 'value' }
});
const response = await axios(config);
```

## API 参考

### useSudoManager()

返回包含以下方法和状态的对象：

#### 方法

- `requireSudo(options)` - 请求sudo认证，用户必须认证
- `optionalSudo(options)` - 可选sudo认证，用户可以取消
- `isSudoValid()` - 检查当前token是否有效
- `clearSudo()` - 清除sudo token
- `getSudoToken()` - 获取当前token
- `addSudoToRequest(config)` - 为HTTP请求添加sudo token
- `createSudoInterceptor(axios)` - 创建axios拦截器

#### 响应式状态

- `isLoading` - 是否正在认证
- `isTokenValid` - token是否有效
- `tokenExpiresIn` - token剩余时间（秒）
- `sudoToken` - 当前token
- `expiresAt` - token过期时间

### 认证选项 (options)

```javascript
{
  title: '认证标题',           // 对话框标题
  subtitle: '认证说明',        // 对话框副标题
  persistent: false,          // 是否禁止取消
  force: false,              // 是否强制重新认证
  userId: null               // 用户ID（用于发送验证码）
}
```

## 服务端集成

### 中间件使用

```javascript
import { requireSudo, optionalSudo } from '../middleware/sudo.js';

// 强制sudo
router.delete('/admin/users/:id', requireSudo, deleteUser);

// 可选sudo  
router.get('/admin/users', optionalSudo, getUsers);
```

### Sudo Token传递方式

系统支持多种token传递方式：

1. **Authorization头**: `Authorization: Sudo <token>`
2. **自定义头**: `X-Sudo-Token: <token>`
3. **Query参数**: `?sudo_token=<token>`
4. **请求体**: `{"sudo_token": "<token>"}`

## 最佳实践

### 1. 安全性

- Token有30秒的缓冲时间，在过期前自动失效
- Token存储在localStorage，页面刷新后仍然有效
- 支持强制重新认证，确保敏感操作的安全性

### 2. 用户体验

- 使用`optionalSudo`为非关键操作提供可选认证
- 为不同的操作设置合适的标题和说明
- 利用`persistent`选项防止用户意外取消关键操作

### 3. 性能优化

- Token在有效期内不会重复请求认证
- 支持多个并发请求共享同一个认证过程
- 自动处理token过期和刷新

### 4. 错误处理

- 区分用户取消和认证失败
- 提供详细的错误信息
- 支持重试机制

## 注意事项

1. **初始化**: 确保在App.vue中正确初始化SudoManager组件
2. **拦截器**: 只需要设置一次axios拦截器
3. **Token过期**: 系统会自动处理过期token，无需手动处理
4. **并发请求**: 多个并发的sudo请求会共享同一个认证过程

## 故障排除

### 常见问题

1. **"SudoManager组件未初始化"**
   - 确保在App.vue中添加了SudoManager组件
   - 确保调用了`setSudoDialogComponent()`

2. **认证弹框不显示**
   - 检查组件是否正确导入和注册
   - 检查控制台是否有错误信息

3. **Token不生效**
   - 检查服务端是否正确处理sudo token
   - 确认token传递方式是否正确

4. **验证码发送失败**
   - 检查邮箱地址是否有效
   - 确认服务端API是否正常

需要更多帮助，请查看`SudoExample.vue`中的完整示例代码。