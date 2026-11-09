import { Collection } from "@/app/types";
import { CollectionType } from "@/app/enums/collections";
import { faTag, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function CollectionRow({
  collection,
  isSelecting = false,
  selected,
  onClick,
}: {
  collection: Collection;
  isSelecting?: boolean;
  selected?: boolean;
  onClick: () => void;
}) {
  const isTag = collection.type === CollectionType.TAG;

  return (
    <div onClick={onClick} className="block w-full h-full cursor-pointer">
      <div className="flex items-center justify-between gap-3 p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors w-full h-full">
        <div className="flex items-center gap-3 min-w-0 w-full">
          {isSelecting && (
            <div
              className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 ${
                selected
                  ? "bg-indigo-600 border-indigo-600"
                  : "bg-white border-gray-300"
              }`}
              title={selected ? "Deselect" : "Select"}
            >
              <span className={`w-2 h-2 rounded-full ${selected ? "bg-white" : "hidden"}`} />
            </div>
          )}

          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isTag
                ? "bg-indigo-100 text-indigo-600"
                : "bg-violet-100 text-violet-600"
            }`}
          >
            <FontAwesomeIcon
              icon={isTag ? faTag : faLayerGroup}
              className="w-5 h-5"
            />
          </div>

          <div className="flex flex-col gap-1 min-w-0 w-full">
            <div className="text-sm font-semibold truncate" title={collection.name}>
              {collection.name}
            </div>
            <div className="text-xs text-gray-500">
              {collection.size} items
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}