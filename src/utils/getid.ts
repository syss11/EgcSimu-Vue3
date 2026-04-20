import type { EggCode } from "@/types/eggCode";

const inittime:number = Date.now();


let assemblyCount = 0;
let eggCodeCount = inittime;
let variableCount = inittime;
let vacancyCount = inittime;
let groupCount = 0;


export function getidforAssembly(){
    return () => {
        assemblyCount++;
        return '新触发器_'+String(assemblyCount);
    }
}

export function getidforEggCode(_egc?: EggCode){
    return () => {
        eggCodeCount++;
        return '新蛋码_'+String(eggCodeCount);
    }
}

export function getidforVacancy(){
    return () => {
        vacancyCount++;
        return 'v_'+String(vacancyCount);
    }
}

export function getidforVariable(){
    return () => {
        variableCount++;
        return variableCount
    }
}

export function getidforGroup(){
    return () => {
        groupCount++;
        return 'g_'+String(groupCount);
    }
}