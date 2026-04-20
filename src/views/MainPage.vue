<template>
  <div class="main-page" :class="{ 'right-collapsed': rightCollapsed }">
    <div class="main-page__left">
      <div class="main-page__left-sidebar">
        <LeftSidebar />
      </div>
      <div class="main-page__left-content">
        <LeftContent />
      </div>
    </div>
    <div class="main-page__right">
      <div class="main-page__right-content">
        <RightContent />
      </div>
      <div class="main-page__right-sidebar">
        <RightSidebar />
      </div>
    </div>
    
    <!-- 操作托盘 -->
    <OperationTray />
    
    <!-- 提示框 -->
    <div v-if="showToast" class="toast">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import LeftSidebar from './LeftSidebar.vue'
import LeftContent from './LeftContent.vue'
import RightContent from './RightContent.vue'
import RightSidebar from './RightSidebar.vue'
import OperationTray from '@/components/OperationTray.vue'
import { ref } from 'vue'
import { useEventBus } from '@/composables/useEventBus'

const rightCollapsed = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const { on, EventTypes } = useEventBus()

on(EventTypes.SET_SELECTOR_VISIBLE, ({ visible }) => {
  rightCollapsed.value = !visible
})

// 监听复制成功事件
on(EventTypes.SHOW_TOAST, ({ message }) => {
  toastMessage.value = message
  showToast.value = true
  
  // 1.5秒后自动隐藏
  setTimeout(() => {
    showToast.value = false
  }, 1500)
})
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss';

.main-page {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  
  &__left {
    flex: 0 0 70%;
    height: 100%;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    background-color: $background;
    border-right: 2px solid $border-color;
    transition: flex 0.3s ease;
  }

  &__left-sidebar {
    flex: 0 0 10%;
    height: 100%;
    overflow: hidden;
    border-right: 2px solid $border-color;
  }

  &__left-content {
    flex: 0 0 90%;
    height: 100%;
    overflow: hidden;
  }

  &__right {
    flex: 0 0 30%;
    height: 100%;
    display: flex;
    overflow: hidden;
    background-color: $surface;
    transition: flex 0.3s ease;
  }

  &__right-content {
    flex: 0 0 75%;
    height: 100%;
    overflow: hidden;
  }

  &__right-sidebar {
    flex: 0 0 25%;
    height: 100%;
    overflow: hidden;
  }
  
  &.right-collapsed {
    .main-page__right-content {
      flex: 0 0 0%;
    }

    .main-page__right-sidebar {
      flex: 0 0 100%;
    }

    .main-page__left {
      flex: 0 0 92%;
    }

    .main-page__right {
      flex: 0 0 8%;
    }
  }
}

/* 提示框样式 */
.toast {
  position: fixed;
  top: $spacing-lg+20;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(170, 223, 248, 0.8);
  color: rgb(47, 47, 48);
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius-md;
  font-weight: bold;
  z-index: 1000;
  animation: toastFadeIn 0.3s ease;
}

@keyframes toastFadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
