import { useEventBus } from '@/composables/useEventBus'
import type { EgcPrefab } from '@/types/egcPrefab'
import type { EgcVacancy, EggCode } from '@/types/eggCode'

export type OperRecord = {
  id: string;
  time: number;
  oper: OperAddEGC | OperDeleteEGC | OperPasteEGC;
}

export type OperAddEGC = {
  type: 'add';
  prefab: EgcPrefab;
  parent: any;
  index: number;
  vacancy: EgcVacancy;
}

export type OperDeleteEGC = {
  type: 'delete';
  eggCode: EggCode;
  parent: any;
  index: number;
}

export type OperPasteEGC = {
  type: 'paste';
  eggCode: EggCode;
  parent: any;
  index: number;
  vacancy: EgcVacancy;
}


export const GLOBAL_OPER_RECORD: OperRecord[] = []
export const REDO_OPER_RECORD: OperRecord[] = []

// 监听操作事件并记录
const { on, EventTypes } = useEventBus()

// 限制栈长度
const MAX_STACK_SIZE = 20

// 添加操作记录并限制栈长度
function addRecord(record: OperRecord) {
  GLOBAL_OPER_RECORD.push(record)
  
  // 限制栈长度
  if (GLOBAL_OPER_RECORD.length > MAX_STACK_SIZE) {
    GLOBAL_OPER_RECORD.shift()
  }
  
  // 添加新操作时清空redo栈
  REDO_OPER_RECORD.length = 0
}

on(EventTypes.ADD_EGC_OPERATION, ({ prefab, parent, index, vacancy }) => {
  const record: OperRecord = {
    id: Date.now().toString(),
    time: Date.now(),
    oper: {
      type: 'add',
      prefab: prefab,
      parent: parent,
      index: index,
      vacancy: vacancy
    }
  }
  
  addRecord(record)
})

on(EventTypes.DELETE_EGC_OPERATION, ({ eggCode, parent, index }) => {
  const record: OperRecord = {
    id: Date.now().toString(),
    time: Date.now(),
    oper: {
      type: 'delete',
      eggCode: eggCode,
      parent: parent,
      index: index
    }
  }
  
  addRecord(record)
})

on(EventTypes.PASTE_EGC_OPERATION, ({ eggCode, parent, index, vacancy }) => {
  const record: OperRecord = {
    id: Date.now().toString(),
    time: Date.now(),
    oper: {
      type: 'paste',
      eggCode: eggCode,
      parent: parent,
      index: index,
      vacancy: vacancy
    }
  }
  
  addRecord(record)
})
