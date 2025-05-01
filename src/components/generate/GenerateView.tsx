import { useState, useEffect } from "react";
import { useNavigate } from "@/lib/hooks/useNavigate";
import { useGenerateFlashcards } from "@/lib/hooks/useGenerateFlashcards";
import type { FlashcardViewModel, GenerateFormData } from "@/types";
import { GenerateForm } from "./GenerateForm";
import { ActionButtons } from "./ActionButtons";
import { FlashcardGrid } from "./FlashcardGrid";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";

export function GenerateView() {
  const [flashcards, setFlashcards] = useState<FlashcardViewModel[]>([]);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const navigate = useNavigate();

  const { generate, isLoading } = useGenerateFlashcards({
    onError: (error) => {
      toast.error("Error", {
        description: error.message || "Failed to generate flashcards. Please try again.",
      });
    },
  });

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [unsavedChanges]);

  const handleGenerate = async (data: GenerateFormData) => {
    try {
      const proposals = await generate(data);
      const newFlashcards: FlashcardViewModel[] = proposals.map((proposal) => ({
        ...proposal,
        id: uuidv4(),
        status: "pending",
      }));
      setFlashcards(newFlashcards);
      setUnsavedChanges(true);
    } catch {
      // Error already handled by the hook
    }
  };

  const handleEdit = (id: string) => {
    setFlashcards((cards) => cards.map((card) => (card.id === id ? { ...card, status: "editing" } : card)));
    setUnsavedChanges(true);
  };

  const handleAccept = (id: string) => {
    setFlashcards((cards) => cards.map((card) => (card.id === id ? { ...card, status: "accepted" } : card)));
    setUnsavedChanges(true);
  };

  const handleAcceptAll = () => {
    setFlashcards((cards) => cards.map((card) => ({ ...card, status: "accepted" })));
    setUnsavedChanges(true);
  };

  const handleRegenerateMissing = async () => {
    const acceptedCards = flashcards.filter((card) => card.status === "accepted");
    if (acceptedCards.length === 0) {
      toast.error("Error", {
        description: "No accepted flashcards found. Accept some flashcards before regenerating.",
      });
      return;
    }

    try {
      const proposals = await generate({
        text: "", // We need the original text here
        count: flashcards.length - acceptedCards.length,
        existingFlashcards: acceptedCards,
      });

      const newFlashcards = proposals.map((proposal) => ({
        ...proposal,
        id: uuidv4(),
        status: "pending" as const,
      }));

      setFlashcards([...acceptedCards, ...newFlashcards]);
      setUnsavedChanges(true);
    } catch {
      // Error already handled by the hook
    }
  };

  const handleNavigate = (to: string) => {
    if (unsavedChanges) {
      setPendingNavigation(to);
      setShowConfirmModal(true);
    } else {
      navigate(to);
    }
  };

  const handleConfirmNavigation = () => {
    setShowConfirmModal(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
  };

  return (
    <div className="space-y-8">
      <GenerateForm onGenerate={handleGenerate} />

      {flashcards.length > 0 && (
        <>
          <ActionButtons
            onRegenerateMissing={handleRegenerateMissing}
            onAcceptAll={handleAcceptAll}
            onSaveCollection={async () => handleNavigate("/collections")}
            disabled={isLoading || flashcards.length === 0}
          />

          <FlashcardGrid cards={flashcards} onEdit={handleEdit} onAccept={handleAccept} onReject={handleEdit} />
        </>
      )}

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>You have unsaved changes. Are you sure you want to leave?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleConfirmNavigation}>
              Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
