import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface ActionButtonsProps {
  onRegenerateMissing: () => void;
  onAcceptAll: () => void;
  onSaveCollection: () => Promise<void>;
  disabled?: boolean;
}

export function ActionButtons({
  onRegenerateMissing,
  onAcceptAll,
  onSaveCollection,
  disabled = false,
}: ActionButtonsProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveCollection();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      <Button variant="outline" onClick={onRegenerateMissing} disabled={disabled}>
        Regenerate Missing
      </Button>

      <Button variant="outline" onClick={onAcceptAll} disabled={disabled}>
        Accept All
      </Button>

      <Button onClick={handleSave} disabled={disabled || isSaving}>
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Collection"
        )}
      </Button>
    </div>
  );
}
