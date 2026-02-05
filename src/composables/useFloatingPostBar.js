import { ref } from 'vue';

// 全局底部悬浮发帖栏展开状态
export const floatingPostBarExpanded = ref(false);

export const openFloatingPostBar = () => {
  floatingPostBarExpanded.value = true;
};

export const closeFloatingPostBar = () => {
  floatingPostBarExpanded.value = false;
};

export const toggleFloatingPostBar = () => {
  floatingPostBarExpanded.value = !floatingPostBarExpanded.value;
};

export const useFloatingPostBar = () => {
  return {
    isExpanded: floatingPostBarExpanded,
    open: openFloatingPostBar,
    close: closeFloatingPostBar,
    toggle: toggleFloatingPostBar
  };
};
