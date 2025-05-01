import type { FlashcardViewModel } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check, Pencil, X } from "lucide-react";

interface FlashcardProposalCardProps {
  card: FlashcardViewModel;
  onEdit: () => void;
  onAccept: () => void;
  onReject: () => void;
}

export function FlashcardProposalCard({ card, onEdit, onAccept, onReject }: FlashcardProposalCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-none">
        <div className="font-medium">Question</div>
        <div className="mt-2">{card.front}</div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="font-medium">Answer</div>
        <div className="mt-2">{card.back}</div>
      </CardContent>
      <CardFooter className="flex-none space-x-2">
        <Button variant="outline" size="icon" onClick={onEdit} title="Edit">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onAccept}
          className="text-green-600 hover:text-green-700"
          title="Accept"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onReject}
          className="text-red-600 hover:text-red-700"
          title="Reject"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
