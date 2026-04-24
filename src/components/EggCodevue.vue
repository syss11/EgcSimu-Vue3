<template>
  <div class="egg-code">
    <div 
        :key="eggcode.id" 
        :class="['eggcodei', `eggcodei-${eggcode.prefab.type}`, {'focused': focused, 'variable': eggcode.prefab.category === 'variable'}]"
        @click.stop.prevent="handleClick(eggcode)"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
      <!-- 注释文本框 -->
        <input v-if="!isInput(eggcode) && (isHovered || focused) && eggcode.comment"
               class="comment-box"
               v-model="eggcode.comment"></input>
          
       <div class="egc-content" :class="{'egc-content-ctrl': isControll(eggcode)}">
        <span v-if="isInput(eggcode)" class="egc-input">
          <span class="egc-part" @click.stop.prevent>
            <input :class="['egc-input-field', 'egc-text', { 'invalid': isInvalid }]" v-model="eggcode.comment" placeholder="...">
          </span>
        </span>
        <span v-else v-for="item in eggcode.prefab.signature"
          :key="item.toString()"
          class="egc-part"
        >
          <span v-if="item.type=='text'" class="egc-text">{{ item.text }}</span>
          <span v-else class="egc-param">
            <EggCodevue v-if="getchildeggcode(item.index)" :eggcode="getchildeggcode(item.index)!" />
            <EgcVacancyvue v-else-if="getVacancy(item.index)" :vacancy="getVacancy(item.index)!" />
            <EgcVacancyvue v-else :vacancy="addVacancy(item.index)" />
          </span>
        </span>
       </div>
        <span v-if="isControll(eggcode)">
          <span v-for="item in eggcode.sub_vacancies" :key="item.id">
            <EgcAssemblyvue :key="item.id" :assembly="item" class="control-area"/>
            <br>
          </span>
        </span>
        
        
      </div>
  </div>
</template>

<script setup lang="ts">
import {  EggCode,EgcVacancy, EggCodeControl } from '@/types/eggCode';
import { globalStore } from '@/store';
import { computed, reactive, ref, watch } from 'vue';
import EgcVacancyvue from '@/components/EgcVacancyvue.vue'
import EgcAssemblyvue from '@/components/EgcAssemblyvue.vue'
import EggCodevue from '@/components/EggCodevue.vue'
import { EGC_INPUT_IDS, EGC_SET_VARIABLE_ID } from '@/types/constant';



const props = defineProps({
  eggcode: {
    type: EggCode,
    required: true,
  },
})

// 鼠标悬浮状态
const isHovered = ref(false)
const isInvalid = ref(false)

const validator = computed(() => getValidator(props.eggcode))

watch(() => props.eggcode.comment, (newVal) => {
  if (isInput(props.eggcode) && newVal != null && validator.value) {
    isInvalid.value = !validator.value(newVal)
  }
})

function handleMouseEnter() {
  isHovered.value = true
  }

function handleMouseLeave() {
  isHovered.value = false
}

function getchildeggcode(index: number): EggCode | null {
  const child = props.eggcode.children[index]
  return child instanceof EggCode ? child : null
}

function getVacancy(index: number): EgcVacancy | null {
  const child = props.eggcode.children[index]
  return child instanceof EgcVacancy ? child : null
}

const focused = computed(() => globalStore.focus === props.eggcode)

function addVacancy(index: number): EgcVacancy {
  let newv=reactive(new EgcVacancy(props.eggcode,index,true,props.eggcode.prefab.param_types[index]))
  if (props.eggcode.prefab.id==EGC_SET_VARIABLE_ID && index==0) {
    newv.forVarOnly = true
  }
  props.eggcode.children.push(newv)
  return newv
}
function handleClick(eggcode: EggCode) {
    if (focused.value) {
        globalStore.focus = null
        return
    }
    globalStore.focus = eggcode
}
function isControll(item: EggCode) {
  return item instanceof EggCodeControl
}
function isInput(item: EggCode) {
  // 确保id是数字类型进行比较
  const itemId = Number(item.prefab.id)
  return EGC_INPUT_IDS.includes(itemId)
}

function getValidator(item: EggCode): ((val: string) => boolean) | null {
  if (item.prefab.return_type?.type === 'String') {
    return () => true
  }
  if (item.prefab.return_type?.type === 'Integer') {
    return (val: string) => val === '' || /^-?\d+$/.test(val)
  }
  if (item.prefab.return_type?.type === 'Fixed') {
    return (val: string) => val === '' || !isNaN(parseFloat(val))
  }
  return null
}







</script>

<style scoped lang="scss">
@use '@/styles/egcTypes.scss';
@use '@/styles/variables.scss';

.eggcodei {
  width:fit-content;
  position: relative;
}
.focused {
  border: 2.5px solid rgb(255, 230, 0);
}

.egc-content {
  display: flex;
  flex-direction: row;
  gap: 5px;
  width: fit-content;
  align-items: center;
}

.egc-content-ctrl{
  margin-left: 12px;
  margin-bottom: 4px;
}

.egc-param{
  display: flex;
  justify-content: center; align-items: center;
}
.egc-part{
  display: flex;
  justify-content: center; align-items: center;;
}
.egc-text{
  display: flex;
  justify-content: center; align-items: center;
  line-height: 2;
}

.control-area{
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: left;
  background-color: variables.$background;
  border-radius: 8px;
  margin-right: -20px;
  padding-right: 12px;
  min-width: 200px;
  // position: relative;
  // z-index: 9;
}

.comment-box {
  padding: 2px 3px;
  background-color: rgba(255, 255, 255, 0.95);
  border: 1.2px solid rgb(0, 0, 0);
  border-radius: 6px;
  white-space: nowrap;
  overflow-x: auto;
  pointer-events: auto;
  color: #333;
  font-size: 15px;
  min-width: 250px;
  max-width: 300px;
  height: 24px;
}

.egc-input-field {
  padding: 2px 4px;
  background-color: #239b23;
  border: none;
  border-radius: 4px;
  color: #e2ebf3;
  font-size: 14px;
  font-weight: bold;
  width: 4rem;
  outline: none;
  pointer-events: auto;
  overflow-x: auto;
  white-space: nowrap;

  &:focus {
    border-color: #86b7fe;
    box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.25);
  }

  &.invalid {
    border: 2px solid #ff4444;
  }
}


@media screen and (max-height: 500px) and (orientation: landscape) {
  .eggcodei {
    min-height: 36px;
    padding-top: 3px;
    padding-bottom: 3px;
  }
  .egc-text {
    font-size: 16px;
  }
  .egc-content {
    gap: 2px;
  }
}


</style>
