import type { EgcPrefab } from '@/types/egcPrefab'

export const prefabIdMap = new Map<number, EgcPrefab>()

export function registerPrefab(prefab: EgcPrefab): void {
    prefabIdMap.set(prefab.id, prefab)
}

export function getPrefabById(id: number): EgcPrefab | undefined {
    return prefabIdMap.get(id)
}
