import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { CollectionType } from "../enums/collections";
import { Collection } from "../types";

export function viewCollection(router: AppRouterInstance, collection: Collection) {
     router.push(
          collection.type === CollectionType.TAG
            ? `/dashboard/tags/tag/${collection.id}`
            : `/dashboard/clusters/cluster/${collection.id}`
        )
  }