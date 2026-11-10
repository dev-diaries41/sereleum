
import { useEffect, useState } from "react";
import { AutoCompleter } from "./auto-complete";
import { checkAutoCompletion } from "@/app/lib/helpers";
import { TextInputModal } from "@/app/ui/modals/text-input-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";

interface TagAdderProps {
  isVisible: boolean;
  onClose: () => void;
  onAddTag: (tag: string) => void;
  tags: string[];
}

export function TagAdder({ isVisible, onClose, onAddTag, tags }: TagAdderProps) {
  const [newTag, setNewTag] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [autoCompleteTagResults, setAutoCompleteTagResults] = useState<string[]>([]);

  useEffect(() => {
    if (!isVisible) return;
    const timeout = setTimeout(() => {
      setAutoCompleteTagResults(checkAutoCompletion(newTag, newTag.length, tags, false));
    }, 50);
    return () => clearTimeout(timeout);
  }, [newTag, isVisible, tags]);

  useEffect(() => {
    if (isVisible) {
      setNewTag("");
      setAutoCompleteTagResults([]);
    }
  }, [isVisible]);

  const handleChange = (value: string) => {
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      setNewTag(value);
    } else {
      window.alert("Character not allowed");
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    onAddTag(newTag);
  };

  return (
    <TextInputModal
      isOpen={isVisible}
      onClose={onClose}
      onConfirm={handleAddTag}
      title="Add tag"
      value={newTag}
      onChange={handleChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholder="Enter new tag"
      disabled={!newTag.trim()}
      leadingIcon={<FontAwesomeIcon icon={faTag} className="text-indigo-600" />}
    >
      <AutoCompleter
        isVisible={autoCompleteTagResults.length > 0 && isFocused}
        autoCompleteResults={autoCompleteTagResults}
        query={newTag}
        onSelect={setNewTag}
        label="Tags"
      />
    </TextInputModal>
  );
}
