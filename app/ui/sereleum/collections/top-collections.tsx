import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CollectionRow } from "../clusters/collection-row";
import { faLayerGroup, faTags } from "@fortawesome/free-solid-svg-icons";
import { CollectionType } from "@/app/enums/collections";
import { Collection } from "@/app/types";

interface TopCollectionsContainerProps {
  topN?: number;
  type: CollectionType;
  topCollections: Collection[];
  isViewAllVisible: boolean;
  onViewAllCollections: () => void;
}

export function TopCollectionsContainer({
  topN = 6,
  type,
  topCollections,
  isViewAllVisible,
  onViewAllCollections,
}: TopCollectionsContainerProps) {
  const isCluster = type === CollectionType.CLUSTER;
  const label = isCluster ? "Clusters" : "Tags";
  const sortedCollections = [...topCollections].sort((a, b) => b.size - a.size);

  return (
    <div className="lg:col-span-3 border border-gray-300 rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm text-gray-500 font-semibold">
          Top {topN} {label}
        </h3>

        <div className="flex items-center gap-4">
          {isViewAllVisible && (
            <button
              className="text-sm text-indigo-600 hover:underline"
              onClick={onViewAllCollections}
            >
              View all {label.toLowerCase()}
            </button>
          )}
          <FontAwesomeIcon
            icon={isCluster ? faLayerGroup : faTags}
            className="w-6 h-6 opacity-50"
          />
        </div>
      </div>

      {sortedCollections.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-400">
              No {label.toLowerCase()} yet
            </p>
            <p className="text-xs text-gray-400 mt-1">
            {isCluster
                ? "Clusters will appear once items are clustered"
                : "Tags will appear once items are tagged"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {sortedCollections.slice(0, topN).map((collection) => (
            <div key={`${collection.type}-${collection.id}`} className="w-full">
              <CollectionRow collection={collection} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
