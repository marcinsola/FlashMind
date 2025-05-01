import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { GenerateFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const generateFormSchema = z.object({
  text: z
    .string()
    .min(1000, "Text must be at least 1000 characters")
    .max(10000, "Text must not exceed 10000 characters"),
  count: z
    .number()
    .int()
    .min(1, "Must generate at least 1 flashcard")
    .max(200, "Cannot generate more than 200 flashcards"),
});

interface GenerateFormProps {
  onGenerate: (data: GenerateFormData) => Promise<void>;
}

export function GenerateForm({ onGenerate }: GenerateFormProps) {
  const form = useForm<GenerateFormData>({
    resolver: zodResolver(generateFormSchema),
    defaultValues: {
      text: "",
      count: 10,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: GenerateFormData) => {
    await onGenerate(data);
    // Don't reset the form here - user might want to regenerate with the same text
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source Text</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your text here (1,000 - 10,000 characters)"
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Flashcards</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={200}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Generating..." : "Generate Flashcards"}
        </Button>
      </form>
    </Form>
  );
}
