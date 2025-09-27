'use server';
/**
 * @fileOverview Analyzes custom recipes for their nutritional and Ayurvedic properties using AI.
 *
 * - analyzeRecipeAyurvedicProperties - A function that handles the recipe analysis process.
 * - AnalyzeRecipeAyurvedicPropertiesInput - The input type for the analyzeRecipeAyurvedicProperties function.
 * - AnalyzeRecipeAyurvedicPropertiesOutput - The return type for the analyzeRecipeAyurvedicProperties function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeRecipeAyurvedicPropertiesInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  ingredients: z.string().describe('The ingredients of the recipe.'),
  instructions: z.string().describe('The instructions for preparing the recipe.'),
});
export type AnalyzeRecipeAyurvedicPropertiesInput = z.infer<
  typeof AnalyzeRecipeAyurvedicPropertiesInputSchema
>;

const AnalyzeRecipeAyurvedicPropertiesOutputSchema = z.object({
  nutritionalAnalysis: z
    .string()
    .describe('Detailed nutritional analysis of the recipe, presented in bullet points.'),
  ayurvedicAnalysis: z
    .string()
    .describe('Detailed Ayurvedic analysis of the recipe, including dosha effects, presented in bullet points.'),
});
export type AnalyzeRecipeAyurvedicPropertiesOutput = z.infer<
  typeof AnalyzeRecipeAyurvedicPropertiesOutputSchema
>;

export async function analyzeRecipeAyurvedicProperties(
  input: AnalyzeRecipeAyurvedicPropertiesInput
): Promise<AnalyzeRecipeAyurvedicPropertiesOutput> {
  return analyzeRecipeAyurvedicPropertiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeRecipeAyurvedicPropertiesPrompt',
  input: {schema: AnalyzeRecipeAyurvedicPropertiesInputSchema},
  output: {schema: AnalyzeRecipeAyurvedicPropertiesOutputSchema},
  prompt: `You are an expert dietitian with extensive knowledge of both modern nutrition and Ayurveda.

You will analyze a recipe provided by the user for its nutritional content and its effects according to Ayurvedic principles.

Recipe Name: {{{recipeName}}}
Ingredients: {{{ingredients}}}
Instructions: {{{instructions}}}

Provide a detailed nutritional analysis and an Ayurvedic analysis. For both sections, you MUST use bullet points (e.g., * point) to list out the key information. Do not write in long paragraphs.

The nutritional analysis should cover macronutrients and micronutrients.
The Ayurvedic analysis should cover the effects on each dosha (Vata, Pitta, Kapha) and any potential imbalances.
`,
});

const analyzeRecipeAyurvedicPropertiesFlow = ai.defineFlow(
  {
    name: 'analyzeRecipeAyurvedicPropertiesFlow',
    inputSchema: AnalyzeRecipeAyurvedicPropertiesInputSchema,
    outputSchema: AnalyzeRecipeAyurvedicPropertiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
