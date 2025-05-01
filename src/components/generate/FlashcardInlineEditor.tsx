import { useState } from "react";
import type { FlashcardViewModel } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

interface FlashcardInlineEditorProps {
  card: FlashcardViewModel;
  onSave: (updated: { front: string; back: string }) => void;
}

export function FlashcardInlineEditor({ card, onSave }: FlashcardInlineEditorProps) {
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (front.length > 200 || back.length > 500) {
      setError(
        front.length > 200 ? "Question must not exceed 200 characters" : "Answer must not exceed 500 characters"
      );
      return;
    }

    setError(null);
    onSave({ front, back });
  };

  return (
    <Card className="flex flex-col">
      <CardContent className="space-y-4 pt-6">
        <div>
          <div className="font-medium mb-2">Question</div>
          <Textarea
            value={front}
            onChange={(e) => setFront(e.target.value)}
            placeholder="Enter question"
            className="resize-none"
            maxLength={200}
          />
          <div className="text-xs text-muted-foreground mt-1">{front.length}/200 characters</div>
        </div>

        <div>
          <div className="font-medium mb-2">Answer</div>
          <Textarea
            value={back}
            onChange={(e) => setBack(e.target.value)}
            placeholder="Enter answer"
            className="resize-none"
            maxLength={500}
          />
          <div className="text-xs text-muted-foreground mt-1">{back.length}/500 characters</div>
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}
      </CardContent>

      <CardFooter>
        <Button onClick={handleSave} className="w-full" variant="outline">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
