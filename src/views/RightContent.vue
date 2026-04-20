<template>
  <div class="right-content" :class="{ collapsed: !myVisible }">
    <div class="selector-wrapper" v-show="myVisible">
      <Selector />
    </div>
  </div>
</template>

<script setup lang="ts">
import Selector from '@/components/Selector.vue'
import { useEventBus } from '@/composables/useEventBus'
import { ref } from 'vue'
const { on , EventTypes } = useEventBus()


const myVisible = ref(true)
on(EventTypes.SET_SELECTOR_VISIBLE, ({ visible }) => {
  myVisible.value = visible
})

</script>

<style scoped lang="scss">
@use '@/styles/variables.scss';

.right-content {
  width: 100%;
  height: 100%;
  background-color: $surface;
  overflow: auto;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
}


.selector-wrapper {
  flex: 1;
  overflow: auto;
}
</style>
