// src/composables/useEventBus.ts
import { onUnmounted } from 'vue'
import { eventBus, EventTypes, type EventMap } from '@/utils/event-bus'

interface ListenerEntry {
  type: keyof EventMap
  handler: (event: any) => void
  unsubscribe: () => void
}

/**
 * 事件总线组合式函数
 * 自动管理事件监听器的生命周期
 */
export function useEventBus() {
  const listeners: ListenerEntry[] = []
  
  /**
   * 监听事件
   * @returns 取消监听的函数
   */
  const on = <K extends keyof EventMap>(
    type: K,
    handler: (event: EventMap[K]) => void
  ): (() => void) => {
    const unsubscribe = eventBus.on(type, handler)
    
    const listenerEntry: ListenerEntry = { type, handler, unsubscribe }
    listeners.push(listenerEntry)
    
    return () => {
      unsubscribe()
      const index = listeners.findIndex(l => l === listenerEntry)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }
  
  /**
   * 触发事件
   */
  const emit = <K extends keyof EventMap>(
    type: K,
    event?: EventMap[K]
  ): void => {
    eventBus.emit(type, event)
  }
  
  /**
   * 一次性监听
   */
  const once = <K extends keyof EventMap>(
    type: K,
    handler: (event: EventMap[K]) => void
  ): (() => void) => {
    let unsubscribe: (() => void) | null = null
    
    const wrappedHandler = (event: EventMap[K]) => {
      try {
        handler(event)
      } finally {
        if (unsubscribe) {
          unsubscribe()
          const index = listeners.findIndex(l => l.unsubscribe === unsubscribe)
          if (index > -1) {
            listeners.splice(index, 1)
          }
        }
      }
    }
    
    unsubscribe = eventBus.on(type, wrappedHandler)
    listeners.push({ type, handler: wrappedHandler, unsubscribe })
    
    return () => {
      if (unsubscribe) {
        unsubscribe()
        const index = listeners.findIndex(l => l.unsubscribe === unsubscribe)
        if (index > -1) {
          listeners.splice(index, 1)
        }
      }
    }
  }
  
  /**
   * 取消监听特定类型和处理器
   */
  const off = <K extends keyof EventMap>(
    type: K,
    handler: (event: EventMap[K]) => void
  ): void => {
    eventBus.off(type, handler)
    
    const index = listeners.findIndex(l => l.type === type && l.handler === handler)
    if (index > -1) {
      listeners[index]?.unsubscribe()
      listeners.splice(index, 1)
    }
  }
  
  /**
   * 取消监听特定类型的所有处理器
   */
  const offAll = <K extends keyof EventMap>(type: K): void => {
    const toRemove = listeners.filter(l => l.type === type)
    
    toRemove.forEach(l => l.unsubscribe())
    
    listeners.splice(
      0,
      listeners.length,
      ...listeners.filter(l => l.type !== type)
    )
  }
  
  /**
   * 取消监听（通过返回的取消函数）
   */
  const removeListener = (unsubscribeFn: () => void): void => {
    unsubscribeFn()
    const index = listeners.findIndex(l => l.unsubscribe === unsubscribeFn)
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }
  
  /**
   * 清理所有监听器
   */
  const clearAll = (): void => {
    listeners.forEach(({ unsubscribe }) => unsubscribe())
    listeners.length = 0
  }
  
  /**
   * 获取当前监听的所有事件类型
   */
  const getListeningEvents = (): Array<keyof EventMap> => {
    return Array.from(new Set(listeners.map(l => l.type)))
  }
  
  /**
   * 检查是否正在监听特定事件
   */
  const isListening = <K extends keyof EventMap>(type: K): boolean => {
    return listeners.some(l => l.type === type)
  }
  
  /**
   * 组件卸载时自动清理
   */
  onUnmounted(() => {
    clearAll()
  })
  
  return {
    on,
    emit,
    once,
    off,
    offAll,
    removeListener,
    clearAll,
    getListeningEvents,
    isListening,
    EventTypes
  }
}
