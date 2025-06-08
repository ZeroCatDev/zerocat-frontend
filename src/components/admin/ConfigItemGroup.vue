<template>
  <v-container class="pa-0">
    <v-row v-for="item in Array.from(new Set(configs.map(c => c.key))).map(key => configs.find(c => c.key === key))" :key="item.key" class="mb-4">

      <v-col cols="12">
        <div class="d-flex align-center mb-2">
          <span class="text-subtitle-1">{{ item.description||item.key }}</span>
          <v-chip
            v-if="isItemEdited(item)"
            color="warning"
            size="small"
            class="ml-2"
          >
            未保存
          </v-chip>
          <v-chip
            v-else-if="isDifferentFromDefault(item)"
            color="info"
            size="small"
            class="ml-2"
          >
            已修改
          </v-chip>
          <v-chip
            v-if="item.public"
            color="success"
            size="small"
            class="ml-2"
          >
            公开
          </v-chip>
          <v-chip
            v-if="item.required"
            color="error"
            size="small"
            class="ml-2"
          >
            必填
          </v-chip>
          <v-chip
            v-if="item.fromSystem"
            color="primary"
            size="small"
            class="ml-2"
          >
            系统
          </v-chip>
          <v-spacer></v-spacer>
          <v-menu v-if="!item.fromSystem">
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-dots-vertical"
                size="small"
                variant="text"
                v-bind="props"
              />
            </template>
            <v-list>
              <v-list-item
                @click="copyToClipboard(item.key)"
                prepend-icon="mdi-key"
              >
                <v-list-item-title>复制键名</v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="copyToClipboard(localValues[item.key])"
                prepend-icon="mdi-content-copy"
              >
                <v-list-item-title>复制值</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item
                @click="confirmDelete(item)"
                prepend-icon="mdi-delete"
                color="error"
              >
                <v-list-item-title>删除</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <div class="d-flex align-center">
          <div
            class="flex-grow-1"
            :style="item.type === 'array' ? {} : { maxWidth: '400px' }"
          >
            <!-- 字符串类型 -->
            <v-text-field
              v-if="item.type === 'string'"
              :model-value="localValues[item.key]"
              :placeholder="item.default"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              @update:model-value="(value) => handleUpdate(item.key, value)"
              @keydown.enter="saveItem(item)"
              :loading="savingItems[item.key]"
            >
              <template v-slot:append>
                <v-btn
                  v-if="isItemEdited(item)"
                  color="success"
                  size="small"
                  variant="tonal"
                  @click="saveItem(item)"
                  :loading="savingItems[item.key]"
                  icon="mdi-check"
                >
                </v-btn>
                <v-btn
                  v-if="isItemEdited(item)"
                  color="error"
                  size="small"
                  icon="mdi-close"
                  @click="revertEdit(item)"
                  variant="tonal"
                >
                </v-btn>
                <v-btn
                  v-if="isDifferentFromDefault(item) && !isItemEdited(item)"
                  color="warning"
                  size="small"
                  icon="mdi-refresh"
                  variant="tonal"
                  @click="resetToDefault(item)"
                >
                </v-btn>
              </template>
            </v-text-field>

            <!-- 数组类型 -->
            <div v-else-if="item.type === 'array'" class="array-editor">

              <!-- 数组项显示 -->
              <div class="d-flex flex-wrap gap-2 mb-2">
                <template v-if="localValues[item.key]?.length">
                  <v-chip
                    v-for="(value, index) in localValues[item.key]"
                    :key="index"
                    closable
                    size="small"
                    @click:close="handleArrayItemRemove(item, index)"
                  >
                    {{ value }}
                  </v-chip>
                </template>
                <div v-else class="text-caption text-grey">
                  暂无列表项
                </div>
              </div>
              <v-text-field
                v-model="newArrayItem"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                placeholder="输入新项目，多个项目用逗号分隔"
                @keydown.enter="
                  (e) => {
                    handleArrayItemAdd(item, e.target.value);
                    e.target.value = '';
                    newArrayItem = '';
                  }
                "
                :loading="savingItems[item.key]"
              >
                <template v-slot:append>
                  <v-btn
                    color="primary"
                    size="small"
                    variant="tonal"
                    @click="
                      () => {
                        handleArrayItemAdd(item, newArrayItem);
                        newArrayItem = '';
                      }
                    "
                    icon="mdi-plus"
                  >

                  </v-btn>
                  <v-btn
                    v-if="isItemEdited(item)"
                    color="success"
                    size="small"
                    variant="tonal"
                    @click="saveItem(item)"
                    :loading="savingItems[item.key]"
                    icon="mdi-check"
                  >
                  </v-btn>
                  <v-btn
                    v-if="isItemEdited(item)"
                    color="error"
                    size="small"
                    icon="mdi-close"
                    @click="revertEdit(item)"
                    variant="tonal"
                  >
                  </v-btn>
                  <v-btn
                    v-if="isDifferentFromDefault(item) && !isItemEdited(item)"
                    color="warning"
                    size="small"
                    icon="mdi-refresh"
                    variant="tonal"
                    @click="resetToDefault(item)"
                  >
                  </v-btn>
                </template>
              </v-text-field>

            </div>

            <!-- 选择类型 -->
            <v-select
              v-else-if="item.type === 'enum'"
              :model-value="localValues[item.key]"
              :items="item.options"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              @update:model-value="(value) => handleUpdate(item.key, value)"
              :append-inner-icon="getAppendInnerIcon(item)"
              @click:append-inner="handleAppendInnerClick(item)"
              :loading="savingItems[item.key]"
            >
              <template v-slot:append>
                <v-icon
                  v-if="isItemEdited(item)"
                  color="error"
                  icon="mdi-close"
                  @click="revertEdit(item)"
                />
              </template>
            </v-select>

            <!-- 布尔类型 -->
            <v-switch
              v-else-if="item.type === 'boolean'"
              :model-value="localValues[item.key]"
              :label="localValues[item.key] ? '启用' : '禁用'"
              color="primary"
              hide-details="auto"
              @update:model-value="(value) => handleUpdate(item.key, value)"
            >
              <template v-slot:append>
                <div class="d-flex align-center">
                  <v-icon
                    v-if="isItemEdited(item)"
                    color="success"
                    icon="mdi-check"
                    class="mr-2"
                    @click="saveItem(item)"
                    :loading="savingItems[item.key]"
                  />
                  <v-icon
                    v-if="isItemEdited(item)"
                    color="error"
                    icon="mdi-close"
                    @click="revertEdit(item)"
                  />
                  <v-icon
                    v-if="isDifferentFromDefault(item) && !isItemEdited(item)"
                    color="warning"
                    icon="mdi-refresh"
                    @click="resetToDefault(item)"
                  />
                </div>
              </template>
            </v-switch>

            <!-- 数字类型 -->
            <v-text-field
              v-else-if="item.type === 'number'"
              :model-value="localValues[item.key]"
              :placeholder="String(item.default)"
              type="number"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              @update:model-value="
                (value) => handleUpdate(item.key, Number(value))
              "
              :append-inner-icon="getAppendInnerIcon(item)"
              @click:append-inner="handleAppendInnerClick(item)"
              :loading="savingItems[item.key]"
            >
              <template v-slot:append>
                <v-icon
                  v-if="isItemEdited(item)"
                  color="error"
                  icon="mdi-close"
                  @click="revertEdit(item)"
                />
              </template>
            </v-text-field>
          </div>
        </div>

        <div class="d-flex mt-1">
          <div class="text-caption text-grey">
            默认值:
            <template v-if="item.type === 'array'">
              <template v-if="item.default !== undefined && item.default !== null">
                <v-chip
                  v-for="(value, index) in item.default"
                  :key="index"
                  size="x-small"
                  variant="flat"
                  class="ml-1"
                >
                  {{ value }}
                </v-chip>
              </template>
              <span v-else class="text-disabled">无</span>
            </template>
            <template v-else>
              <span v-if="item.default !== undefined && item.default !== null">{{ item.default }}</span>
              <span v-else class="text-disabled">无</span>
            </template>
          </div>
          <v-spacer></v-spacer>
          <div v-if="isItemEdited(item)" class="text-caption ">
            点击 <v-icon size="x-small" icon="mdi-check" color="success" /> 保存修改
          </div>
          <!--<div v-else-if="isDifferentFromDefault(item)" class="text-caption">
            点击 <v-icon size="x-small" icon="mdi-refresh" color="warning" /> 恢复默认值
          </div>-->
        </div>
      </v-col>
    </v-row>

    <!-- 删除确认对话框 -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title>确认删除配置项？</v-card-title>
        <v-card-text>
          确定要删除配置项 "{{ deleteItem?.description || deleteItem?.key }}" 吗？此操作不可恢复。
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="text"
            @click="showDeleteDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            @click="deleteConfig"
          >
            确认删除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "@/axios/axios";
