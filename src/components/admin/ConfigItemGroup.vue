<template>
  <v-container class="pa-0">
    <v-row v-for="item in items" :key="item.key" class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center mb-2">
          <span class="text-subtitle-1">{{ item.description }}</span>
          <v-chip
            v-if="isItemEdited(item)"
            color="warning"
            size="small"
            class="ml-2"
          >
            未保存的修改
          </v-chip>
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
                  @click="saveItem(item)"
                  :loading="savingItems[item.key]"
                  icon="mdi-check"
                />
                <v-btn
                  v-if="isItemEdited(item)"
                  color="error"
                  size="small"
                  icon="mdi-refresh"
                  @click="revertEdit(item)"
                />
              </template>
            </v-text-field>

            <!-- 数组类型 -->
            <div v-else-if="item.type === 'array'" class="array-editor">
              <v-card variant="outlined">
                <v-toolbar density="compact" color="primary">
                  <v-toolbar-title class="text-subtitle-2"
                    >列表</v-toolbar-title
                  >
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    variant="text"
                    prepend-icon="mdi-plus"
                    size="small"
                    @click="addArrayItem(item)"
                  >
                    添加项目
                  </v-btn>
                </v-toolbar>

                <v-list v-if="localValues[item.key]?.length" class="pa-2">
                  <div class="d-flex align-center mb-2">
                    <div class="text-caption text-grey">
                      共 {{ localValues[item.key].length }} 项
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      variant="text"
                      density="comfortable"
                      size="small"
                      prepend-icon="mdi-plus"
                      @click="addArrayItem(item, 0)"
                      class="mr-2"
                    >
                      在顶部添加
                    </v-btn>
                    <v-btn
                      color="primary"
                      variant="text"
                      density="comfortable"
                      size="small"
                      prepend-icon="mdi-plus"
                      @click="addArrayItem(item)"
                    >
                      在底部添加
                    </v-btn>
                  </div>

                  <draggable
                    v-model="localValues[item.key]"
                    item-key="id"
                    handle=".handle"
                    @change="
                      () => handleUpdate(item.key, localValues[item.key])
                    "
                    tag="div"
                    class="rounded-lg"
                  >
                    <template #item="{ element, index }">
                      <div>
                        <v-hover v-slot="{ isHovering, props }">
                          <v-list-item
                            v-bind="props"
                            :class="{ 'bg-blue-lighten-1': isHovering }"
                            rounded="lg"
                          >
                            <template v-slot:prepend>
                              <v-icon
                                class="handle mr-2"
                                :color="
                                  isHovering ? 'primary' : 'primary-lighten-1'
                                "
                                icon="mdi-drag"
                                size="small"
                              >
                                <v-tooltip activator="parent" location="top"
                                  >拖拽排序</v-tooltip
                                >
                              </v-icon>
                              <div class="text-grey-darken-1">
                                {{ index + 1 }}.
                              </div>
                            </template>

                            <v-text-field
                              v-model="element.value"
                              hide-details="auto"
                              density="compact"
                              variant="underlined"
                              class="mx-2"
                              placeholder="输入项目内容"
                              @update:model-value="
                                () =>
                                  handleUpdate(item.key, localValues[item.key])
                              "
                            />

                            <template v-slot:append>
                              <div class="d-flex align-center">
                                <v-btn
                                  color="primary"
                                  variant="text"
                                  density="comfortable"
                                  size="x-small"
                                  icon="mdi-plus"
                                  @click="addArrayItem(item, index + 1)"
                                  class="mr-2"
                                >
                                  <v-tooltip activator="parent" location="top"
                                    >在此项后添加</v-tooltip
                                  >
                                </v-btn>
                                <v-btn
                                  color="error"
                                  variant="text"
                                  density="comfortable"
                                  size="small"
                                  prepend-icon="mdi-delete"
                                  @click="removeArrayItem(item, index)"
                                >
                                  删除
                                </v-btn>
                              </div>
                            </template>
                          </v-list-item>
                        </v-hover>
                        <v-divider
                          v-if="index < localValues[item.key].length - 1"
                          class="my-1"
                        ></v-divider>
                      </div>
                    </template>
                  </draggable>
                </v-list>

                <v-card-text v-else class="text-center text-grey py-4">
                  <v-icon
                    icon="mdi-format-list-text"
                    size="large"
                    color="grey-lighten-1"
                    class="mb-2"
                  />
                  <div>暂无列表项</div>
                  <v-btn
                    color="primary"
                    variant="text"
                    prepend-icon="mdi-plus"
                    class="mt-2"
                    @click="addArrayItem(item)"
                  >
                    添加第一项
                  </v-btn>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    v-if="isItemEdited(item)"
                    color="success"
                    size="small"
                    prepend-icon="mdi-check"
                    @click="saveItem(item)"
                    :loading="savingItems[item.key]"
                  >
                    保存修改
                  </v-btn>
                  <v-btn
                    v-if="isItemEdited(item)"
                    color="error"
                    size="small"
                    prepend-icon="mdi-close"
                    @click="revertEdit(item)"
                  >
                    撤销修改
                  </v-btn>
                  <v-btn
                    v-if="isDifferentFromDefault(item) && !isItemEdited(item)"
                    color="warning"
                    size="small"
                    prepend-icon="mdi-refresh"
                    @click="resetToDefault(item)"
                  >
                    重置默认
                  </v-btn>
                </v-card-actions>
              </v-card>
            </div>

            <!-- 选择类型 -->
            <v-select
              v-else-if="item.type === 'select'"
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

        <div class="d-flex mt-1" v-if="item.type !== 'array'">
          <div class="text-caption text-grey">默认值: {{ item.default }}</div>
          <div v-if="isItemEdited(item)" class="text-caption text-warning ml-4">
            有未保存的修改
          </div>
          <div
            v-else-if="isDifferentFromDefault(item)"
            class="text-caption ml-4"
          >
            已编辑
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- 恢复默认值确认对话框 -->
    <v-dialog v-model="showResetDialog" max-width="400">
      <v-card>
        <v-card-title>确认恢复默认值？</v-card-title>
        <v-card-text>
          确定要将 "{{ resetItem?.description }}" 恢复为默认值 "{{
            resetItem?.default
          }}" 吗？
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="text"
            @click="showResetDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            @click="resetToDefault"
            :loading="savingItems[resetItem?.key]"
          >
            确认恢复
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
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits([
  "update",
  "refresh",
  "validation-error",
  "save-error",
]);

