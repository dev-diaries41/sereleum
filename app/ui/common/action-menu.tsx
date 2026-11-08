"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionConfig } from "@/app/types";


interface ActionsMenuProps {
  actions: ActionConfig[];
}

export function ActionsMenu({ actions }: ActionsMenuProps) {
  const visibleActions = actions.filter(
    action => !(action.hideIfDisabled && !action.enabled)
  );

  return (
    <div className="min-w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
      {visibleActions.map(action => (
        <button
          key={action.label}
          onClick={action.onClick}
          disabled={action.enabled === false}
          className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {action.icon && (
            <FontAwesomeIcon icon={action.icon} className="w-4" />
          )}
          {action.label}
        </button>
      ))}
    </div>
  );
}
