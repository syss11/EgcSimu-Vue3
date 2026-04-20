import type { Signature, Element, BaseValueType, ValueType, ParamTypes, EgcType } from "../types/egcTypes";
import { bvtToChinese } from "../types/egcTypes";
import { EgcControlPrefab } from "../types/egcPrefab";

export function strToSignature(str: string): Signature {
    const elements: Element[] = [];
    let i = 0;
    
    while (i < str.length) {
        if (str[i] === '{' && i + 1 < str.length && str[i + 1] === '#') {
            const endIndex = str.indexOf('}', i);
            if (endIndex !== -1) {
                const indexStr = str.slice(i + 2, endIndex);
                const index = parseInt(indexStr, 10);
                if (!isNaN(index)) {
                    elements.push({
                        type: 'param',
                        index
                    });
                }
                i = endIndex + 1;
            } else {
                i++;
            }
        } else {
            const textStart = i;
            while (i < str.length && !(str[i] === '{' && i + 1 < str.length && str[i + 1] === '#')) {
                i++;
            }
            const text = str.slice(textStart, i);
            if (text) {
                elements.push({
                    type: 'text',
                    text
                });
            }
        }
    }
    
    return elements;
}

function chineseToBaseValueType(chinese: string): BaseValueType | null {
    for (const [key, value] of Object.entries(bvtToChinese)) {
        if (value === chinese) {
            return key as BaseValueType;
        }
    }
    return null;
}

export function parseReturnTypeFromName(name: string): ValueType | null {
    let cleanName = name;
    let isWeightPool = false;
    let isArray = false;
    
    if (name.endsWith('权重池')) {
        isWeightPool = true;
        cleanName = name.slice(0, -3);
    }
    
    if (cleanName.endsWith('列表') || cleanName.endsWith('数组')) {
        isArray = true;
        cleanName = cleanName.slice(0, -2);
    }

    if (cleanName.includes('复制列表') || cleanName.includes('复制数组')) {
        isArray = true;
        cleanName = cleanName.replace('复制列表', '').replace('复制数组', '');
    }
    
    for (let len = Math.min(cleanName.length, 10); len >= 1; len--) {
        const suffix = cleanName.slice(-len);
        const baseType = chineseToBaseValueType(suffix);
        if (baseType) {
            return {
                type: baseType,
                isArray,
                isWeightPool
            };
        }
    }
    
    return null;
}

function parseParameter(paramStr: string): ValueType[] {
    const result: ValueType[] = [];
    let cleanStr = paramStr.trim();
    
    if (cleanStr.startsWith('可选：')) {
        cleanStr = cleanStr.substring(3).trim();
    }
    
    const types = cleanStr.split(',').map(t => t.trim());
    
    for (const typeStr of types) {
        if (typeStr === 'all列表') {
            result.push({
                type: 'all',
                isArray: true,
                isWeightPool: false
            });
            continue;
        }
        
        const baseType = chineseToBaseValueType(typeStr);
        if (baseType) {
            result.push({
                type: baseType,
                isArray: typeStr.includes('列表') || typeStr.includes('数组'),
                isWeightPool:  typeStr.includes('权重池')
            });
        }
    }
    
    return result;
}

export interface ActionData {
    name: string;
    id: string;
    prefabid?: number;
    description: string;
    parameters: string[];
    explanation: string;
}

export interface ActionDocument {
    document: {
        actions: ActionData[];
    };
}

export interface BooleanData {
    name: string;
    id: string;
    prefabid?: number;
    description: string;
    parameters: string[];
    explanation: string;
}

export interface BooleanDocument {
    document: {
        booleans: BooleanData[];
    };
}

export interface EventData {
    name: string;
    id: string;
    prefabid?: number;
    description: string;
    parameters: string[];
    explanation: string;
}

export interface EventDocument {
    document: {
        events: EventData[];
    };
}

export interface ControllerData {
    name: string;
    id: string;
    prefabid: number;
    description: string;
    parameters: string[];
    sub_vacancies_count?: number;
    explanation: string;
}

export interface ControllerDocument {
    document: {
        controllers: ControllerData[];
    };
}

