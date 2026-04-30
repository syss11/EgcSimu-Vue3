import { EggCode, EggCodeControl, EgcAssembly, EgcVacancy } from "./types/eggCode";
import type {  EgcControlPrefab } from "./types/egcPrefab";
import type { ValueType } from "./types/egcTypes";
import { getAllGroups, setAllGroups, type Group, projectmeta } from "./utils/groups";
import { getPrefabById } from "./utils/prefabIdMap";
import { EGC_SUBTRIGGER_ID } from "./types/constant";
import { useEventBus } from "./composables/useEventBus";
import { getAllVariables, type Variable } from "./store";

export type SerializableType = 'vacancy' | 'eggCode' | 'eggCodeControl' | 'assembly' | 'group';

export interface SerializableVacancy {
    type: 'vacancy';
    id: string;
    index: number;
    forValue: boolean;
    return_type_limit: ValueType[];
    forVarOnly: boolean;
}

export interface SerializableEggCode {
    type: 'eggCode' | 'eggCodeControl';
    id: string;
    prefabId: number;
    index: number;
    comment?: string;
    children: (SerializableVacancy | SerializableEggCode)[];
    sub_vacancies?: SerializableAssembly[];
}

export interface SerializableAssembly {
    type: 'assembly';
    id: string;
    groupid?: string;
    eventneeded: boolean;
    eventonly: boolean;
    children: SerializableEggCode[];
}

export interface SerializableGroup {
    type: 'group';
    id: string;
    name: string;
    assemblies: SerializableAssembly[];
}

export interface SerializableVariable {
    id: number;
    name: string;
    domain: 'global' | 'local';
    type: {
        type: string;
        isArray: boolean;
        isWeightPool: boolean;
    };
    groupId?: string;
}

export interface SerializableSaveData {
    version: number;
    projectmeta: {
        name: string;
    };
    groups: SerializableGroup[];
    variables: SerializableVariable[];
}

function vacancyToSerializable(vacancy: EgcVacancy): SerializableVacancy {
    return {
        type: 'vacancy',
        id: vacancy.id,
        index: vacancy.index,
        forValue: vacancy.forValue,
        return_type_limit: vacancy.return_type_limit,
        forVarOnly: vacancy.forVarOnly,
    };
}

function eggCodeToSerializable(eggCode: EggCode): SerializableEggCode {
    const serializable: SerializableEggCode = {
        type: eggCode instanceof EggCodeControl ? 'eggCodeControl' : 'eggCode',
        id: eggCode.id,
        prefabId: eggCode.prefab.id,
        index: eggCode.index,
        comment: eggCode.comment,
        children: eggCode.children.map(child => {
            if (child instanceof EgcVacancy) {
                return vacancyToSerializable(child);
            }
            return eggCodeToSerializable(child) as SerializableVacancy | SerializableEggCode;
        }),
    };

    if (eggCode instanceof EggCodeControl) {
        serializable.sub_vacancies = eggCode.sub_vacancies.map(assemblyToSerializable);
    }

    return serializable;
}

function assemblyToSerializable(assembly: EgcAssembly): SerializableAssembly {
    return {
        type: 'assembly',
        id: assembly.id,
        groupid: assembly.groupid,
        eventneeded: assembly.eventneeded,
        eventonly: assembly.eventonly,
        children: assembly.children.map(eggCodeToSerializable),
    };
}

function groupToSerializable(group: Group): SerializableGroup {
    return {
        type: 'group',
        id: group.id,
        name: group.name,
        assemblies: group.assemblies.map(assemblyToSerializable),
    };
}

function variableToSerializable(variable: Variable): SerializableVariable {
    return {
        id: variable.id,
        name: variable.name,
        domain: variable.domain,
        type: variable.type,
        groupId: variable.scope?.id,
    };
}

const { emit, EventTypes } = useEventBus()

function deserializeVariable(data: SerializableVariable): void {
    emit(EventTypes.ADD_VARIABLE_TO_SELECTOR, {
        variable: {
            id: data.id,
            scope: getAllGroups().find(g => g.id === data.groupId) as Group,
            name: data.name,
            domain: data.domain,
            type: data.type,
        }
    });
}

export function saveToJson(): string {
    const groups = getAllGroups();
    const variables = getAllVariables();
    const saveData: SerializableSaveData = {
        version: 1,
        projectmeta: projectmeta.value,
        groups: groups.map(groupToSerializable),
        variables: variables.map(variableToSerializable),
    };
    return JSON.stringify(saveData, null, 2);
}

