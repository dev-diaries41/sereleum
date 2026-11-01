import { useState } from "react";
import { Cluster } from "@/app/types";
import { RadioDropDown } from "../../common/radio-dropdown";
import { UNLABELLED_CLUSTER } from "@/app/constants/clusters";

interface MergeClustersViewProps {
  selectedClusterIds: string[];
  totalClustersCount: number;
  selectedClusters: Cluster[];
  parentClusterId: string | null;
  setParentClusterId: (id: string | null) => void;
  handleMergeClustersClick: () => void;
  clearSelection: () => void;
  setIsSelecting: (val: boolean) => void;
  isChoosingParent: boolean;
  setIsChoosingParent: (val: boolean) => void;
  handleConfirmMerge: () => void;
}

export function MergeClustersView({
  selectedClusterIds,
  totalClustersCount,
  selectedClusters,
  parentClusterId,
  setParentClusterId,
  handleMergeClustersClick,
  clearSelection,
  setIsSelecting,
  isChoosingParent,
  setIsChoosingParent,
  handleConfirmMerge,
}: MergeClustersViewProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleButtonClick = () => {
    if (isChoosingParent) {
      handleConfirmMerge();
    } else {
      handleMergeClustersClick();
    }
  };

  const options = selectedClusters.map((c) => c.id);

  const labelFor = (id: string) => {
    const c = selectedClusters.find((s) => s.id === id);
    if (!c) return id;
    return c.label === UNLABELLED_CLUSTER
      ? c.id
      : `${c.label} — ${c?.prototype_size ?? 0} items`;
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="w-full flex items-center justify-between gap-4 p-3 bg-white rounded-md shadow-sm">
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium">Selected</div>
          <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold">
            {selectedClusterIds.length}
          </div>
          <div className="text-sm text-gray-500">of {totalClustersCount}</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={selectedClusterIds.length === 0 || (isChoosingParent && !parentClusterId)}
            onClick={handleButtonClick}
            className="px-4 py-2 rounded-md bg-rose-600 text-white text-sm disabled:opacity-60"
          >
            {isChoosingParent ? "Confirm merge" : "Merge clusters"}
          </button>
          <button
            onClick={() => {
              setIsSelecting(false);
              clearSelection();
              setIsChoosingParent(false);
              setParentClusterId(null);
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
              <div className="text-sm font-medium">Choose parent cluster</div>
              <div className="text-xs text-gray-500">
                The selected parent will remain; other selected clusters will be merged into it.
              </div>
            </div>
            <div className="text-sm text-gray-600">{selectedClusterIds.length} clusters selected</div>
          </div>

          <div className="mt-3 relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((d) => !d)}
              className="w-full text-left rounded border px-3 py-2 mt-2 bg-white"
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
            >
              {parentClusterId ? labelFor(parentClusterId) : "-- choose parent cluster --"}
            </button>

            <RadioDropDown
              options={options}
              value={(parentClusterId ?? "") as any}
              onSelect={(id) => {
                setParentClusterId(id as string);
                setDropdownOpen(false);
              }}
              labelFor={(id) => labelFor(id as string)}
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
