import { Collection } from "@/app/types";
import { CollectionType } from "@/app/enums/collections";
import { faCheck, faTag, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent } from "react";

interface CollectionNameFormProps {
  collection: Collection;
  nameDraft: string;
  enabled: boolean;
  onLabelDraftChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSaveLabel: () => Promise<void>;
}

export function CollectionNameForm({
  collection,
  nameDraft,
  enabled,
  onSaveLabel,
  onLabelDraftChange,
}: CollectionNameFormProps) {
  const isCluster = collection.type === CollectionType.CLUSTER;
  const label = isCluster ? "Cluster" : "Tag";
  const icon = isCluster ? faLayerGroup : faTag;

  return (
    <div className="relative lg:col-span-2 border border-gray-300 rounded-2xl shadow-sm p-6 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Manage {label.toLowerCase()} name</h3>
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            {label} name
          </label>
          <div className="flex gap-2">
            <input
              value={nameDraft}
              onChange={onLabelDraftChange}
              placeholder={`Enter ${label.toLowerCase()} name`}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-200 outline-none"
            />
            <button
              onClick={onSaveLabel}
              disabled={enabled || nameDraft.trim() === collection.name.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white text-sm disabled:opacity-60"
            >
              <FontAwesomeIcon icon={faCheck} />
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 text-xs text-gray-400">
        Use this form to clearly identify your {label.toLowerCase()}.
      </div>

      <div className="absolute bottom-4 right-4 opacity-50 text-3xl pointer-events-none">
        <FontAwesomeIcon icon={icon} />
      </div>
    </div>
  );
}