import draggable from "vuedraggable";

const props = defineProps({
  configs: {
    type: Array,
    required: true,
    default: () => [],
  }
});

const emit = defineEmits([
  "refresh",
  "validation-error",
  "save-error",
  "delete"
]);

// 本地状态
const localValues = ref({});
const initialValues = ref({});
const savingItems = ref({});
const showDeleteDialog = ref(false);
const deleteItem = ref(null);
const newArrayItem = ref('');

// Add draggable component registration
const components = {
  draggable,
};

// 初始化本地值
onMounted(() => {
  initializeValues();
});

const initializeValues = () => {
  const values = {};
  // 使用 Set 来确保 key 的唯一性
  const uniqueConfigs = Array.from(new Set(props.configs.map(c => c.key)))
    .map(key => props.configs.find(c => c.key === key));

  uniqueConfigs.forEach((item) => {
    if (item.type === "array") {
      // 数组类型保持数组形式
      values[item.key] = item.value || [];
    } else {
      values[item.key] = item.value;
    }
  });
  localValues.value = JSON.parse(JSON.stringify(values));
  initialValues.value = JSON.parse(JSON.stringify(values));
};

// 检查项目是否被编辑（与加载时的值不同）
const isItemEdited = (item) => {
  const currentValue = localValues.value[item.key];
  const initialValue = initialValues.value[item.key];

  if (item.type === "array") {
    if (!Array.isArray(currentValue) || !Array.isArray(initialValue)) return false;
    if (currentValue.length !== initialValue.length) return true;
    return currentValue.some((value, index) => value !== initialValue[index]);
  }

  // 其他类型的比较保持不变
  if (item.type === "number") {
    return Number(currentValue) !== Number(initialValue);
  }
  if (item.type === "boolean") {
    return Boolean(currentValue) !== Boolean(initialValue);
  }
  return currentValue !== initialValue;
};

