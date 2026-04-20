<template>
  <div class="left-content" ref="mainui" @click="clearFocus()">
    <div class="header">
      <div class="header-left">
        <h2 class="project-name">{{ projectName }}</h2>
        <span class="separator">/</span>
        <h3 class="group-name">{{ activeGroup.name }}</h3>
      </div>
      <button class="rename-button" @click.stop="showRenameModal = true">
        <img src="@/assets/rename.svg" class="icon" alt="rename" />
      </button>
    </div>
    <div class="group">
      <div v-for="assembly in activeGroup.assemblies" :key="assembly.id" class="assembly">
        <EgcAssemblyvue :assembly="assembly" />
      </div>
    </div>
    <div class="add-button" @click="addAssembly()">
      
      <span class="icon">十</span>
  
    </div>
    
    <!-- 改名模态框 -->
    <div v-if="showRenameModal" class="rename-modal">
      <div class="rename-modal-content">
        <h3>重命名项目</h3>
        <input v-model="newProjectName" type="text" placeholder="输入新项目名称" />
        <div class="rename-modal-buttons">
          <button @click="confirmRename">确定</button>
          <button @click="cancelRename">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef, reactive, computed, ref } from 'vue';
import { EgcAssembly } from '@/types/eggCode';
import EgcAssemblyvue from '@/components/EgcAssemblyvue.vue';
import { globalStore } from '@/store';
import { useEventBus } from '@/composables/useEventBus';
import { getActiveGroup, projectmeta } from '@/utils/groups';
const { emit,EventTypes } = useEventBus()

const mainui = useTemplateRef<HTMLDivElement>('mainui');
const showRenameModal = ref(false)
const newProjectName = ref(projectmeta.value.name)

// 计算属性：获取当前活动组
const activeGroup = computed(() => getActiveGroup())
const projectName = computed(() => projectmeta.value.name)

function clearFocus(){
  globalStore.focus=null;
  emit(EventTypes.SET_SELECTOR_VISIBLE, { visible: false })
}

function addAssembly() {
  if (mainui.value) {
    activeGroup.value.assemblies.push(reactive(new EgcAssembly(mainui.value, activeGroup.value.id)))
  }
}

function confirmRename() {
  if (newProjectName.value.trim()) {
    projectmeta.value.name = newProjectName.value.trim()
    showRenameModal.value = false
  }
}

function cancelRename() {
  newProjectName.value = projectmeta.value.name
  showRenameModal.value = false
}
  
onMounted(() => {
  if (mainui.value) {
    activeGroup.value.assemblies.push(reactive(new EgcAssembly(mainui.value, activeGroup.value.id)))
  }
})

</script>

<style scoped lang="scss">

@use '@/styles/variables.scss';
.left-content {
  width: 100%;
  height: 100%;
  background-color: $background;
  overflow: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md;
  background-color: $surface;
  border-bottom: 1px solid $border-color;
  margin-bottom: $spacing-md;
}

.header-left {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.project-name {
  margin: 0;
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $text-primary;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.separator {
  color: $text-secondary;
  font-size: $font-size-md;
}

.group-name {
  margin: 0;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rename-button {
  padding: $spacing-xs;
  background-color: $background;
  color: white;
  border: none;
  border-radius: $border-radius-sm;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: darken($background, 10%);
  }
}

.rename-button .icon {
  width: 16px;
  height: 16px;
  color: white;
}

.group {
  margin-bottom: $spacing-lg;
}

.assembly {
  padding: 8px;
  margin-bottom: 20px;
  background-color: $surface;
  border-radius: $border-radius-md;
}


.add-button {
  padding: $spacing-md;
  border: 2.5px dashed variables.$border-color;
  background-color: transparent;
  color: variables.$border-color;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 200px;
  height: 45px;
  border-radius: 10px;
  user-select: none;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.icon {
  font-size: 25px;
  display: flex; justify-content: center; align-items: center;
}

.rename-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.rename-modal-content {
  background-color: $surface;
  padding: $spacing-lg;
  border-radius: $border-radius-md;
  width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.rename-modal-content h3 {
  margin: 0 0 $spacing-md 0;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.rename-modal-content input {
  width: 100%;
  padding: $spacing-sm;
  border: 1px solid $border-color;
  border-radius: $border-radius-sm;
  margin-bottom: $spacing-md;
  font-size: $font-size-sm;
}

.rename-modal-buttons {
  display: flex;
  gap: $spacing-sm;
  justify-content: flex-end;
}

.rename-modal-buttons button {
  padding: $spacing-xs $spacing-sm;
  border: none;
  border-radius: $border-radius-sm;
  cursor: pointer;
  font-size: $font-size-sm;
  transition: background-color 0.2s ease;
}

.rename-modal-buttons button:first-child {
  background-color: $primary;
  color: white;
  
  &:hover {
    background-color: $primary-dark;
  }
}

.rename-modal-buttons button:last-child {
  background-color: $surface;
  color: $text-primary;
  border: 1px solid $border-color;
  
  &:hover {
    background-color: $background;
  }
}
</style>