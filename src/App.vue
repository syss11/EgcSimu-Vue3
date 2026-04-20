<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import MainPage from './views/MainPage.vue'
import VariableModal from './components/VariableModal.vue'

const isMobile = ref(false)
const isPortrait = ref(false)

const checkOrientation = () => {
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768
  isPortrait.value = window.innerHeight > window.innerWidth
}

onMounted(() => {
  checkOrientation()
  window.addEventListener('resize', checkOrientation)
  window.addEventListener('orientationchange', checkOrientation)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkOrientation)
  window.removeEventListener('orientationchange', checkOrientation)
})
</script>

<template>
  <div class="app">
    <div v-if="isMobile && isPortrait" class="rotate-prompt">
      <div class="rotate-prompt__icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.48 2.52c3.27 1.55 5.61 4.72 5.97 8.48h1.5C23.54 6.05 19.73 1.96 14.5 1.24v1.28zM1.5 11c.36-3.76 2.7-6.93 5.97-8.48V1.24C2.24 1.96-1.57 6.05-.95 11h2.45zM16.48 21.48c-3.27-1.55-5.61-4.72-5.97-8.48H9c.62 4.95 4.43 9.04 9.66 9.76v-1.28zM7.47 21.48c-3.27-1.55-5.61-4.72-5.97-8.48h-1.5c.62 4.95 4.43 9.04 9.66 9.76v-1.28zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="currentColor"/>
        </svg>
      </div>
      <div class="rotate-prompt__text">
        请旋转您的设备至横屏
      </div>
      <div class="rotate-prompt__subtext">
        Rotate your device to landscape mode
      </div>
    </div>
    <MainPage />
    <VariableModal />
  </div>
</template>

<style scoped lang="scss">
@use 'sass:map';

.app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.rotate-prompt {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, map.get($colors, ocean, 600) 0%, map.get($colors, deep-ocean, 700) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  color: white;
  animation: fadeIn 0.3s ease-in-out;

  &__icon {
    width: 80px;
    height: 80px;
    margin-bottom: $spacing-lg;
    animation: rotateIcon 2s ease-in-out infinite;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  &__text {
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    margin-bottom: $spacing-sm;
    text-align: center;
  }

  &__subtext {
    font-size: $font-size-sm;
    opacity: 0.8;
    text-align: center;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes rotateIcon {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-90deg);
  }
  50% {
    transform: rotate(-90deg);
  }
  75% {
    transform: rotate(0deg);
  }
}

@media screen and (orientation: landscape) {
  .rotate-prompt {
    display: none;
  }
}
</style>
