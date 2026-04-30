import { strToSignature } from "@/utils/transform";
import type { EgcType, ParamTypes, Signature, ValueType } from "./egcTypes"
import type { Variable } from "@/store";



export class EgcPrefab {
    type: EgcType;
    category: 'prefab' | 'enum' | 'variable';
    name: string;
    id: number;
    signature: Signature;
    param_types: ParamTypes;
    description: string;
    return_type: ValueType | null;
    variable?: Variable;

    constructor(type: EgcType, name: string,
        category:'prefab'|'enum'|'variable', id: number,
         signature: string, param_types: ParamTypes, description: string,
          return_type: ValueType | null, variable?: Variable) {

        this.type = type;
        this.category = category;
        this.name = name;
        this.id = id;
        this.signature = strToSignature(signature);
        this.param_types = param_types;
        this.description = description;
        this.return_type = return_type;
        this.variable = variable;
    }
}

export class EgcControlPrefab extends EgcPrefab {
    sub_vacancies_count: number;

    constructor(type: EgcType, name: string, id: number, signature: string, param_types: ParamTypes, description: string, return_type: ValueType | null, sub_vacancies_count: number) {
        super(type, name, 'prefab' ,id, signature, param_types, description, return_type);
        this.sub_vacancies_count = sub_vacancies_count;
    }
}
