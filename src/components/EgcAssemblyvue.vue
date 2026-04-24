<template>
  <div :class="{'assembly':!isSimplied}"  >
    <div class="assembly-title" v-if="!isSimplied">
      {{ assembly.id }}
    </div>
    <div class="assembly-content" v-for="egc in assembly.children" :key="egc.id">
      <EggCodevue :eggcode="egc" />
    </div>
    <div class="vacancy" v-if="!noVacancy">
      <EgcVacancyvue :vacancy="assembly.vacancy" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { EgcAssembly, EggCodeControl } from '@/types/eggCode';
import EgcVacancyvue from '@/components/EgcVacancyvue.vue'
import EggCodevue from './EggCodevue.vue';
import { computed } from 'vue';

const props = defineProps({
  assembly: {
    type: EgcAssembly,
    required: true,
  },
})

const isSimplied=computed(()=> props.assembly.parent instanceof EggCodeControl)

const noVacancy=computed(()=> props.assembly.eventonly && props.assembly.children.length >= 1)

</script>

<style scoped lang="scss">
.assembly {
  padding: 8px;
}
.assembly-title {
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  margin-bottom: $spacing-sm;
  color: $text-primary;
}

@media screen and (max-height: 500px) and (orientation: landscape) {
  .assembly {
    padding: 4px;
  }
  .assembly-title {
    font-size: 16px;
  }
}
</style>
