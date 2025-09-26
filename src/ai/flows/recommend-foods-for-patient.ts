'use server';
/**
 * @fileOverview Recommends foods for a patient based on their profile and a search query.
 *
 * - recommendFoodsForPatient - A function that handles the food recommendation process.
 * - RecommendFoodsForPatientInput - The input type for the recommendFoodsForPatient function.
 * - RecommendFoodsForPatientOutput - The return type for the recommendFoodsForPatient function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FoodRecommendationSchema = z.object({
  name: z.string().describe('The name of the recommended food item.'),
  reasoning: z
    .string()
    .describe(
      'A brief explanation of why this food is recommended for the patient, based on their profile and Ayurvedic principles.'
    ),
  ayurvedicProperties: z
    .string()
    .describe('The Ayurvedic properties of the food (e.g., V-P-K+, Sweet, Cooling).'),
});

const RecommendFoodsForPatientInputSchema = z.object({
  patientProfile: z.string().describe('A summary of the patient\'s profile, including age, gender, dosha, health conditions, weight, and height.'),
  searchQuery: z.string().describe('The user\'s search query for a food type or name.'),
  foodList: z.string().describe('A JSON string of available food items to consider for recommendations.')
});
export type RecommendFoodsForPatientInput = z.infer<
  typeof RecommendFoodsForPatientInputSchema
>;

const RecommendFoodsForPatientOutputSchema = z.object({
  recommendations: z
    .array(FoodRecommendationSchema)
    .describe('A list of up to 5 recommended food items.'),
});
export type RecommendFoodsForPatientOutput = z.infer<
  typeof RecommendFoodsForPatientOutputSchema
>;

export async function recommendFoodsForPatient(
  input: RecommendFoodsForPatientInput
): Promise<RecommendFoodsForPatientOutput> {
  return recommendFoodsForPatientFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendFoodsForPatientPrompt',
  input: { schema: RecommendFoodsForPatientInputSchema },
  output: { schema: RecommendFoodsForPatientOutputSchema },
  prompt: `You are an expert Ayurvedic nutritionist.

A user is searching for foods for a specific patient. Based on the patient's profile and their search query, recommend up to 5 suitable food items from the provided list.

For each recommendation, provide a clear and concise reason why it is beneficial for this particular patient, considering their dosha, health parameters (like weight and height), and Ayurvedic principles.

Patient Profile:
{{{patientProfile}}}

Food Search Query: "{{searchQuery}}"

Available Food List (JSON):
\`\`\`json
{{{foodList}}}
\`\`\`

Provide your recommendations in the specified output format.
`,
});

const recommendFoodsForPatientFlow = ai.defineFlow(
  {
    name: 'recommendFoodsForPatientFlow',
    inputSchema: RecommendFoodsForPatientInputSchema,
    outputSchema: RecommendFoodsForPatientOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
