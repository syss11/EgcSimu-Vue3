import { getidforAssembly, getidforEggCode, getidforVacancy } from "@/utils/getid";
import type { EgcPrefab } from "./egcPrefab";
import type { EgcControlPrefab } from "./egcPrefab";
import type {  ValueType } from "./egcTypes";
import { EGC_SUBTRIGGER_ID } from "./constant";

export class EggCode {
    id: string;
    prefab: EgcPrefab;
    parent: EgcAssembly | EggCode;
    children: (EggCode|EgcVacancy)[];
    index: number;
    comment?: string;

    constructor(prefab: EgcPrefab, parent: EgcAssembly | EggCode, index: number) {
        this.id = getidforEggCode(this)();
        this.children = [];
        this.prefab = prefab;
        this.parent = parent;
        this.index = index;
        this.comment = undefined;
    }
}
export class EggCodeControl extends EggCode {
    sub_vacancies: EgcAssembly[];
    constructor(prefab: EgcControlPrefab, parent: EgcAssembly | EggCode, index: number) {
        super(prefab, parent, index);
        this.sub_vacancies = [];
        for (let i = 0; i < prefab.sub_vacancies_count; i++) {
            let issubtrigger = prefab.id==EGC_SUBTRIGGER_ID && i==0
            this.sub_vacancies.push(new EgcAssembly(this, undefined, issubtrigger,issubtrigger));
        }
    }
}


export class EgcAssembly {
    id: string;
    children: EggCode[];
    parent: HTMLElement | EggCode;
    groupid?: string;
    vacancy : EgcVacancy;
    eventneeded: boolean;
    eventonly: boolean;
    constructor(parent: HTMLElement | EggCodeControl, groupid?: string, eventneeded: boolean=true,eventonly:boolean=false) {
        this.id = getidforAssembly()();
        this.children = [];
        this.parent = parent;
        this.groupid = groupid;
        this.eventneeded = eventneeded;
        this.eventonly = eventonly;
        this.vacancy = new EgcVacancy(this, 0);
    }
}


export class EgcVacancy {
    id: string; 
    parent: EgcAssembly | EggCode;
    index: number;
    forValue: boolean;
    return_type_limit: ValueType[];
    forVarOnly: boolean = false;

    constructor(parent: EgcAssembly | EggCode, index: number, forValue: boolean=false, return_type_limit: ValueType[]=[],forVarOnly: boolean=false) {
        this.id = getidforVacancy()();
        this.parent = parent;
        this.index = index;
        this.forValue = forValue;
        this.return_type_limit = return_type_limit;
        this.forVarOnly = forVarOnly;
    }
}

export class EgcVariable {
    name: string;
    type: ValueType;
    domain: 'global' | 'local';

    constructor(name: string, type: ValueType, domain: 'global' | 'local') {
        this.name = name;
        this.type = type;
        this.domain = domain;
    }
}