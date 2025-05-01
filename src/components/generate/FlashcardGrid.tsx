import type { FlashcardViewModel } from "@/types";
import { FlashcardProposalCard } from "./FlashcardProposalCard";
import { FlashcardInlineEditor } from "./FlashcardInlineEditor";

interface FlashcardGridProps {
  cards: FlashcardViewModel[];
  onEdit: (id: string) => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export function FlashcardGrid({ cards, onEdit, onAccept, onReject }: FlashcardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) =>
        card.status === "editing" ? (
          <FlashcardInlineEditor
            key={card.id}
            card={card}
            onSave={(updated) => {
              // TODO: Implement save logic
            }}
          />
        ) : (
          <FlashcardProposalCard
            key={card.id}
            card={card}
            onEdit={() => onEdit(card.id)}
            onAccept={() => onAccept(card.id)}
            onReject={() => onReject(card.id)}
          />
        )
      )}
    </div>
  );
}
