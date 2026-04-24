<template>
  <div v-if="visible" class="group-modal-overlay" @click.self="handleClose">
    <div class="group-modal">
      <div class="group-modal-header">
        <h3>分组管理</h3>
        <button class="close-btn" @click="handleClose">×</button>
      </div>
      <div class="group-modal-content">
        <div class="group-list">
          <div 
            v-for="group in groups" 
            @click="handleSwitchGroup(group.id)"
            :key="group.id"
            :class="['group-item', { 'active': group.id === activeGroupId }]"
          >
            <div class="group-item-content">
              <template v-if="editingGroup !== group.id">
                <span>{{ group.name }}</span>
                <div class="group-item-actions">
                  <button class="group-item-btn edit-btn" @click.stop="handleEditGroup(group)">✏️</button>
                  <button class="group-item-btn delete-btn" @click.stop="handleDeleteGroup(group.id)">🗑️</button>
                </div>
              </template>
              <template v-else>
                <input 
                  v-model="editGroupName"
                  type="text"
                  class="group-edit-input"
                  @keyup.enter="handleSaveEdit(group.id)"
                  @keyup.esc="handleCancelEdit"
                />
                <div class="group-item-actions">
                  <button class="group-item-btn save-btn" @click.stop="handleSaveEdit(group.id)">✅</button>
                  <button class="group-item-btn cancel-btn" @click.stop="handleCancelEdit">❌</button>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="group-add">
          <input 
            v-model="newGroupName"
            type="text"
            placeholder="输入新分组名称"
            class="group-input"
            @keyup.enter="handleAddNewGroup"
          />
          <button class="group-add-btn" @click="handleAddNewGroup">添加</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { groups, activeGroupId, createNewGroup, setActiveGroup } from '@/utils/groups'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const newGroupName = ref('')
const editingGroup = ref<string | null>(null)
const editGroupName = ref('')

function handleClose() {
  emit('close')
  newGroupName.value = ''
  editingGroup.value = null
  editGroupName.value = ''
}
function handleSwitchGroup(groupId: string) {
  setActiveGroup(groupId)
  handleClose()
}
function handleAddNewGroup() {
  if (newGroupName.value.trim()) {
    createNewGroup(newGroupName.value.trim())
    newGroupName.value = ''
  }
}

function handleEditGroup(group: any) {
  editingGroup.value = group.id
  editGroupName.value = group.name
}

function handleSaveEdit(groupId: string) {
  if (editGroupName.value && editGroupName.value.trim()) {
    const group = groups.value.find(g => g.id === groupId)
    if (group) {
      group.name = editGroupName.value.trim()
    }
    editingGroup.value = null
    editGroupName.value = ''
  }
}

function handleCancelEdit() {
  editingGroup.value = null
  editGroupName.value = ''
}

function handleDeleteGroup(groupId: string) {
  if (confirm('确定要删除这个分组吗？')) {
    const index = groups.value.findIndex(g => g.id === groupId)
    if (index !== -1) {
      groups.value.splice(index, 1)
      
      // 如果删除的是当前活动组，切换到第一个组
      if (groupId === activeGroupId.value && groups.value.length > 0) {
        const firstGroup = groups.value[0]
        if (firstGroup) {
          setActiveGroup(firstGroup.id)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;
@use 'sass:color';

.group-modal-overlay {
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

.group-modal {
  background-color: $surface;
  border-radius: $border-radius-lg;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 400px;
  max-width: 90%;
}

.group-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md;
  border-bottom: 1px solid $border-color;
}

.group-modal-header h3 {
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

.group-modal-content {
  padding: $spacing-md;
}

.group-list {
  margin-bottom: $spacing-md;
}

.group-item {
  padding: $spacing-sm $spacing-md;
  margin-bottom: $spacing-xs;
  background-color: $background;
  border: 1px solid $border-color;
  border-radius: $border-radius-md;
  cursor: pointer;
  transition: all $transition-fast;
  
  &:hover {
    background-color: $surface;
    border-color: $primary;
  }
  
  &.active {
    background-color: $primary;
    color: white;
    border-color: $primary;
  }
}

.group-item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.group-item-actions {
  display: flex;
  gap: $spacing-xs;
}

.group-item-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  border-radius: $border-radius-sm;
  font-size: $font-size-sm;
  transition: background-color $transition-fast;
  
  &:hover {
    background-color: $background;
  }
  
  &.edit-btn:hover {
    color: #1890ff;
  }
  
  &.delete-btn:hover {
    color: #f5222d;
  }
  
  &.save-btn:hover {
    color: #52c41a;
  }
  
  &.cancel-btn:hover {
    color: #faad14;
  }
}

.group-edit-input {
  flex: 1;
  padding: $spacing-xs $spacing-sm;
  border: 1px solid $primary;
  border-radius: $border-radius-sm;
  font-size: $font-size-sm;
  
  &:focus {
    outline: none;
    border-color: $primary;
    box-shadow: 0 0 0 2px rgba($primary, 0.2);
  }
}

.group-add {
  display: flex;
  gap: $spacing-sm;
}

.group-input {
  flex: 1;
  padding: $spacing-sm $spacing-md;
  border: 1px solid $border-color;
  border-radius: $border-radius-md;
  font-size: $font-size-sm;
  
  &:focus {
    outline: none;
    border-color: $primary;
  }
}

.group-add-btn {
  padding: $spacing-sm $spacing-md;
  background-color: $primary;
  color: white;
  border: none;
  border-radius: $border-radius-md;
  cursor: pointer;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  transition: background-color $transition-fast;
  
  &:hover {
    background-color: color.adjust($primary, $lightness: -10%);
  }
  
  &:active {
    transform: scale(0.98);
  }
}
@media (max-height: 500px) and (orientation: landscape){
  .group-modal {
    width: 320px;
    max-height: 80vh;
  }
  
  .group-modal-content {
    max-height: calc(80vh - 60px);
    overflow-y: auto;
  }
  
  .group-list {
    max-height: 150px;
    overflow-y: auto;
  }
}
</style>
