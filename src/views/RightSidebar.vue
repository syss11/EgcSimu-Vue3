<template>
  <div class="right-sidebar">
    <div class="nav-menu">
      <div 
        v-for="navItem in navItems" 
        :key="navItem.type"
        class="nav-item"
        :class="{ active: activeType === navItem.type }"
        @click="handleNavClick(navItem.type)"
      >
        <img :src="navItem.icon" class="nav-icon" alt="icon" />
        <span class="nav-label">{{ navItem.label }}</span>
      </div>
    </div>
    <div class="bottom-buttons">
      <div 
        class="search-btn"
        @click="handleSearchClick"
      >
        <img :src="searchIcon" class="icon" alt="search" />
        <span class="nav-label" style="margin-top: -4px;font-size: 12px;white-space: nowrap;">搜索蛋码</span>
      
      </div>
      <div 
        class="variable-btn"
        @click="handleVariableClick"
      >

        <img :src="variableIcon" class="icon" alt="variable" />
        <span class="nav-label" style="margin-top: -4px;font-size: 12px;white-space: nowrap;">新建变量</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEventBus } from '@/composables/useEventBus'

interface NavItem {
  type: string
  label: string
  icon: string
}

const eventIcon = new URL('@/assets/dmicon/event.png', import.meta.url).href
const controlIcon = new URL('@/assets/dmicon/contro.png', import.meta.url).href
const actionIcon = new URL('@/assets/dmicon/action.png', import.meta.url).href
const booleanIcon = new URL('@/assets/dmicon/condit.png', import.meta.url).href
const valueIcon = new URL('@/assets/dmicon/valu.png', import.meta.url).href
const searchIcon = new URL('@/assets/dmicon/search.svg', import.meta.url).href
const variableIcon = new URL('@/assets/dmicon/vars.png', import.meta.url).href

const navItems: NavItem[] = [
  
  { type: 'event', label: '事件', icon: eventIcon },
  { type: 'controll', label: '控制', icon: controlIcon },
  { type: 'action', label: '动作', icon: actionIcon },
  { type: 'boolean', label: '布尔值', icon: booleanIcon },
  { type: 'value', label: '取值', icon: valueIcon },
  { type: 'variable', label: '变量', icon: variableIcon },
]

const activeType = ref<string>('')

const { emit, EventTypes } = useEventBus()

function handleNavClick(type: string) {
  emit(EventTypes.SET_SELECTOR_VISIBLE, { visible: true })
  activeType.value = type
  emit('scroll-to-type', { type })
}

function handleSearchClick() {
  emit(EventTypes.SET_SELECTOR_VISIBLE, { visible: true })
  emit(EventTypes.TOGGLE_SEARCH)
}

function handleVariableClick() {
  emit(EventTypes.OPEN_VARIABLE_MODAL)
}
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.right-sidebar {
  width: 100%;
  height: 100%;
  background-color: $background;
  border-left: 2px solid $border-color;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.nav-menu {
  padding: 2px;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  flex: 1;
  overflow-y: auto;
}

.nav-item {
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius-sm;
  cursor: pointer;
  transition: all $transition-fast;
  font-size: $font-size-sm;
  text-align: center;
  background-color: $surface;
  border: 1px solid $border-color;
  white-space: nowrap;
  height: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-xs;

  &:hover {
    background: linear-gradient(135deg, rgb(230, 245, 255), rgb(240, 248, 255));
    border-color: rgb(180, 200, 220);
  }

  &.active {
    background: linear-gradient(135deg, rgb(200, 230, 255), rgb(220, 240, 250));
    color: rgb(80, 100, 120);
    border-color: rgb(160, 190, 220);
  }
}

.nav-icon {
  width: 40px;
  height: 40px;
}

.nav-label {
  font-size: $font-size-sm;
}

.bottom-buttons {
  flex-shrink: 0;
  padding: $spacing-sm;
  border-top: 1px solid $border-color;
  background-color: $surface;
  display: flex;
  gap: $spacing-sm;
  flex-direction: column;
}

.search-btn,
.variable-btn {
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius-sm;
  cursor: pointer;
  transition: all $transition-fast;
  background-color: $surface;
  border: 1px solid $border-color;
  height: 64px;
  
  &:hover {
    background-color: $background;
    border-color: $primary;
  }

  .icon {
    width: 40px;
    height: 40px;
  }
}

@media screen and (max-height: 500px) and (orientation: landscape) {
  .nav-item {
    flex-direction: row;
    height: 40px;
    padding: $spacing-xs $spacing-sm;
    gap: 2px;
  }

  .nav-label {
    font-size: 12px;
  }

  .nav-icon {
    width: 24px;
    height: 24px;
  }

  .search-btn,
  .variable-btn {
    flex-direction: row;
    height: 40px;
    padding: $spacing-xs $spacing-sm;
    gap: 2px;

    .icon {
      width: 10px;
      height: 10px;
    }
  }

  .bottom-buttons {
    flex-shrink: 0;
    padding: 4px;
    border-top: 1px solid $border-color;
    
    gap: 2px;
}
}
</style>