// 检查是否与默认值不同
const isDifferentFromDefault = (item) => {
  const currentValue = localValues.value[item.key];
  const defaultValue = item.default;

  if (item.type === "array") {
    if (!Array.isArray(currentValue) || !Array.isArray(defaultValue)) return true;
    if (currentValue.length !== defaultValue.length) return true;
    return currentValue.some((value, index) => value !== defaultValue[index]);
  }

  // 其他类型的比较保持不变
  if (item.type === "number") {
    return Number(currentValue) !== Number(defaultValue);
  }
  if (item.type === "boolean") {
    return Boolean(currentValue) !== Boolean(defaultValue);
  }
  return currentValue !== defaultValue;
};

// 获取右侧图标
const getAppendInnerIcon = (item) => {
  if (isItemEdited(item)) {
    return "mdi-check";
  }
  if (isDifferentFromDefault(item) && !isItemEdited(item)) {
    return "mdi-refresh";
  }
  return "";
};

// 处理右侧图标点击
const handleAppendInnerClick = (item) => {
  if (isItemEdited(item)) {
    saveItem(item);
  } else if (isDifferentFromDefault(item)) {
    resetToDefault(item);
  }
};

const handleUpdate = (key, value) => {
  localValues.value[key] = value;
};

// 新增：处理数组项的添加
const handleArrayItemAdd = (item, value) => {
  if (!value) return;
  if (!Array.isArray(localValues.value[item.key])) {
    localValues.value[item.key] = [];
  }

  // 处理逗号分隔的输入
  const values = value.split(',').map(v => v.trim()).filter(v => v);
  values.forEach(v => {
    if (!localValues.value[item.key].includes(v)) {
      localValues.value[item.key].push(v);
    }
  });
};

