<template>
  <div class="left-sidebar">
    <input
      ref="fileInputRef"
      type="file"
      accept=".json"
      style="display: none"
      @change="handleFileChange"
    />
    <div class="control-group">
      <div 
        class="control-btn"
        @click="handleFile"
      >
        <img src="@/assets/file.svg" class="icon" alt="file" />
        <span class="label">文件</span>
      </div>
      <div 
        class="control-btn"
        @click="handleSave"
      >
        <img src="@/assets/save.svg" class="icon" alt="save" />
        <span class="label">保存</span>
      </div>
      <div 
        class="control-btn"
        @click="handleTrigger"
      >
        <img src="@/assets/trigger.svg" class="icon" alt="trigger" />
        <span class="label">分组</span>
      </div>
      <div 
        class="control-btn"
        @click="handleUndo"
      >
        <img src="@/assets/undo.svg" class="icon" alt="undo" />
        <span class="label">撤销</span>
      </div>
      <div 
        class="control-btn"
        @click="handleRedo"
      >
        <img src="@/assets/redo.svg" class="icon" alt="redo" />
        <span class="label">重做</span>
      </div>
      <div 
        class="control-btn"
        @click="handleRun"
      >
        <img src="@/assets/run.svg" class="icon" alt="run" />
        <span class="label label-disabled">运行</span>
      </div>
      <div 
        class="control-btn"
        @click="showAboutModal = true"
      >
        <img src="@/assets/about.svg" class="icon" alt="about" />
        <span class="label">关于</span>
      </div>
    </div>
    
    <!-- 分组管理模态框 -->
    <GroupModal 
      :visible="showGroupModal" 
      @close="showGroupModal = false" 
    />

    <!-- 关于模态框 -->
    <div v-if="showAboutModal" class="about-modal-overlay" @click.self="showAboutModal = false">
      <div class="about-modal">
        <div class="about-modal-header">
          <h3>关于 EGC-Simu Vue3</h3>
          <button class="close-btn" @click="showAboutModal = false">×</button>
        </div>
        <div class="about-modal-content">
          <p>EgcSimu Vue3</p>
          <p>仿《蛋仔派对》工坊蛋码编辑器，网页前端实现。</p>
          <p>使用Vue3+TS重构的蛋码模拟器，可以在浏览器中高效运行，提供便捷的蛋码编辑功能。</p>
          <p>你可以根据蛋码编辑器的使用方法来进行拼蛋码，保存，撤回等操作。</p>
          <p>如果发现部分类型错误，是正常现象，可反馈。</p>
          <p>本项目目前只用于展示或教学演示功能，暂无法转换为可用蛋码。</p>
          <p>版本：1.0.1</p>
          <a href="https://github.com/syss11/EgcSimu-Vue3" target="_blank" style="text-decoration: none;">GitHub 仓库</a>
          <p>作者：水杨酸酸</p>
          <p>© 2026 Salicylic. All rights reserved.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {  ref } from 'vue'
import GroupModal from '@/components/GroupModal.vue'
import { GLOBAL_OPER_RECORD, REDO_OPER_RECORD } from '@/utils/oper-record'
import { EggCode } from '@/types/eggCode'
import { deleteEggCode, recreateEggCode } from '@/utils/egc-utils'
import { useEventBus } from '@/composables/useEventBus'
import { downloadSaveFile, loadSaveFile } from '@/save'

const showAboutModal = ref(false)
const showGroupModal = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const { emit, EventTypes } = useEventBus()

// const { emit, EventTypes } = useEventBusComposable()

function handleFile() {
  fileInputRef.value?.click()
}

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const success = await loadSaveFile(file)
    if (success) {
      emit(EventTypes.SHOW_TOAST, { message: '加载成功' })
    } else {
      emit(EventTypes.SHOW_TOAST, { message: '加载失败' })
    }
    target.value = ''
  }
}

function handleSave() {
  downloadSaveFile()
  emit(EventTypes.SHOW_TOAST, { message: '保存成功' })
}

function handleTrigger() {
  showGroupModal.value = true
}

