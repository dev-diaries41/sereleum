import { CollectionType } from "../enums/collections"

export type CollectionId<T extends CollectionType = CollectionType> =
    T extends CollectionType.CLUSTER ? string :
    T extends CollectionType.TAG ? number :
    string | number;

export interface Collection<T extends CollectionType = CollectionType> {
    id: CollectionId<T>
    name: string
    size: number
    type: T
}