// 新增：处理数组项的删除
const handleArrayItemRemove = (item, index) => {
  localValues.value[item.key].splice(index, 1);
};

// 保存单个配置项
const saveItem = async (item) => {
  savingItems.value[item.key] = true;

  try {
    const result = await axios.put(`/admin/config/${item.key}`, {
      type: item.type,
      value: localValues.value[item.key],
      description: item.description,
      default: item.default,
      public: item.public,
      required: item.required,
      options: item.options
    });

    if (result.status === 200) {
      // 更新初始值，但不触发完整刷新
      initialValues.value[item.key] = JSON.parse(
        JSON.stringify(localValues.value[item.key])
      );

      // 更新当前配置项的值
      const configIndex = props.configs.findIndex(c => c.key === item.key);
      if (configIndex !== -1) {
        props.configs[configIndex].value = localValues.value[item.key];
      }
    }
  } catch (error) {
    // 如果保存失败，恢复到上一次保存的值
    localValues.value[item.key] = JSON.parse(
      JSON.stringify(initialValues.value[item.key])
    );
    emit('save-error', item.key);
  }

  savingItems.value[item.key] = false;
};

// 撤销编辑
const revertEdit = (item) => {
  localValues.value[item.key] = JSON.parse(
    JSON.stringify(initialValues.value[item.key])
  );
};

// 重置为默认值
const resetToDefault = (item) => {
  // 根据类型设置适当的默认空值
  let defaultValue;
  if (item.default !== undefined && item.default !== null) {
    defaultValue = item.default;
  } else {
    switch (item.type) {
      case 'array':
        defaultValue = [];
        break;
      case 'number':
        defaultValue = 0;
        break;
      case 'boolean':
        defaultValue = false;
        break;
      case 'string':
      case 'enum':
      default:
        defaultValue = '';
        break;
    }
  }

  localValues.value[item.key] = JSON.parse(JSON.stringify(defaultValue));
};

// 确认删除配置项
const confirmDelete = (item) => {
  deleteItem.value = item;
  showDeleteDialog.value = true;
};

// 删除配置项
const deleteConfig = () => {
  if (!deleteItem.value) return;
  emit("delete", deleteItem.value.key);
  showDeleteDialog.value = false;
  deleteItem.value = null;
};

// 复制到剪贴板
const copyToClipboard = async (value) => {
  let textToCopy = value;

  // 如果是数组，转换为逗号分隔的字符串
  if (Array.isArray(value)) {
    textToCopy = value.join(',');
  } else if (typeof value === 'object') {
    // 如果是对象，转换为JSON字符串
    textToCopy = JSON.stringify(value);
  } else {
    // 确保其他类型都转换为字符串
    textToCopy = String(value);
  }

  try {
    await navigator.clipboard.writeText(textToCopy);
    // 可以添加一个提示，但由于操作很快，可能不需要
  } catch (err) {
    // 如果剪贴板API不可用，使用传统方法
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
};

// 监听items变化，更新本地值
watch(
  () => props.configs,
  () => {
    initializeValues();
  },
  { deep: true }
);
</script>

<style scoped>
.v-card {
  margin-bottom: 24px;
}

.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}
</style>
