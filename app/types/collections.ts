import { CollectionType } from "../enums/collections"

export type CollectionId = string | number

export interface Collection {
    id: CollectionId
    name: string
    size: number
    type: CollectionType
}