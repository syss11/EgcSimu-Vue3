// src/utils/event-bus.ts
import type { EgcPrefab } from '@/types/egcPrefab';
import type { EggCode, EgcVacancy } from '@/types/eggCode';
import mitt, { type Emitter } from 'mitt'
import type { Variable } from '@/store';

// 1. 定义事件类型
export type EventMap = {
    // 通配符事件（监听所有事件）
    '*': {
      type: string
      payload?: any
    },
    // 滚动到指定类型
    'scroll-to-type': {
      type: string
    },
    'select-egcprefab': {
      egcPrefab: EgcPrefab
    },
    // 切换搜索框显示
    'toggle-search': {},
    'set-selector-visible': {
      visible: boolean
    },
    // 打开变量模态窗口
    'open-variable-modal': {},
    // 添加变量到选择器
    'add-variable-to-selector': {
      variable: Variable
    },
    // 显示提示框
    'show-toast': {
      message: string
    },
    // 添加EGC操作记录
    'add-egc-operation': {
      prefab: EgcPrefab
      parent: any
      index: number
      vacancy: EgcVacancy
      eggCode: EggCode
    },
    // 删除EGC操作记录
    'delete-egc-operation': {
      eggCode: EggCode
      parent: any
      index: number
    },
    // 粘贴EGC操作记录
    'paste-egc-operation': {
      eggCode: EggCode
      parent: any
      index: number
      vacancy: EgcVacancy
    }
};


// 2. 创建强类型事件总线
class TypedEventBus {
  private emitter: Emitter<EventMap>
  
  constructor() {
    this.emitter = mitt<EventMap>()
  }
  
  // 监听事件
  on<K extends keyof EventMap>(
    type: K,
    handler: (event: EventMap[K]) => void
  ): () => void {
    this.emitter.on(type, handler)
    return () => this.off(type, handler)
  }
  
  // 触发事件
  emit<K extends keyof EventMap>(
    type: K,
    event?: EventMap[K]
  ): void {
    this.emitter.emit(type, event!)
  }
  
  // 取消监听
  off<K extends keyof EventMap>(
    type: K,
    handler: (event: EventMap[K]) => void
  ): void {
    this.emitter.off(type, handler)
  }
  
  // 一次性监听
  once<K extends keyof EventMap>(
    type: K,
    handler: (event: EventMap[K]) => void
  ): () => void {
    let unsubscribe: (() => void) | null = null
    
    const onceHandler = (event: EventMap[K]) => {
      handler(event)
      if (unsubscribe) {
        unsubscribe()
      }
    }
    
    unsubscribe = this.on(type, onceHandler)
    return unsubscribe
  }
  
  // 清空所有监听器
  clearAll(): void {
    this.emitter.all.clear()
  }
  
  // 获取所有监听器
  getListeners<K extends keyof EventMap>(type: K): Function[] {
    return this.emitter.all.get(type) || []
  }
}

// 3. 创建单例事件总线实例
export const eventBus = new TypedEventBus()

// 4. 导出事件类型常量（便于使用）
export const EventTypes = {
  
  WINDOW_SCROLL: 'window:scroll',
  SCROLL_TO_TYPE: 'scroll-to-type',
  SELECT_EGCPREFAB: 'select-egcprefab',
  TOGGLE_SEARCH: 'toggle-search',
  SET_SELECTOR_VISIBLE: 'set-selector-visible',
    OPEN_VARIABLE_MODAL: 'open-variable-modal',
    ADD_VARIABLE_TO_SELECTOR: 'add-variable-to-selector',
    SHOW_TOAST: 'show-toast',
    ADD_EGC_OPERATION: 'add-egc-operation',
    DELETE_EGC_OPERATION: 'delete-egc-operation',
    PASTE_EGC_OPERATION: 'paste-egc-operation'
} as const
