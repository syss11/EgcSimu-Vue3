import { EgcVacancy, EggCode } from "./types/eggCode";
import { reactive } from "vue";

export const globalStore = reactive({
    focus: null as EgcVacancy | null | EggCode,
})

import { useEventBus } from '@/composables/useEventBus'
import type { Group } from "./utils/groups";
const { on , EventTypes } = useEventBus()

export type Variable = {
  id: number
  scope: Group
  name: string
  domain: 'global' | 'local'
  type: {
    type: string
    isArray: boolean
    isWeightPool: boolean
  }
}

const allVariables: Variable[] = []

export { allVariables }

on(EventTypes.ADD_VARIABLE_TO_SELECTOR, ({ variable }) => {
  allVariables.push(variable)
})

export function getAllVariables(): Variable[] {
  return allVariables
}

export function setAllVariables(variables: Variable[]): void {
  allVariables.length = 0
  allVariables.push(...variables)
}