function handleUndo() {
  if (GLOBAL_OPER_RECORD.length > 0) {
    // 获取最后一条操作记录
    const lastRecord = GLOBAL_OPER_RECORD.pop()
    
    if (lastRecord) {
      const { oper } = lastRecord
      
      // 根据操作类型进行不同的处理
      if (oper.type === 'add') {
        // 撤销添加操作：删除添加的eggcode
        const { parent, index } = oper
        const eggCode = parent.children[index]
        
        if (eggCode instanceof EggCode) {
          const success = deleteEggCode(eggCode)
          
          if (success) {
            // 将撤销的操作添加到redo栈
            REDO_OPER_RECORD.push(lastRecord)
          }
        }
      } else if (oper.type === 'delete') {
        // 撤销删除操作：恢复被删除的eggcode
        const { eggCode, parent, index } = oper
        
        // 直接复用记录中的eggcode对象，恢复到原来的位置
        parent.children.splice(index, 0, eggCode)
        
        // 将撤销的操作添加到redo栈
        REDO_OPER_RECORD.push(lastRecord)
      } else if (oper.type === 'paste') {
        // 撤销粘贴操作：删除粘贴的eggcode
        const { parent, index } = oper
        const eggCode = parent.children[index]
        
        if (eggCode instanceof EggCode) {
          const success = deleteEggCode(eggCode)
          
          if (success) {
            // 将撤销的操作添加到redo栈
            REDO_OPER_RECORD.push(lastRecord)
          }
        }
      }
    }
  } else {
    // 无法撤销时显示提示
    emit(EventTypes.SHOW_TOAST, { message: '无法撤销' })
  }
}

function handleRedo() {
  if (REDO_OPER_RECORD.length > 0) {
    // 获取redo栈中最后一条操作记录
    const redoRecord = REDO_OPER_RECORD.pop()
    
    if (redoRecord) {
      const { oper } = redoRecord
      
      // 根据操作类型进行不同的处理
      if (oper.type === 'add') {
        // 重做添加操作：重新添加eggcode
        const { prefab, parent, index } = oper
        
        // 创建新的EggCode实例
        const newEggCode = recreateEggCode(prefab, parent, index)
        
        // 添加eggcode到原来的位置
        parent.children.splice(index, 0, newEggCode)
        
        // 将重做的操作添加回undo栈
        GLOBAL_OPER_RECORD.push(redoRecord)
      } else if (oper.type === 'delete') {
        // 重做删除操作：重新删除eggcode
        const { parent, index } = oper
        
        // 找到当前位置的eggcode（可能已经被恢复了）
        const currentEggCode = parent.children[index]
        
        if (currentEggCode instanceof EggCode) {
          const success = deleteEggCode(currentEggCode)
          
          if (success) {
            // 将重做的操作添加回undo栈
            GLOBAL_OPER_RECORD.push(redoRecord)
          }
        }
      } else if (oper.type === 'paste') {
        // 重做粘贴操作：重新粘贴eggcode
        const { eggCode, parent, index } = oper
        
        // 直接复用记录中的eggcode对象，恢复到原来的位置
        parent.children.splice(index, 0, eggCode)
        
        // 将重做的操作添加回undo栈
        GLOBAL_OPER_RECORD.push(redoRecord)
      }
    }
  } else {
    // 无法重做时显示提示
    emit(EventTypes.SHOW_TOAST, { message: '无法重做' })
  }
}

function handleRun() {
  console.log('运行')
}
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.left-sidebar {
  width: 100%;
  height: 100%;
  background-color: $surface;
  border-right: 1px solid $border-color;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.control-group {
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  overflow-y: auto;
}

.control-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-md;
  padding-top: 15px;
  padding-bottom: 15px;
  border-radius: $border-radius-md;
  cursor: pointer;
  transition: all $transition-fast;
  background-color: $surface;
  border: 1px solid $border-color;
  min-height: 40px;
  white-space: nowrap;
  user-select: none;

  &:hover {
    background-color: $background;
    border-color: $primary;
  }

  &:active {
    transform: scale(0.98);
  }

  .icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  .label {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
  }
}

/* 关于模态框样式 */
.about-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.about-modal {
  background-color: $surface;
  border-radius: $border-radius-lg;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 400px;
  max-width: 90%;
}

.about-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md;
  border-bottom: 1px solid $border-color;
}

.about-modal-header h3 {
  margin: 0;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.close-btn {
  background: none;
  border: none;
  font-size: $font-size-xl;
  cursor: pointer;
  color: $text-secondary;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $border-radius-sm;
  
  &:hover {
    background-color: $background;
    color: $text-primary;
  }
}

.about-modal-content {
  padding: $spacing-md;
  color: $text-secondary;
  line-height: 1.6;
}

.about-modal-content p {
  margin: $spacing-sm 0;
}

.label-disabled {
  text-decoration: line-through;
  color: #999;
}



@media screen and (max-height: 500px) and (orientation: landscape) {
  .icon {
    width: 10px;
    height: 10px;
    flex-shrink: 0;
  }

    
  .control-btn {
    gap: 2px;
  }
}
</style>
