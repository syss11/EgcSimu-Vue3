<template>
  <div v-if="showTray" class="operation-tray">
    <!-- 当focus为EggCode时显示的操作 -->
    <template v-if="!isVacancy">
      <div class="operation-tray__button" @click="handleDelete">
        <span class="operation-tray__icon">🗑️</span>
        <span class="operation-tray__label">删除</span>
      </div>
      <div class="operation-tray__button" @click="handleCopy">
        <span class="operation-tray__icon">📋</span>
        <span class="operation-tray__label">复制</span>
      </div>
      <div class="operation-tray__button" @click="handleComment">
        <span class="operation-tray__icon">💬</span>
        <span class="operation-tray__label">注释</span>
      </div>
    </template>
    
    <!-- 当focus为EgcVacancy时显示的操作 -->
    <template v-else>
      <div v-if="hasClipboardContent" class="operation-tray__button" @click="handlePaste">
        <span class="operation-tray__icon">📋</span>
        <span class="operation-tray__label">粘贴</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useEventBus } from '@/composables/useEventBus'
import { computed, ref, type Ref } from 'vue'

import { globalStore } from '@/store'
import { EggCode, EgcVacancy, EgcAssembly } from '@/types/eggCode'
import { deleteEggCode } from '@/utils/egc-utils'

const { EventTypes, emit } = useEventBus()

// 计算属性：检查 focus 是否为 EggCode 或 EgcVacancy 类型
const showTray = computed(() => {
  return globalStore.focus instanceof EggCode || globalStore.focus instanceof EgcVacancy
})

// 计算属性：检查当前 focus 是否为 vacancy
const isVacancy = computed(() => {
  return globalStore.focus instanceof EgcVacancy
})

// 计算属性：检查剪贴板是否有内容
const hasClipboardContent = computed(() => {
  return clipboard.value != null
})

function handleDelete() {
  const eggCode = globalStore.focus as EggCode
  
  if (eggCode) {
    // 获取当前EggCode在parent的children中的索引
    const index = eggCode.parent.children.indexOf(eggCode)
    
    if (index !== -1) {
      // 发送删除操作事件
      emit(EventTypes.DELETE_EGC_OPERATION, {
        eggCode: eggCode,
        parent: eggCode.parent,
        index: index
      })
      
      const success = deleteEggCode(eggCode)
      
      if (success) {
        // 清除 focus
        globalStore.focus = null
        console.log('删除成功', eggCode)
      }
    }
  }
}

// 全局剪贴板
let clipboard:Ref<EggCode | null> = ref(null)

function handleCopy() {
  const eggCode = globalStore.focus as EggCode
  
  if (eggCode) {
    clipboard.value = eggCode
    emit(EventTypes.SHOW_TOAST, { message: '复制成功' })
    console.log('复制成功', eggCode)
  }
}

function handleComment() {
  const eggCode = globalStore.focus as EggCode
  
  if (eggCode) {
    const comment = prompt('请输入注释内容：', eggCode.comment || '')
    
    if (comment !== null) {
      eggCode.comment = comment.trim() === '' ? undefined : comment.trim()
      emit(EventTypes.SHOW_TOAST, { message: eggCode.comment ? '注释已添加' : '注释已删除' })
      console.log('注释操作', eggCode)
    }
  }
}

function deepCloneEggCode(source: EggCode, newParent: any, newIndex: number): EggCode {
  let cloned: EggCode
  
  if (source.constructor.name === 'EggCodeControl') {
    cloned = new (source.constructor as any)(source.prefab, newParent, newIndex)
  } else {
    cloned = new EggCode(source.prefab, newParent, newIndex)
  }
  
  // 深拷贝子节点
  cloned.children = source.children.map((child, index) => {
    if (child instanceof EggCode) {
      return deepCloneEggCode(child, cloned, index)
    } else if (child instanceof EgcVacancy) {
      return new EgcVacancy(cloned, index, child.forValue, [...(child.return_type_limit || [])])
    }
    return child
  })
  
  return cloned
}

function handlePaste() {
  const vacancy = globalStore.focus as EgcVacancy
  
  if (vacancy && clipboard.value) {
    // 检查1: 如果vacancy.parent是EgcAssembly且eventneeded为true，则不允许粘贴event类型的eggcode
    if (vacancy.parent instanceof EgcAssembly && !vacancy.parent.eventneeded && clipboard.value.prefab.type === 'event') {
      emit(EventTypes.SHOW_TOAST, { message: '不能添加多个事件' })
      return
    }
    
    // 检查2: 如果parent是EggCode，检查return type是否符合param类型要求
    if (vacancy.parent instanceof EggCode) {
      const paramTypes = vacancy.parent.prefab.param_types[vacancy.index]
      const returnType = clipboard.value.prefab.return_type
      
      // 检查返回类型是否符合参数类型要求
      if (paramTypes && returnType) {
        const hasMatchingType = paramTypes.includes(returnType)
        
        if (!hasMatchingType) {
          emit(EventTypes.SHOW_TOAST, { message: `操作失败，类型不匹配` })
          return
        }
      }
    }
    
    // 深拷贝clipboard内容
    const clonedEggCode = deepCloneEggCode(clipboard.value, vacancy.parent, vacancy.index)
    
    // 替换vacancy为深拷贝的内容
    if(vacancy.parent instanceof EgcAssembly){
      vacancy.parent.children.push(clonedEggCode)
    }else{
      vacancy.parent.children.splice(vacancy.index, 1, clonedEggCode)
    }
    
    // 记录粘贴操作
    emit(EventTypes.PASTE_EGC_OPERATION, { 
      eggCode: clonedEggCode, 
      parent: vacancy.parent, 
      index: vacancy.parent instanceof EgcAssembly ? vacancy.parent.children.length - 1 : vacancy.index,
      vacancy: vacancy
    })
    
    // 清除focus
    globalStore.focus = null
    
    console.log('粘贴成功', clonedEggCode)
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.operation-tray {
  position: fixed;
  bottom: $spacing-lg;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  gap: $spacing-xs;
  background-color: $surface;
  padding: $spacing-sm;
  border-radius: $border-radius-lg;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid $border-color;
  z-index: 100;
}

.operation-tray__button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
  padding: 4px;
  cursor: pointer;
  transition: all $transition-fast;
  border-radius: $border-radius-md;
  min-width: 50px;
  
  &:hover {
    background-color: $primary;
    color: white;
    
    .operation-tray__label {
      color: white;
    }
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.operation-tray__icon {
  font-size: $font-size-lg;
}

.operation-tray__label {
  font-size: $font-size-xs;
  color: $text-secondary;
  transition: color $transition-fast;
}

@media screen and (max-height: 500px) and (orientation: landscape) {
  .operation-tray {
    padding: $spacing-xs;
    gap: $spacing-xs;
  }
  
  .operation-tray__button {
    min-width: 40px;
    padding: 2px;
  }
  
  .operation-tray__icon {
    font-size: $font-size-md;
  }
  
  .operation-tray__label {
    font-size: 10px;
  }
}
</style>
