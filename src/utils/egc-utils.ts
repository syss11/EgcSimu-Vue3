import { EgcAssembly, EgcVacancy, EggCode } from '@/types/eggCode'
import type { EgcPrefab } from '@/types/egcPrefab'

// 删除EggCode的核心逻辑
export function deleteEggCode(eggCode: EggCode): boolean {
  if (!eggCode || !eggCode.parent) {
    return false
  }

  // 获取当前EggCode在parent的children中的索引
  const index = eggCode.parent.children.indexOf(eggCode)

  if (index === -1) {
    return false
  }

  // 如果parent是EgcAssembly，直接删除
  if (eggCode.parent instanceof EgcAssembly) {
    if (eggCode.prefab && eggCode.prefab.type === 'event') {
      eggCode.parent.eventneeded = true
    }
    eggCode.parent.children.splice(index, 1)
  } else {
    // 如果parent是EggCode，替换为vacancy
    const newVacancy = new EgcVacancy(
      eggCode.parent, 
      index, 
      true, 
      eggCode.parent.prefab.param_types[index]
    )
    eggCode.parent.children.splice(index, 1, newVacancy)
  }

  return true
}

// 重新创建EggCode的逻辑函数
export function recreateEggCode(prefab: EgcPrefab, parent: any, index: number): EggCode {
  // 根据prefab类型创建不同的EggCode实例
  if (prefab.constructor.name === 'EgcControlPrefab') {
    return new (window as any).EggCodeControl(prefab, parent, index)
  } else {
    return new EggCode(prefab, parent, index)
  }
}
