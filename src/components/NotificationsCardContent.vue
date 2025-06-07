<template>
  <div>
    <!-- 加载中 -->
    <div v-if="loading" class="d-flex justify-center align-center py-4">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>

    <!-- 加载错误 -->
    <div v-else-if="error" class="text-center py-4 text-error">
      {{ error }}
      <v-btn variant="text" @click="fetchNotifications()">重试</v-btn>
    </div>

    <!-- 通知列表 -->
    <template v-else>
      <div
        ref="notificationsContainer"
        :style="{ 'overflow-y': 'auto' }"
        @scroll="handleScroll"
      >
        <v-list v-if="notifications.length > 0">
          <v-list-item
            v-for="notification in notifications"
            :key="notification.id"
            :to="notification.redirect_url"
            lines="three"
            color="primary"
            :active="!notification.read"
            @click="handleNotificationClick(notification)"
            :class="{ 'clickable-item': !!notification.redirect_url }"
          >
            <template v-slot:prepend>
              <!-- 使用actor用户的头像 - 安全处理 -->
              <v-avatar
                size="40"
                v-if="
                  notification.actor_id &&
                  userCache[notification.actor_id]?.images
                "
              >
                <v-img
                  :src="
                    VITE_APP_S3_BUCKET +
                    '/user/' +
                    userCache[notification.actor_id].images
                  "
                  alt="用户头像"
                ></v-img>
              </v-avatar>
              <v-avatar
                v-else-if="notification.template_info?.icon"
                color="primary"
                size="40"
              >
                <v-icon>{{
                  getIconForType(notification.template_info.icon)
                }}</v-icon>
              </v-avatar>
              <v-avatar v-else color="primary" size="40">
                <v-icon>mdi-bell</v-icon>
              </v-avatar>
            </template>

            <v-list-item-title>
              <span v-if="notification.template_info?.title">
                {{ notification.template_info.title }}
              </span>

              <span v-else>系统消息</span>

              <!-- 图标移动到行内 -->
              <v-icon
                v-if="notification.template_info?.icon"
                size="small"
                class="ml-2"
              >
                {{ getIconForType(notification.template_info.icon) }}
              </v-icon>
            </v-list-item-title>

            <v-list-item-subtitle>
              <span v-if="notification.template_info?.template">
                <template v-if="notification.rendered_content">
                  {{ notification.rendered_content }}
                </template>
                <template v-else>
                  <v-progress-circular
                    indeterminate
                    size="16"
                    width="2"
                    class="mr-2"
                  ></v-progress-circular>
                  加载中...
                </template>
              </span>
              <span v-else>{{ notification.content || "新的通知" }}</span>
            </v-list-item-subtitle>

            <v-list-item-subtitle class="text-caption text-grey">
              {{ formatDate(notification.created_at) }}
            </v-list-item-subtitle>

            <template v-slot:append>
              <v-chip
                v-if="notification.high_priority"
                color="error"
                size="small"
                class="mr-2"
              >
                重要
              </v-chip>
              <v-icon v-if="!notification.read" color="primary" size="small"
                >mdi-circle-small</v-icon
              >
            </template>
          </v-list-item>
        </v-list>

        <!-- 无通知状态 -->
        <div v-else class="py-8 text-center">
          <v-icon size="large" color="grey">mdi-bell-off</v-icon>
          <div class="text-body-2 text-grey mt-2">暂无通知</div>
        </div>

        <!-- 加载更多区域 -->
        <div v-if="hasMoreNotifications" class="text-center py-4">
          <v-btn
            v-if="!autoLoadMore"
            variant="text"
            :loading="loadingMore"
            @click="loadMoreNotifications"
          >
            加载更多
          </v-btn>
          <v-progress-circular
            v-else-if="loadingMore"
            indeterminate
            size="24"
          ></v-progress-circular>
        </div>
      </div>

      <!-- 底部控制区 -->
      <template v-if="!showPagination">
        <v-divider class="my-1"></v-divider>
        <div class="d-flex align-center justify-space-between pa-2">
          <v-btn
            variant="text"
            size="small"
            @click="markAllAsRead"
            :disabled="!hasUnread"
          >
            标记全部已读
          </v-btn>
          <v-btn variant="text" size="small" to="/app/notifications">
            查看全部通知
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/services/notificationService";
import { getUserById } from "@/stores/user.js";
import { getProjectInfo, getProjectListById } from "@/services/projectService";

