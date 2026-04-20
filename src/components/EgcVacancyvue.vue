<template>
  <div @click.stop.prevent="handleClick()" :class="{'focused': focused,'vacancy': !vacancy.forValue,'v-vacancy': vacancy.forValue}">
    <span v-if="!showTypeLimit" :class="{'vacancy-icon': !vacancy.forValue,'v-vacancy-icon': vacancy.forValue}">十</span>
    <span v-else class="type-limit">{{ typeDisplay }}</span>
  </div>
</template>

<script setup lang="ts">
import { EgcAssembly, EgcVacancy, EggCode, EggCodeControl } from '@/types/eggCode';
import { globalStore } from '@/store';
import { computed, reactive, watch } from 'vue';
import { valueTypeToChinese } from '@/types/egcTypes';
import { useEventBus } from '@/composables/useEventBus';
import { type EgcPrefab, EgcControlPrefab } from '@/types/egcPrefab';
const { once, EventTypes, emit } = useEventBus()

const props = defineProps({
  vacancy: {
    type: EgcVacancy,
    required: true,
  },
})

let unsubscribeHandler: (() => void) | null = null

watch(() => globalStore.focus, (newFocus) => {
    if (newFocus !== props.vacancy && unsubscribeHandler) {
        unsubscribeHandler()
        unsubscribeHandler = null
    }
})

function handleClick() {
    if (focused.value) {
        if (unsubscribeHandler) {
            unsubscribeHandler()
            unsubscribeHandler = null
        }
        globalStore.focus = null
        return
    }
    globalStore.focus = props.vacancy
    unsubscribeHandler = once(EventTypes.SELECT_EGCPREFAB, ({ egcPrefab }) => {
      let newegc=reactive(createEggcode(egcPrefab))
      
      if (props.vacancy.parent instanceof EgcAssembly) {
        props.vacancy.parent.eventneeded=false
        props.vacancy.parent.children.push(newegc)
      }else{
        props.vacancy.parent.children.splice(props.vacancy.index, 1, newegc)
      }

      unsubscribeHandler = null
      globalStore.focus = null
    })
}


function createEggcode(prefab: EgcPrefab) {
  let newEggCode
  if (prefab instanceof EgcControlPrefab) {
    newEggCode = new EggCodeControl(prefab,props.vacancy.parent,props.vacancy.index)
  } else {
    newEggCode = new EggCode(prefab,props.vacancy.parent,props.vacancy.index)
  }
  let indexv=0
  if (props.vacancy.forValue) {
    indexv=props.vacancy.index
  }else{
    indexv=props.vacancy.parent.children.length
  }
  // 发送事件记录操作
  emit(EventTypes.ADD_EGC_OPERATION, {
    prefab: prefab,
    parent: props.vacancy.parent,
    index: indexv,
    vacancy: props.vacancy,
    eggCode: newEggCode
  })
  
  return newEggCode
}

const typeDisplay = computed(()=> valueTypeToChinese(props.vacancy.return_type_limit[0]!))

const focused = computed(() => globalStore.focus === props.vacancy)

// 计算属性：判断是否显示类型限制
const showTypeLimit = computed(() => {
  return props.vacancy.forValue && 
         props.vacancy.return_type_limit && 
         props.vacancy.return_type_limit.length === 1 && 
         props.vacancy.forVarOnly == false
})
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss';

.vacancy {
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
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &-icon {
    font-size: 25px;
  }
}


.v-vacancy {
  padding: $spacing-md;
  border: 2px solid variables.$border-color;
  background-color: variables.$vacancy-color;
  color: variables.$border-color;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: fit-content;
  height: 16px;
  margin-top: 2px;
  border-radius: 20px;
  user-select: none;
  cursor: pointer;

  &:hover {
    background-color: rgba(11, 47, 115, 0.95);
  }

  &-icon {
    font-size:small;
    
  }
}



.focused {
  border: 2px solid rgb(252, 218, 81);
  color: rgb(252, 218, 81);
}

.type-limit {
  font-size: 14.5px;
  color: rgba(236, 236, 236, 0.853);
  text-align: center;
  opacity: 0.8;
  font-weight: 500;
}

</style>
