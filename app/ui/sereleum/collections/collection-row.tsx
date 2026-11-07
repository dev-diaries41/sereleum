import { CollectionType } from "@/app/enums/collections";
import { Collection } from "@/app/types";
import { useRouter } from "next/navigation";

export function CollectionRow({
  collection,
  isSelecting = false,
  selected,
  toggleSelection,
}: {
  collection: Collection;
  isSelecting?: boolean;
  selected?: boolean;
  toggleSelection?: () => void;
}) {
  const router = useRouter();
  const title = collection.name;

  return (
    <div
      onClick={() => {
        if (isSelecting) toggleSelection?.();
        else router.push(
          collection.type === CollectionType.TAG
            ? `/dashboard/tags/tag/${collection.id}`
            : `/dashboard/clusters/cluster/${collection.id}`
        );
      }}
      className="block w-full h-full cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 w-full h-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 min-w-0 w-full">
          {isSelecting && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSelection?.();
              }}
              aria-pressed={selected}
              className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                selected
                  ? "bg-indigo-600 border-indigo-600"
                  : "bg-white border-gray-300"
              }`}
              title={selected ? "Deselect" : "Select"}
            >
              <span className={`w-2 h-2 rounded-full ${selected ? "bg-white" : "hidden"}`} />
            </button>
          )}

          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-medium flex-shrink-0">
            {title.charAt(0).toUpperCase()}
          </div>

          <div className="flex flex-col gap-1 min-w-0 w-full">
            <div className="text-sm font-medium truncate" title={title}>
              {title}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {collection.id}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {collection.size} items
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}