export default {
  name: "NotificationsCardContent",
  props: {
    showPagination: {
      type: Boolean,
      default: false,
    },
    autoLoadMore: {
      type: Boolean,
      default: true,
    },
    autoFetch: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["update:unread-count"],
  setup(props, { emit }) {
    const router = useRouter();
    const notifications = ref([]);
    const loading = ref(false);
    const loadingMore = ref(false);
    const error = ref(null);
    const unreadCount = ref(0);
    const hasMoreNotifications = ref(false);
    const loadMoreUrl = ref(null);
    const notificationsContainer = ref(null);

    const VITE_APP_S3_BUCKET = import.meta.env.VITE_APP_S3_BUCKET;
    const userCache = ref({});
    console.log("初始化userCache为空对象:", userCache.value);
    const projectCache = ref({});
    console.log("初始化projectCache为空对象:", projectCache.value);
    const projectListCache = ref({});
    console.log("初始化projectListCache为空对象:", projectListCache.value);

    const hasUnread = computed(() => unreadCount.value > 0);

    // 处理API错误
    const handleApiError = (error, customMessage = "操作失败") => {
      console.error(error);
      return error.response?.data?.message || error.message || customMessage;
    };

    // 获取通知数据
    const fetchNotifications = async () => {
      if (loading.value) return;

      loading.value = true;
      error.value = null;

      try {
        const data = await getNotifications();
        notifications.value = data.notifications || [];
        loadMoreUrl.value = data.load_more_url || null;
        hasMoreNotifications.value = !!loadMoreUrl.value;
        updateUnreadCount();

        // 处理通知模板
        await prepareTemplateData(notifications.value);
        processNotificationTemplates(notifications.value);
      } catch (err) {
        error.value = handleApiError(err, "加载通知失败");
      } finally {
        loading.value = false;
      }
    };

    // 加载更多通知
    const loadMoreNotifications = async () => {
      if (loadingMore.value || !loadMoreUrl.value) return;

      loadingMore.value = true;
      try {
        const data = await getNotifications({ url: loadMoreUrl.value });
        const newNotifications = data.notifications || [];
        notifications.value = [...notifications.value, ...newNotifications];
        loadMoreUrl.value = data.load_more_url || null;
        hasMoreNotifications.value = !!loadMoreUrl.value;

        // 处理新加载的通知模板
        await prepareTemplateData(newNotifications);
        processNotificationTemplates(newNotifications);
      } catch (err) {
        error.value = handleApiError(err, "加载更多通知失败");
      } finally {
        loadingMore.value = false;
      }
    };

    // 预先加载通知所需的用户和项目数据
    const prepareTemplateData = async (notificationsList) => {
      try {
        // 收集所有需要获取的项目和项目列表ID
        const projectIds = new Set();
        const projectListIds = new Set();

        // 收集所有需要的ID
        notificationsList.forEach((notification) => {
          // 收集target IDs
          if (notification.target_id) {
            if (notification.target_type === "project") {
              projectIds.add(notification.target_id);
            } else if (notification.target_type === "projectlist") {
              projectListIds.add(notification.target_id);
            }
          }
        });

        console.log("准备获取数据：", {
          users: Array.from(userIds),
          projects: Array.from(projectIds),
          projectLists: Array.from(projectListIds),
        });

        // 过滤掉已缓存的ID，只获取尚未缓存的数据
        const uncachedUserIds = Array.from(userIds).filter(
          (id) => !userCache.value[id]
        );
        const uncachedProjectIds = Array.from(projectIds).filter(
          (id) => !projectCache.value[id]
        );

        // 批量获取数据
        const promises = [];

        // 获取用户数据
        if (uncachedUserIds.length > 0) {
          console.log("获取用户数据:", uncachedUserIds);
          promises.push(
            getUserById(uncachedUserIds)
              .then((users) => {
                console.log("获取到用户数据:", users);
                // 将用户数据转换为以ID为键的对象格式
                if (Array.isArray(users)) {
                  // 处理数组返回结果
                  const usersObj = {};
                  users.forEach((user) => {
                    if (user && user.id) {
                      usersObj[user.id] = user;
                    }
                  });
                  // 合并到缓存中
                  userCache.value = { ...userCache.value, ...usersObj };
                  console.log("转换后的用户数据:", userCache.value);
                } else if (users && users.id) {
                  // 处理单个用户返回结果
                  userCache.value[users.id] = users;
                }
              })
              .catch((err) => {
                console.error("获取用户数据失败:", err);
              })
          );
        }

        if (uncachedProjectIds.length > 0) {
          console.log("获取项目数据:", uncachedProjectIds);
          promises.push(
            getProjectInfo(uncachedProjectIds)
              .then((projects) => {
                console.log("获取到项目数据:", projects);
                // 将项目数据转换为以ID为键的对象格式
                if (Array.isArray(projects)) {
                  // 处理数组返回结果
                  const projectsObj = {};
                  const authorsObj = {};
                  projects.forEach((project) => {
                    if (project && project.id) {
                      projectsObj[project.id] = project;
                      // 直接从project.author中获取作者信息并缓存
                      if (project.author && project.author.id) {
                        authorsObj[project.author.id] = project.author;
                      }
                    }
                  });
                  // 合并到缓存中
                  projectCache.value = {
                    ...projectCache.value,
                    ...projectsObj,
                  };
                  // 合并作者信息到用户缓存
                  userCache.value = {
                    ...userCache.value,
                    ...authorsObj,
                  };
                  console.log("转换后的项目数据:", projectCache.value);
                  console.log("更新后的用户缓存:", userCache.value);
                } else if (projects && projects.id) {
                  // 处理单个项目返回结果
                  projectCache.value[projects.id] = projects;
                  // 缓存单个项目的作者信息
                  if (projects.author && projects.author.id) {
                    userCache.value[projects.author.id] = projects.author;
                  }
                }
              })
              .catch((err) => {
                console.error("获取项目数据失败:", err);
              })
          );
        }

        // 单独获取每个项目列表（因为API不支持批量获取）
        for (const projectListId of projectListIds) {
          if (!projectListCache.value[projectListId]) {
            console.log("获取项目列表数据:", projectListId);
            promises.push(
              getProjectListById(projectListId)
                .then((projectList) => {
                  console.log("获取到项目列表数据:", projectList);
                  // 如果成功获取到列表数据，就加入缓存
                  if (projectList && projectList.id) {
                    projectListCache.value[projectList.id] = projectList;
                    // 如果项目列表包含作者信息，直接缓存
                    if (projectList.author && projectList.author.id) {
                      userCache.value[projectList.author.id] = projectList.author;
                    }
                  }
                })
                .catch((err) => {
                  console.error(`获取项目列表${projectListId}失败:`, err);
                  // 缓存空对象以避免重复请求不存在的资源
                  projectListCache.value[projectListId] = { error: true };
                })
            );
          }
        }

        // 等待所有数据加载完成
        await Promise.allSettled(promises);

        console.log("缓存状态:", {
          users: userCache.value,
          projects: projectCache.value,
          projectLists: projectListCache.value,
        });

        // 为每个通知添加actor_details并处理redirect_url
        notificationsList.forEach((notification) => {
          // 添加actor_details
          if (notification.actor_id) {
            if (userCache.value[notification.actor_id]) {
              notification.actor_details =
                userCache.value[notification.actor_id];
              console.log(
                `为通知${notification.id}设置actor_details:`,
                notification.actor_details
              );
            } else {
              console.warn(`未找到actor${notification.actor_id}的数据`);
            }
          } else if (notification.actor?.id) {
            const actorId = notification.actor.id;
            notification.actor_id = actorId; // 设置actor_id字段
            if (userCache.value[actorId]) {
              notification.actor_details = userCache.value[actorId];
              console.log(
                `为通知${notification.id}设置actor_details:`,
                notification.actor_details
              );
            } else {
              console.warn(`未找到actor${actorId}的数据`);
            }
          }

          // 处理redirect_url
          if (!notification.redirect_url) {
            // 根据通知类型和目标构造redirect_url
            if (
              notification.target_type === "project" &&
              notification.target_id
            ) {
              const project = projectCache.value[notification.target_id];
              if (project && project.author) {
                notification.redirect_url = `/${project.author.username}/${
                  project.name || project.title
                }`;
                console.log(
                  `为通知${notification.id}生成redirect_url:`,
                  notification.redirect_url
                );
              }
            } else if (
              notification.target_type === "user" &&
              notification.target_id
            ) {
              const user = userCache.value[notification.target_id];
              if (user) {
                notification.redirect_url = `/${user.username}`;
                console.log(
                  `为通知${notification.id}生成redirect_url:`,
                  notification.redirect_url
                );
              }
            } else if (
              notification.target_type === "projectlist" &&
              notification.target_id
            ) {
              const projectList =
                projectListCache.value[notification.target_id];
              if (projectList && !projectList.error) {
                notification.redirect_url = `/app/projectlist/${projectList.id}`;
                console.log(
                  `为通知${notification.id}生成redirect_url:`,
                  notification.redirect_url
                );
              }
            }
          }
        });
      } catch (err) {
        console.error("Error preparing template data:", err);
      }
    };

    // 处理通知模板内容
    const processNotificationTemplates = (notificationsList) => {
      for (const notification of notificationsList) {
        if (notification.template_info?.template) {
          // 同步渲染模板内容
          notification.rendered_content = renderTemplate(
            notification.template_info.template,
            notification
          );
        }
      }
    };

    // 处理滚动加载
    const handleScroll = async (event) => {
      if (
        !props.autoLoadMore ||
        !hasMoreNotifications.value ||
        loadingMore.value
      )
        return;

      const container = event.target;
      const { scrollHeight, scrollTop, clientHeight } = container;
      const scrollBottom = scrollHeight - scrollTop - clientHeight;

      if (scrollBottom < 50) {
        await loadMoreNotifications();
      }
    };

    // 标记通知为已读
    const markAsRead = async (id) => {
      try {
        await markNotificationAsRead(id);
        const notification = notifications.value.find((n) => n.id === id);
        if (notification) {
          notification.read = true;
          updateUnreadCount();
        }
      } catch (err) {
        console.error("Error marking notification as read:", err);
      }
    };

    // 标记所有通知为已读
    const markAllAsRead = async () => {
      try {
        await markAllNotificationsAsRead();
        notifications.value.forEach((notification) => {
          notification.read = true;
        });
        updateUnreadCount();
      } catch (err) {
        console.error("Error marking all notifications as read:", err);
      }
    };

    // 更新未读计数
    const updateUnreadCount = () => {
      unreadCount.value = notifications.value.filter((n) => !n.read).length;
      emit("update:unread-count", unreadCount.value);
    };

    // 处理通知点击
    const handleNotificationClick = async (notification) => {
      if (!notification.read) {
        await markAsRead(notification.id);
      }
    };

    // 格式化日期
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return "刚刚";
      if (diffMins < 60) return `${diffMins}分钟前`;
      if (diffHours < 24) return `${diffHours}小时前`;
      if (diffDays < 30) return `${diffDays}天前`;
      return date.toLocaleDateString();
    };

    // 根据通知类型获取图标
    const getIconForType = (iconType) => {
      const iconMap = {
        follow: "mdi-account-plus",
        like: "mdi-heart",
        comment: "mdi-comment-text",
        fork: "mdi-source-fork",
        mention: "mdi-at",
        system: "mdi-information",
        admin: "mdi-shield-account",
        update: "mdi-update",
      };

      return iconMap[iconType] || "mdi-bell";
    };

    // 渲染通知模板
    const renderTemplate = (template, notification) => {
      if (!template) return "";

      let result = template;
      const { actor_id, target_type, target_id } = notification;

      // 安全获取actor信息
      if (actor_id && userCache.value[actor_id]) {
        const actorInfo = userCache.value[actor_id];
        // 使用从用户数据库中获取的详细信息
        result = result.replace(
          /{{actor_name}}/g,
          actorInfo.display_name || actorInfo.name || ""
        );
        result = result.replace(/{{actor_id}}/g, actorInfo.id || "");
      } else {
        // 兜底处理
        result = result.replace(/{{actor_name}}/g, "未知用户");
        result = result.replace(/{{actor_id}}/g, actor_id || "");
      }

      // 根据目标类型获取相应信息
      if (target_type && target_id) {
        if (target_type === "user") {
          const targetInfo = userCache.value[target_id];
          if (targetInfo) {
            result = result.replace(
              /{{target_name}}/g,
              targetInfo.display_name || targetInfo.name || ""
            );
            result = result.replace(/{{target_id}}/g, targetInfo.id || "");
          } else {
            result = result.replace(/{{target_name}}/g, "未知用户");
            result = result.replace(/{{target_id}}/g, target_id);
          }
        } else if (target_type === "project") {
          const targetInfo = projectCache.value[target_id];
          if (targetInfo) {
            result = result.replace(/{{target_name}}/g, targetInfo.title || "");
            result = result.replace(/{{target_id}}/g, targetInfo.id || "");
          } else {
            result = result.replace(/{{target_name}}/g, "未知项目");
            result = result.replace(/{{target_id}}/g, target_id);
          }
        } else if (target_type === "projectlist") {
          const targetInfo = projectListCache.value[target_id];
          if (targetInfo && !targetInfo.error) {
            result = result.replace(/{{target_name}}/g, targetInfo.name || "");
            result = result.replace(/{{target_id}}/g, targetInfo.id || "");
          } else {
            result = result.replace(/{{target_name}}/g, "未知项目列表");
            result = result.replace(/{{target_id}}/g, target_id);
          }
        }
      }

      // 替换其他模板变量
      Object.entries(notification.template_data || {}).forEach(
        ([key, value]) => {
          result = result.replace(new RegExp(`{{${key}}}`, "g"), value || "");
        }
      );

      return result;
    };

    if (props.autoFetch) {
      onMounted(() => {
        fetchNotifications();
      });
    }

    return {
      notifications,
      loading,
      loadingMore,
      error,
      unreadCount,
      hasUnread,
      hasMoreNotifications,
      notificationsContainer,
      fetchNotifications,
      loadMoreNotifications,
      handleScroll,
      markAsRead,
      markAllAsRead,
      updateUnreadCount,
      handleNotificationClick,
      formatDate,
      renderTemplate,
      getIconForType,
      processNotificationTemplates,
      prepareTemplateData,
      userCache,
      VITE_APP_S3_BUCKET,
    };
  },
};
</script>

<style scoped>
.v-list-item--active {
  background-color: rgba(var(--v-theme-primary), 0.08);
}

.clickable-item {
  cursor: pointer;
}
.clickable-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}
</style>
