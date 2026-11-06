

interface SelectionControlsProps {
  isSelecting: boolean;
  selectedCount: number;
  totalCount: number;
  onSelect: () => void;
  onSelectAllChange: (checked: boolean) => void;
  onClearSelection: () => void;
  onDone: () => void;
}

export function SelectionControls({
  isSelecting,
  selectedCount,
  totalCount,
  onSelect,
  onSelectAllChange,
  onClearSelection,
  onDone
}: SelectionControlsProps) {
  const allSelected = totalCount > 0 && selectedCount === totalCount;

  if (!isSelecting) {
    return (
      <div className="flex justify-end mb-4">
        <button onClick={onSelect} className="px-4 py-2 border rounded">
          Select
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
      <div className="flex items-center gap-4">
        <label className="flex flex-col items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={e => onSelectAllChange(e.target.checked)}
            className="h-5 w-5 accent-indigo-600 cursor-pointer"
          />
          <span className="text-sm text-indigo-600">All</span>
        </label>

        <span className="text-xl font-medium text-indigo-600">
          {selectedCount > 0 ? `${selectedCount} Selected` : "Select items"}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={onClearSelection} className="px-4 py-2 border rounded">
          Clear selection
        </button>
        <button onClick={onDone} className="px-4 py-2 border rounded">
          Done
        </button>
      </div>
    </div>
  );
}