<template>
  <div class="selector">
    <div 
      v-if="showSearchBox"
      ref="searchBoxRef"
      class="search-box"
    >
      <input 
        v-model="searchKeyword"
        type="text"
        placeholder="搜索..."
        class="search-input"
      />
    </div>
    <div 
      v-for="(items, type) in groupedPrefabs" 
      :key="type"
      :ref="(el) => setSectionRef(type, el)"
      class="selector-section"
    >
      <h3 class="section-title">{{ getTypeLabel(type) }}</h3>
      <div 
        v-for="prefab in items" 
      :key="prefab.id" 
      :ref="(el) => setPrefabRef(String(prefab.id), el)"
      :class="['egcprefab', `egcprefab-${prefab.type}`, {'variable': prefab.category === 'variable'}]"
      :title="prefab.description"
      @click="handleClick(prefab)"
      >
        {{ prefab.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick} from 'vue'
import { 
  parseActionsToEgcPrefabs, 
  parseBooleansToEgcPrefabs, 
  parseEventsToEgcPrefabs, 
  parseControllersToEgcPrefabs, 
  parseValuesToEgcPrefabs 
} from '@/utils/transform'
import type { EgcType, ValueType } from '@/types/egcTypes'
import { useEventBus } from '@/composables/useEventBus'
import { globalStore, type Variable } from '@/store'
import { EgcAssembly, type EgcVacancy } from '@/types/eggCode'

interface EgcPrefab {
  type: EgcType
  name: string
  category:'prefab'|'enum'|'variable'
  id: number
  signature: any
  param_types: any
  description: string
  return_type: any
  variable?: Variable
}

const prefabs = ref<EgcPrefab[]>([])
const filteredPrefabs = ref<EgcPrefab[]>([])
const sectionRefs = ref<Record<string, HTMLElement>>({})
const prefabRefs = ref<Record<string, HTMLElement>>({})
const searchBoxRef = ref<HTMLElement | null>(null)
const showSearchBox = ref(false)
const searchKeyword = ref('')

function handleClick(prefab: EgcPrefab) {
  emit(EventTypes.SELECT_EGCPREFAB, {
    egcPrefab: prefab
  })
}   

const groupedPrefabs = computed(() => {
  const groups: Record<string, EgcPrefab[]> = {}
  searchFilteredPrefabs.value.forEach(prefab => {
    const groupKey = prefab.category === 'variable' ? 'variable' : prefab.type
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey]?.push(prefab)
  })
  return groups
})

const searchFilteredPrefabs = computed(() => {
  if (!searchKeyword.value.trim()) {
    return filteredPrefabs.value
  }
  
  const keyword = searchKeyword.value.toLowerCase().trim()
  return filteredPrefabs.value.filter(prefab => 
    prefab.name.toLowerCase().includes(keyword) ||
    prefab.description.toLowerCase().includes(keyword)
  )
})

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    action: '动作',
    event: '事件',
    controll: '控制',
    value: '取值',
    boolean: '布尔值',
    variable: '变量'
  }
  return labels[type] || type
}

function setSectionRef(type: string, el: any) {
  if (el) {
    sectionRefs.value[type] = el
  }
}

function setPrefabRef(id: string, el: any) {
  if (el) {
    prefabRefs.value[id] = el
  }
}

const { on, EventTypes, emit } = useEventBus()

on(EventTypes.TOGGLE_SEARCH, () => {
  showSearchBox.value = !showSearchBox.value
  if (!showSearchBox.value) {
    searchKeyword.value = ''
  }
  nextTick(() => {
    if (searchBoxRef.value) {
      searchBoxRef.value.scrollIntoView({ behavior:'instant', block: 'start' })
    }
  })
})

on(EventTypes.SCROLL_TO_TYPE, ({ type }) => {
  const section = sectionRefs.value[type]
  if (section) {
    section.scrollIntoView({ behavior:'instant', block: 'start' })
  }
})

on(EventTypes.ADD_VARIABLE_TO_SELECTOR, ({ variable }) => {
  const newPrefab: EgcPrefab = {
    type: 'value',
    name: variable.name,
    category:'variable',
    id: variable.id,
    signature: [{
      type: 'text',
      text: variable.name
    }],
    param_types: {},
    description: `${variable.domain === 'global' ? '全局' : '局部'}变量`,
    return_type: {
      type: variable.type.type,
      isArray: variable.type.isArray,
      isWeightPool: variable.type.isWeightPool
    },
    variable: variable
  }
  
  prefabs.value.push(newPrefab)
  filteredPrefabs.value = [...prefabs.value]
  registerPrefab(newPrefab)
})



watch(() => globalStore.focus,(newFocus) => {
  if (newFocus) {
    emit(EventTypes.SET_SELECTOR_VISIBLE, { visible: true })
    filterPrefabs(newFocus as EgcVacancy)
  } else {
    filteredPrefabs.value = [...prefabs.value]
  }
}, { deep: true })

