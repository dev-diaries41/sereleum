import { useCallback, useState } from "react";

export interface SelectionState<T> {
  selectedItems: Set<T>;
  excludedItems: Set<T>;
  selectAll: boolean;
  isSelecting: boolean;
  selectedCount: number;
}

const createDefaultState = <T,>(): SelectionState<T> => ({
  selectedItems: new Set(),
  excludedItems: new Set(),
  selectAll: false,
  isSelecting: false,
  selectedCount: 0,
});

export function useSelection<T>() {
  const [state, setState] = useState<SelectionState<T>>(createDefaultState);

  const clearSelection = useCallback(() => {
    setState((prev) => ({
      ...createDefaultState<T>(),
      isSelecting: prev.isSelecting,
    }));
  }, []);

  const resetSelection = useCallback(() => {
    setState(createDefaultState<T>());
  }, []);

  const toggleSelectedItem = useCallback((item: T, total: number) => {
    setState((prev) => {
      const items = new Set(prev.selectAll ? prev.excludedItems : prev.selectedItems);
      const wasPresent = items.has(item);

      if (wasPresent) items.delete(item);
      else items.add(item);

      const selectedCount = Math.max(
        0,
        Math.min(total, prev.selectedCount + (prev.selectAll ? (wasPresent ? 1 : -1) : (wasPresent ? -1 : 1)))
      );

      return {
        ...prev,
        ...(prev.selectAll ? { excludedItems: items } : { selectedItems: items }),
        selectedCount,
      };
    });
  }, []);

  const setSelectAll = useCallback((selectAll: boolean, total: number) => {
    setState((prev) => {
      const newSelectAll = prev.selectAll && prev.excludedItems.size > 0 ? true : selectAll;
      return {
        ...prev,
        selectAll: newSelectAll,
        selectedItems: new Set(),
        excludedItems: new Set(),
        selectedCount: newSelectAll ? total : 0,
      };
    });
  }, []);

  const toggleSelectionMode = useCallback(() => {
    setState((prev) => ({ ...prev, isSelecting: !prev.isSelecting }));
  }, []);

  const getSelectedItems = useCallback(async (getAllItems: () => Promise<Set<T>>) => {
    if (!state.selectAll) return state.selectedItems;

    const allItems = await getAllItems();
    state.excludedItems.forEach((item) => allItems.delete(item));
    return allItems;
  }, [state.selectAll, state.selectedItems, state.excludedItems]);


  const isItemSelected = (item: T) => state.selectedItems.has(item) || (state.selectAll && !state.excludedItems.has(item));
  

  return {
    ...state,
    setState,
    clearSelection,
    resetSelection,
    toggleSelectedItem,
    setSelectAll,
    toggleSelectionMode,
    getSelectedItems,
    isItemSelected
  };
}