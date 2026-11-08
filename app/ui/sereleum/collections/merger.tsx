import { useState } from "react";
import { Collection, CollectionId } from "@/app/types";
import { CollectionType } from "@/app/enums/collections";
import { RadioDropDown } from "../../common/radio-dropdown";

interface MergeCollectionsViewProps<T extends CollectionType> {
  totalCollectionsCount: number;
  selectedCollections: Collection<T>[];
  parentCollectionId: CollectionId<T> | null;
  setParentCollectionId: (id: CollectionId<T> | null) => void;
  handleMergeCollectionsClick: () => void;
  clearSelection: () => void;
  setIsSelecting: (val: boolean) => void;
  isChoosingParent: boolean;
  setIsChoosingParent: (val: boolean) => void;
  handleConfirmMerge: () => void;
}

export function MergeCollectionsView<T extends CollectionType>({
  totalCollectionsCount,
  selectedCollections,
  parentCollectionId,
  setParentCollectionId,
  handleMergeCollectionsClick,
  clearSelection,
  setIsSelecting,
  isChoosingParent,
  setIsChoosingParent,
  handleConfirmMerge,
}: MergeCollectionsViewProps<T>) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

 const label = (() => {
  switch (selectedCollections[0]?.type) {
    case CollectionType.CLUSTER: return "cluster";
    case CollectionType.TAG: return "tag";
    default: return '';
  }
})();
  const pluralLabel = `${label}s`;

  const handleButtonClick = () => {
    if (isChoosingParent) handleConfirmMerge();
    else handleMergeCollectionsClick();
  };

  const options = selectedCollections.map((collection) => collection.id);

  const labelFor = (id: CollectionId<T>) => {
    const collection = selectedCollections.find((item) => item.id === id);
    return collection
      ? `${collection.name} — ${collection.size} items`
      : String(id);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="w-full flex items-center justify-between gap-4 p-3 bg-white rounded-md shadow-sm">
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium">Selected</div>
          <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold">
            {selectedCollections.length}
          </div>
          <div className="text-sm text-gray-500">
            of {totalCollectionsCount}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={selectedCollections.length === 0 || (isChoosingParent && parentCollectionId === null)}
            onClick={handleButtonClick}
            className="px-4 py-2 rounded-md bg-rose-600 text-white text-sm disabled:opacity-60"
          >
            {isChoosingParent ? "Confirm merge" : `Merge`}
          </button>
          <button
            onClick={() => {
              setIsSelecting(false);
              clearSelection();
              setIsChoosingParent(false);
              setParentCollectionId(null);
            }}
            className="px-3 py-2 rounded-md border text-sm"
          >
            Cancel
          </button>
          <button onClick={clearSelection} className="px-3 py-2 rounded-md border text-sm">
            Clear
          </button>
        </div>
      </div>

      {isChoosingParent && (
        <div className="w-full bg-white rounded-md shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Choose parent {label}</div>
              <div className="text-xs text-gray-500">
                The selected parent will remain; other selected {pluralLabel} will be merged into it.
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {selectedCollections.length} {pluralLabel} selected
            </div>
          </div>

          <div className="mt-3 relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((open) => !open)}
              className="w-full text-left rounded border px-3 py-2 mt-2 bg-white"
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
            >
              {parentCollectionId !== null
                ? labelFor(parentCollectionId)
                : `-- choose parent ${label} --`}
            </button>

            <RadioDropDown
              options={options}
              value={parentCollectionId ?? ("")}
              onSelect={(id) => {
                setParentCollectionId(id);
                setDropdownOpen(false);
              }}
              labelFor={(id) => labelFor(id)}
              open={dropdownOpen}
              onClose={() => setDropdownOpen(false)}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}