export interface ValueData {
    name: string;
    id: string;
    
    description: string;
    parameters: string[];
    explanation: string;
    prefabid?: number;
    returnType?: ValueType;
}

export interface ValueDocument {
    document: {
        values: ValueData[];
    };
}

export function parseActionsToEgcPrefabs(data: ActionDocument, type: EgcType) {
    const prefabs: any[] = [];
    
    for (const action of data.document.actions) {
        const paramTypes: ParamTypes = {};
        
        action.parameters.forEach((paramStr, index) => {
            const parsedTypes = parseParameter(paramStr);
            if (parsedTypes.length > 0) {
                paramTypes[index] = parsedTypes;
            }
        });
        
        prefabs.push({
            type,
            category:'prefab',
            name: action.name,
            id:action.prefabid,
            signature: strToSignature(action.description),
            param_types: paramTypes,
            description: action.explanation,
            return_type: null
        });
    }
    
    return prefabs;
}

export function parseBooleansToEgcPrefabs(data: BooleanDocument, type: EgcType) {
    const prefabs: any[] = [];
    
    for (const item of data.document.booleans) {
        const paramTypes: ParamTypes = {};
        
        item.parameters.forEach((paramStr, index) => {
            const parsedTypes = parseParameter(paramStr);
            if (parsedTypes.length > 0) {
                paramTypes[index] = parsedTypes;
            }
        });
        
        prefabs.push({
            type,
            category:'prefab',
            name: item.name,
            id:item.prefabid,
            signature: strToSignature(item.description),
            param_types: paramTypes,
            description: item.explanation,
            return_type: {
                type: 'Boolean',
                isArray: false,
                isWeightPool: false
            }
        });
    }
    
    return prefabs;
}

export function parseEventsToEgcPrefabs(data: EventDocument, type: EgcType) {
    const prefabs: any[] = [];
    
    for (const item of data.document.events) {
        const paramTypes: ParamTypes = {};
        
        item.parameters.forEach((paramStr, index) => {
            const parsedTypes = parseParameter(paramStr);
            if (parsedTypes.length > 0) {
                paramTypes[index] = parsedTypes;
            }
        });
        
        prefabs.push({
            type,
            category:'prefab',
            name: item.name,
            id:item.prefabid,
            signature: strToSignature(item.description),
            param_types: paramTypes,
            description: item.explanation,
            return_type: null
        });
    }
    
    return prefabs;
}

export function parseControllersToEgcPrefabs(data: ControllerDocument, type: EgcType) {
    const prefabs: EgcControlPrefab[] = [];
    
    for (const item of data.document.controllers) {
        const paramTypes: ParamTypes = {};
        
        item.parameters.forEach((paramStr, index) => {
            const parsedTypes = parseParameter(paramStr);
            if (parsedTypes.length > 0) {
                paramTypes[index] = parsedTypes;
            }
        });
        
        prefabs.push(new EgcControlPrefab(
            type,
            item.name,
            item.prefabid,
            item.description,
            paramTypes,
            item.explanation,
            null,
            item.sub_vacancies_count || 0
        ));
    }
    
    return prefabs;
}

export function parseValuesToEgcPrefabs(data: ValueDocument, type: EgcType) {
    const prefabs: any[] = [];
    
    for (const item of data.document.values) {
        const paramTypes: ParamTypes = {};
        
        item.parameters.forEach((paramStr, index) => {
            const parsedTypes = parseParameter(paramStr);
            if (parsedTypes.length > 0) {
                paramTypes[index] = parsedTypes;
            }
        });
        
        let returnType: ValueType | null = null;
        if (item.returnType) {
            returnType = {
                type: item.returnType.type,
                isArray: item.returnType.isArray,
                isWeightPool: item.returnType.isWeightPool
            };
        }
        
        prefabs.push({
            type,
            category:'prefab',
            name: item.name,
            id:item.prefabid,
            signature: strToSignature(item.description),
            param_types: paramTypes,
            description: item.explanation,
            return_type: returnType
        });
    }
    
    return prefabs;
}