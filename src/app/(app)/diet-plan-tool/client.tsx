"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateAyurvedicDietPlan } from "@/ai/flows/generate-ayurvedic-diet-plan";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, Printer, NotebookText } from "lucide-react";

const formSchema = z.object({
  patientData: z.string().min(20, {
    message: "Patient data must be at least 20 characters.",
  }),
});

export function DietPlanToolClient() {
  const [loading, setLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientData: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setDietPlan(null);
    setError(null);
    try {
      const result = await generateAyurvedicDietPlan(values);
      setDietPlan(result.dietPlan);
    } catch (e) {
      setError("Failed to generate diet plan. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="patientData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Data & Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Patient is a 35-year-old male, Pitta dosha with high Vata imbalance. Prefers vegetarian food, dislikes spicy meals. Works a desk job..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include dosha, imbalances, health parameters, and dietary preferences for best results.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles />
                    Generate AI Diet Plan
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="sticky top-24">
        <Card className="min-h-[400px]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline text-2xl text-primary">Generated Diet Plan</CardTitle>
             <Button variant="outline" size="icon" onClick={() => window.print()} disabled={!dietPlan}>
              <Printer className="h-4 w-4" />
              <span className="sr-only">Print</span>
            </Button>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Loader2 className="size-12 animate-spin text-primary" />
                <p className="mt-4">Our AI is crafting the perfect plan...</p>
              </div>
            )}
            {error && <p className="text-destructive">{error}</p>}
            {dietPlan && (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                 <div className="whitespace-pre-wrap font-body text-foreground">{dietPlan}</div>
              </div>
            )}
            {!loading && !dietPlan && !error && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <NotebookText className="size-12" />
                <p className="mt-4">Your generated diet plan will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