export function downloadSaveFile(filename?: string): void {
    const jsonData = saveToJson();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `${projectmeta.value.name || 'egc'}-save.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function deserializeVacancy(data: SerializableVacancy, parent: EgcAssembly | EggCode): EgcVacancy {
    const vacancy = new EgcVacancy(parent, data.index, data.forValue, data.return_type_limit, data.forVarOnly);
    vacancy.id = data.id;
    return vacancy;
}

function deserializeEggCode(data: SerializableEggCode, parent: EgcAssembly | EggCode): EggCode | null {
    const prefab = getPrefabById(data.prefabId);
    if (!prefab) {
        console.error(`Prefab with id ${data.prefabId} not found`);
        return null;
    }

    let eggCode: EggCode;
    if (data.type === 'eggCodeControl' || (prefab as any).sub_vacancies_count !== undefined) {
        const controlPrefab = prefab as EgcControlPrefab;
        eggCode = new EggCodeControl(controlPrefab, parent, data.index);
        if (data.sub_vacancies) {
            (eggCode as EggCodeControl).sub_vacancies = [];
            for (const subData of data.sub_vacancies) {
                const subAssembly = deserializeAssembly(subData, eggCode as EggCodeControl);
                (eggCode as EggCodeControl).sub_vacancies.push(subAssembly);
            }
        } else {
            for (let i = 0; i < controlPrefab.sub_vacancies_count; i++) {
                let issubtrigger = controlPrefab.id === EGC_SUBTRIGGER_ID && i === 0;
                (eggCode as EggCodeControl).sub_vacancies.push(new EgcAssembly(eggCode as EggCodeControl, undefined, issubtrigger, issubtrigger));
            }
        }
    } else {
        eggCode = new EggCode(prefab, parent, data.index);
    }

    eggCode.id = data.id;
    eggCode.comment = data.comment;
    eggCode.children = [];

    for (const childData of data.children) {
        if (childData.type === 'vacancy') {
            const vacancy = deserializeVacancy(childData, eggCode);
            eggCode.children.push(vacancy);
        } else if (childData.type === 'eggCode' || childData.type === 'eggCodeControl') {
            const childEggCode = deserializeEggCode(childData, eggCode);
            if (childEggCode) {
                eggCode.children.push(childEggCode);
            }
        }
    }

    return eggCode;
}

function deserializeAssembly(data: SerializableAssembly, parent: EggCodeControl): EgcAssembly {
    const assembly = new EgcAssembly(parent, data.groupid, data.eventneeded, data.eventonly);
    assembly.id = data.id;
    assembly.children = [];

    for (const childData of data.children) {
        const eggCode = deserializeEggCode(childData, assembly);
        if (eggCode) {
            assembly.children.push(eggCode);
        }
    }

    return assembly;
}

function deserializeGroup(data: SerializableGroup): Group {
    const group: Group = {
        id: data.id,
        name: data.name,
        assemblies: []
    };

    for (const assemblyData of data.assemblies) {
        const assembly = new EgcAssembly(group as any, assemblyData.groupid, assemblyData.eventneeded, assemblyData.eventonly);
        assembly.id = assemblyData.id;
        assembly.children = [];

        for (const childData of assemblyData.children) {
            const eggCode = deserializeEggCode(childData, assembly);
            if (eggCode) {
                assembly.children.push(eggCode);
            }
        }

        group.assemblies.push(assembly);
    }

    return group;
}

export function loadFromJson(jsonString: string): boolean {
    try {
        const data = JSON.parse(jsonString) as SerializableSaveData;

        if (data.projectmeta) {
            projectmeta.value = data.projectmeta;
        }

        if (data.variables && Array.isArray(data.variables)) {
            data.variables.forEach(deserializeVariable);
        }

        if (!data.groups || !Array.isArray(data.groups)) {
            throw new Error('Invalid save data: missing groups');
        }

        const groups = data.groups.map(deserializeGroup);
        setAllGroups(groups);

        return true;
    } catch (error) {
        console.error('Failed to load save data:', error);
        return false;
    }
}

export function loadSaveFile(file: File): Promise<boolean> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            if (content) {
                const success = loadFromJson(content);
                resolve(success);
            } else {
                resolve(false);
            }
        };
        reader.onerror = () => {
            console.error('Failed to read file');
            resolve(false);
        };
        reader.readAsText(file);
    });
}