function filterPrefabs(vacancy: EgcVacancy) {
  if (!vacancy || Object.keys(vacancy).length === 0) {
    filteredPrefabs.value = [...prefabs.value]
    return
  }

  filteredPrefabs.value = prefabs.value.filter(prefab => {
    if (vacancy.parent instanceof EgcAssembly) {
      if ((vacancy.parent.eventneeded) == (prefab.type !== 'event')) {
        return false
      }
    }

    if (getActiveGroup() != prefab.variable?.scope && prefab.variable?.domain === 'local') {
      return false
    }

    if (vacancy.forVarOnly) {
      return prefab.category === 'variable'
    }
    
    
    if (vacancy.forValue) {
      if (prefab.type !== 'value' && prefab.type !== 'boolean') {
        return false
      }
    }else{
      if (prefab.type === 'value' || prefab.type === 'boolean') {
        return false
      }
    }

    if (vacancy.return_type_limit && vacancy.return_type_limit.length > 0) {
      if (!prefab.return_type) {
        return false
      }
      const matches = vacancy.return_type_limit.some((limit: ValueType) => {
        if (limit.type === 'all') {
          return prefab.return_type.type === 'all' || prefab.return_type.isArray === limit.isArray
        }
        return limit.type === prefab.return_type.type && 
               limit.isArray === prefab.return_type.isArray && 
               limit.isWeightPool === prefab.return_type.isWeightPool
      })
      if (!matches) {
        return false
      }
    }

    return true
  })
}





import { parseReturnTypeFromName } from '@/utils/transform'
import { getidforVariable } from '@/utils/getid'
import { registerPrefab } from '@/utils/prefabIdMap'
import { EGC_BOOL_ENUM_IDS } from '@/types/constant'
import { getActiveGroup, type Group } from '@/utils/groups'

async function loadDataFiles() {
  const dataFiles = [
    { path: '/data/EnumValues.json', type: 'enum' as EgcType, parser: (data:any) => {
      const prefabs: any[] = [];
      if (data.EnumValues) {
        data.EnumValues.forEach((item: any) => {
          
          prefabs.push({
            type: (EGC_BOOL_ENUM_IDS.includes(Number(item.prefabid)) ? 'boolean' : 'value'),
            name: item.name,
            category:'enum',
            id: item.prefabid || item.name,
            signature: [{
              type:'text',text:item.name
            }],
            param_types: {},
            description: `${item.name}`,
            return_type: parseReturnTypeFromName(item.return_type)
          });
        });
      }
      return prefabs;
    } },
    { path: '/data/Events.json', type: 'event' as EgcType, parser: parseEventsToEgcPrefabs },
    { path: '/data/Controllers.json', type: 'controll' as EgcType, parser: parseControllersToEgcPrefabs },
    { path: '/data/Actions.json', type: 'action' as EgcType, parser: parseActionsToEgcPrefabs },
    { path: '/data/Booleans.json', type: 'boolean' as EgcType, parser: parseBooleansToEgcPrefabs },
    { path: '/data/Values_with_types.json', type: 'value' as EgcType, parser: parseValuesToEgcPrefabs },
    
  ]

  for (const file of dataFiles) {
    try {
      const response = await fetch(file.path)
      const data = await response.json()
      const parsed = file.parser(data, file.type)
      prefabs.value.push(...parsed)
      parsed.forEach((prefab: EgcPrefab) => registerPrefab(prefab))
    } catch (error) {
      console.error(`Failed to load ${file.path}:`, error)
    }
  }
  
  filteredPrefabs.value = [...prefabs.value]
}

onMounted(() => {
  loadDataFiles()
})
</script>

<style scoped lang="scss">
@use '@/styles/egcTypes.scss';
@use '@/styles/variables.scss' as *;

.selector {
  padding: $spacing-md;
  background-color: $selector-color;
  border-radius: $border-radius-md;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.search-box {
  padding: $spacing-sm;
  margin-bottom: $spacing-md;
  background-color: $surface;
  border-radius: $border-radius-sm;
}

.search-input {
  width: 100%;
  padding: $spacing-sm;
  border: 1px solid $border-color;
  border-radius: $border-radius-sm;
  font-size: $font-size-sm;

  &:focus {
    outline: none;
    border-color: $primary;
  }
}

.selector-section {
  margin-bottom: $spacing-lg;
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  margin-bottom: $spacing-sm;
  color: $text-primary;
}

.egcprefab {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  user-select: none;
}

@media screen and (max-height: 500px) and (orientation: landscape) {
  .selector {
    padding: $spacing-sm;
  }

  .selector-section {
    margin-bottom: $spacing-md;
  }

  .egcprefab {
    height: 36px;
    line-height: 36px;
    font-size: small;
  }

}


</style>