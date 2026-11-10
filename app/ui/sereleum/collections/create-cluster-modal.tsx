import { useEffect, useState } from "react";
import { TextInputModal } from "@/app/ui/modals/text-input-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";

interface CreateClusterProps {
  isVisible: boolean;
  onClose: () => void;
  onCreateCluster: (name: string, seed: string) => void;
}

export function CreateClusterModal({ isVisible, onClose, onCreateCluster }: CreateClusterProps) {
  const [name, setName] = useState("");
  const [seed, setSeed] = useState("");

  useEffect(() => {
    if (isVisible) {
      setName("");
      setSeed("");
    }
  }, [isVisible]);

  const handleCreateCluster = () => {
    if (!name.trim() || !seed.trim()) return;
    onCreateCluster(name.trim(), seed.trim());
  };

  return (
    <TextInputModal
      isOpen={isVisible}
      onClose={onClose}
      onConfirm={handleCreateCluster}
      title="Create cluster"
      value={name}
      onChange={setName}
      placeholder="Enter cluster name"
      disabled={!name.trim() || !seed.trim()}
      leadingIcon={<FontAwesomeIcon icon={faLayerGroup} className="text-indigo-600" />}
    >
      <div className="flex items-start gap-3 rounded-lg border border-gray-300 bg-white px-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
        <textarea
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          placeholder="Describe this cluster and the content it should contain"
          rows={3}
          className="w-full resize-none bg-transparent py-3 text-base text-gray-900 outline-none placeholder:text-gray-400"
        />
      </div>
    </TextInputModal>
  );
}