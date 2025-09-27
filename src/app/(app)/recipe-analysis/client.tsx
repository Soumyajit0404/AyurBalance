
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzeRecipeAyurvedicProperties, AnalyzeRecipeAyurvedicPropertiesOutput } from "@/ai/flows/analyze-recipe-ayurvedic-properties";
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, Sparkles, Pipette } from "lucide-react";

const formSchema = z.object({
  recipeName: z.string().min(3, "Recipe name is too short."),
  ingredients: z.string().min(10, "Ingredients list is too short."),
  instructions: z.string().min(10, "Instructions are too short."),
});

export function RecipeAnalysisClient() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzeRecipeAyurvedicPropertiesOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipeName: "",
      ingredients: "",
      instructions: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setAnalysis(null);
    setError(null);
    try {
      const result = await analyzeRecipeAyurvedicProperties(values);
      setAnalysis(result);
    } catch (e) {
      setError("Failed to analyze recipe. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const formatText = (text: string) => {
    return text
      .replace(/^#\s(.*?)$/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
      .replace(/^##\s(.*?)$/gm, '<h3 class="text-lg font-bold mt-3 mb-1">$1</h3>')
      .replace(/^###\s(.*?)$/gm, '<h4 class="text-md font-bold mt-2 mb-1">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\*\s(.*?)$/gm, '<li>$1</li>')
      .replace(/^\s*\-\s(.*?)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      .replace(/<li>(.*?)<ul>/gs, '<li>$1<ul class="pl-4">')
      .replace(/<\/ul>\n<ul>/gs, '')
      .replace(/(\r\n|\n|\r)/gm, "<br />")
      .replace(/<br \/>\n*<br \/>/gm, '<br />')
      .replace(/<ul><br \/>/g, '<ul>')
      .replace(/<br \/>\s*<\/ul>/g, '</ul>');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">Recipe Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="recipeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipe Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Kitchari" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ingredients</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List each ingredient on a new line, e.g.,&#10;1 cup Mung Dal&#10;1/2 cup Basmati Rice"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the preparation steps."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <><Loader2 className="animate-spin" /> Analyzing...</>
                ) : (
                  <><Sparkles /> Analyze Recipe</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="sticky top-24">
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Loader2 className="size-12 animate-spin text-primary" />
                <p className="mt-4">Our AI is analyzing your recipe...</p>
              </div>
            )}
            {error && <p className="text-destructive">{error}</p>}
            {analysis && (
              <Accordion type="single" collapsible defaultValue="nutritional" className="w-full">
                <AccordionItem value="nutritional">
                  <AccordionTrigger>Nutritional Analysis</AccordionTrigger>
                  <AccordionContent>
                    <div 
                      className="prose prose-sm dark:prose-invert max-w-none font-body text-foreground"
                      dangerouslySetInnerHTML={{ __html: formatText(analysis.nutritionalAnalysis) }} 
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="ayurvedic">
                  <AccordionTrigger>Ayurvedic Analysis</AccordionTrigger>
                  <AccordionContent>
                    <div 
                      className="prose prose-sm dark:prose-invert max-w-none font-body text-foreground"
                      dangerouslySetInnerHTML={{ __html: formatText(analysis.ayurvedicAnalysis) }} 
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
            {!loading && !analysis && !error && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Pipette className="size-12" />
                <p className="mt-4">Your recipe analysis will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
