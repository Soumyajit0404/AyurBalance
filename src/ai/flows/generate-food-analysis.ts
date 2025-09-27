'use server';
/**
 * @fileOverview Generates a detailed nutritional and Ayurvedic analysis for a given food item.
 *
 * - generateFoodAnalysis - A function that handles the food analysis process.
 * - GenerateFoodAnalysisInput - The input type for the generateFoodAnalysis function.
 *- GenerateFoodAnalysisOutput - The return type for the generateFoodAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFoodAnalysisInputSchema = z.object({
  foodName: z.string().describe('The name of the food item to analyze.'),
  foodProperties: z
    .string()
    .describe('Known Ayurvedic properties of the food (e.g., V-P-K+, Sweet, Cooling).'),
});
export type GenerateFoodAnalysisInput = z.infer<typeof GenerateFoodAnalysisInputSchema>;

const GenerateFoodAnalysisOutputSchema = z.object({
  detailedAnalysis: z
    .string()
    .describe(
      'A detailed analysis of the food, including its primary nutrients, vitamins, minerals, and a comprehensive breakdown of its Ayurvedic qualities (Rasa, Virya, Vipaka) and its effects on the Vata, Pitta, and Kapha doshas.'
    ),
});
export type GenerateFoodAnalysisOutput = z.infer<typeof GenerateFoodAnalysisOutputSchema>;

export async function generateFoodAnalysis(
  input: GenerateFoodAnalysisInput
): Promise<GenerateFoodAnalysisOutput> {
  return generateFoodAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFoodAnalysisPrompt',
  input: {schema: GenerateFoodAnalysisInputSchema},
  output: {schema: GenerateFoodAnalysisOutputSchema},
  prompt: `You are an expert in both modern nutrition and ancient Ayurvedic science.

Analyze the food item "{{foodName}}".

Known Ayurvedic properties are: "{{foodProperties}}".

Provide a detailed analysis covering the following points in a clear, well-structured format. Use Markdown for formatting (headings and bullet points).

1.  **Nutritional Profile**: Briefly list the key nutrients, vitamins, and minerals found in this food.
2.  **Ayurvedic Analysis**:
    *   **Rasa (Taste)**: Describe its primary tastes.
    *   **Virya (Energy)**: Is it heating or cooling?
    *   **Vipaka (Post-Digestive Effect)**: What is its effect after digestion?
    *   **Guna (Qualities)**: List its main qualities (e.g., Light, Heavy, Oily, Dry).
    *   **Dosha Effects**: Explain in detail how it impacts Vata, Pitta, and Kapha doshas. Mention if it is balancing or aggravating for each.

Return this information in the 'detailedAnalysis' field.
`,
});

const generateFoodAnalysisFlow = ai.defineFlow(
  {
    name: 'generateFoodAnalysisFlow',
    inputSchema: GenerateFoodAnalysisInputSchema,
    outputSchema: GenerateFoodAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
