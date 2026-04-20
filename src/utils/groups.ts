
import { ref } from 'vue'
import { EgcAssembly } from '@/types/eggCode'
import { getidforGroup } from './getid'

// 定义组类型
export interface Group {
  id: string
  name: string
  assemblies: EgcAssembly[]
}

// 创建响应式的组数组
export const groups = ref<Group[]>([{
  id: getidforGroup()(),
  name: '默认分组',
  assemblies: []
}])

// 创建响应式的当前活动组ID
export const activeGroupId = ref(groups.value[0]?.id || '')

// 创建新组
export function createNewGroup(name?: string): Group {
  const newGroup: Group = {
    id: getidforGroup()(),
    name: name || `分组 ${groups.value.length + 1}`,
    assemblies: []
  }
  groups.value.push(newGroup)
  return newGroup
}

// 获取当前活动组
export function getActiveGroup(): Group {
  const group = groups.value.find(g => g.id === activeGroupId.value)
  return group || groups.value[0] || { id: '', name: '', assemblies: [] }
}

// 设置当前活动组
export function setActiveGroup(groupId: string): void {
  activeGroupId.value = groupId
}

export function getAllGroups(): Group[] {
  return groups.value
}

export function setAllGroups(newGroups: Group[]): void {
  groups.value = newGroups
}

export const projectmeta = ref({
  name: '新项目'
})