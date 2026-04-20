import { EgcVacancy, EggCode } from "./types/eggCode";
import { reactive } from "vue";

export const globalStore = reactive({
    focus: null as EgcVacancy | null | EggCode,
})