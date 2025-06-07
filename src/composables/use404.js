import { ref } from 'vue';

const is404 = ref(false);

const show404 = () => {
  is404.value = true;
};

const reset404 = () => {
  is404.value = false;
};

// 导出组合式函数版本
export function use404() {
  return {
    is404,
    show404,
    reset404
  };
}

// 导出普通方法版本
export const use404Helper = {
  show404,
  reset404,
  is404
};