// 本地状态
const localValues = ref({});
const initialValues = ref({});
const savingItems = ref({});
const showResetDialog = ref(false);
const resetItem = ref(null);

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
  props.items.forEach((item) => {
    if (item.type === "array") {
      // 为数组项添加唯一ID
      values[item.key] = (item.current_value || []).map((value) => ({
        id: Date.now() + Math.random(),
        value,
      }));
    } else {
      values[item.key] = item.current_value;
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
    if (!Array.isArray(currentValue) || !Array.isArray(initialValue))
      return false;
    if (currentValue.length !== initialValue.length) return true;

    // 比较每个数组项的值
    return currentValue.some((curr, index) => {
      const init = initialValue[index];
      return !init || curr.value !== init.value;
    });
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

  if (item.type === "array") {
    if (!Array.isArray(currentValue) || !Array.isArray(item.default))
      return true;
    if (currentValue.length !== item.default.length) return true;

    // 比较每个数组项的值
    return currentValue.some(
      (curr, index) => curr.value !== item.default[index]
    );
  }

  // 其他类型的比较保持不变
  if (item.type === "number") {
    return Number(currentValue) !== Number(item.default);
  }
  if (item.type === "boolean") {
    return Boolean(currentValue) !== Boolean(item.default);
  }
  return currentValue !== item.default;
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
  emit("update", key, value);
};

// 保存单个配置项
const saveItem = async (item) => {
  savingItems.value[item.key] = true;

  try {
    const value =
      item.type === "array"
        ? localValues.value[item.key].map((item) => item.value)
        : localValues.value[item.key];

    const { data } = await axios.put(`/admin/config/${item.key}`, { value });

    if (data.status === "success") {
      if (data.data.valid) {
        // 深拷贝保存成功的值
        initialValues.value[item.key] = JSON.parse(
          JSON.stringify(localValues.value[item.key])
        );
        emit("refresh");
      } else {
        // 恢复到上一次保存的值
        localValues.value[item.key] = JSON.parse(
          JSON.stringify(initialValues.value[item.key])
        );
        emit("validation-error", {
          key: item.key,
          description: item.description,
          error: data.data.error,
        });
      }
    }
  } catch (error) {
    // 恢复到上一次保存的值
    localValues.value[item.key] = JSON.parse(
      JSON.stringify(initialValues.value[item.key])
    );
    emit("save-error", item.key);
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
  localValues.value[item.key] = item.default;
};

// 数组操作方法
const addArrayItem = (item, insertIndex = -1) => {
  if (!Array.isArray(localValues.value[item.key])) {
    localValues.value[item.key] = [];
  }

  const newItem = {
    id: Date.now() + Math.random(),
    value: "",
  };

  if (insertIndex === -1) {
    // 添加到末尾
    localValues.value[item.key].push(newItem);
  } else {
    // 在指定位置插入
    localValues.value[item.key].splice(insertIndex, 0, newItem);
  }

  handleUpdate(item.key, localValues.value[item.key]);
};

const removeArrayItem = (item, index) => {
  localValues.value[item.key].splice(index, 1);
  handleUpdate(item.key, localValues.value[item.key]);
};

// 监听items变化，更新本地值
watch(
  () => props.items,
  () => {
    initializeValues();
  },
  { deep: true }
);
</script>
