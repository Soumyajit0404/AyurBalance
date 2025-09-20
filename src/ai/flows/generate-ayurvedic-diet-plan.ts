'use server';
/**
 * @fileOverview AI agent that generates personalized Ayurvedic diet plans based on patient data.
 *
 * - generateAyurvedicDietPlan - A function that generates an Ayurvedic diet plan for a patient.
 * - GenerateAyurvedicDietPlanInput - The input type for the generateAyurvedicDietPlan function.
 * - GenerateAyurvedicDietPlanOutput - The return type for the generateAyurvedicDietPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAyurvedicDietPlanInputSchema = z.object({
  patientData: z
    .string()
    .describe('Patient data including dosha, imbalances, health parameters, and dietary preferences.'),
});
export type GenerateAyurvedicDietPlanInput = z.infer<typeof GenerateAyurvedicDietPlanInputSchema>;

const GenerateAyurvedicDietPlanOutputSchema = z.object({
  dietPlan: z.string().describe('The generated Ayurvedic diet plan.'),
});
export type GenerateAyurvedicDietPlanOutput = z.infer<typeof GenerateAyurvedicDietPlanOutputSchema>;

export async function generateAyurvedicDietPlan(input: GenerateAyurvedicDietPlanInput): Promise<GenerateAyurvedicDietPlanOutput> {
  return generateAyurvedicDietPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAyurvedicDietPlanPrompt',
  input: {schema: GenerateAyurvedicDietPlanInputSchema},
  output: {schema: GenerateAyurvedicDietPlanOutputSchema},
  prompt: `You are an expert Ayurvedic doctor.

  Based on the following patient data, generate a personalized Ayurvedic diet plan. Consider the patient's dosha, imbalances, health parameters, and dietary preferences.

  Patient Data: {{{patientData}}}

  Format the output as a structured diet plan. Use clear headings for each section (e.g., "Breakfast," "Lunch," "Dinner," "Lifestyle Advice").
  Under each heading, use bullet points or a numbered list to present the recommendations. Do not write one long continuous paragraph.
  Ensure the diet plan aligns with Ayurvedic principles and provides specific food recommendations, meal timings, and lifestyle advice.
`,
});

const generateAyurvedicDietPlanFlow = ai.defineFlow(
  {
    name: 'generateAyurvedicDietPlanFlow',
    inputSchema: GenerateAyurvedicDietPlanInputSchema,
    outputSchema: GenerateAyurvedicDietPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
