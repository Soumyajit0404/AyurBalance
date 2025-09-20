'use server';
/**
 * @fileOverview This file defines a Genkit flow for answering diet and wellness questions using natural language.
 *
 * - answerDietWellnessQuestions - A function that takes a question string as input and returns an answer string.
 * - AnswerDietWellnessQuestionsInput - The input type for the answerDietWellnessQuestions function.
 * - AnswerDietWellnessQuestionsOutput - The return type for the answerDietWellnessQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerDietWellnessQuestionsInputSchema = z.object({
  question: z.string().describe('The question about diet and wellness.'),
});
export type AnswerDietWellnessQuestionsInput = z.infer<typeof AnswerDietWellnessQuestionsInputSchema>;

const AnswerDietWellnessQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type AnswerDietWellnessQuestionsOutput = z.infer<typeof AnswerDietWellnessQuestionsOutputSchema>;

export async function answerDietWellnessQuestions(
  input: AnswerDietWellnessQuestionsInput
): Promise<AnswerDietWellnessQuestionsOutput> {
  return answerDietWellnessQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerDietWellnessQuestionsPrompt',
  input: {schema: AnswerDietWellnessQuestionsInputSchema},
  output: {schema: AnswerDietWellnessQuestionsOutputSchema},
  prompt: `You are a helpful AI assistant providing information related to diet and wellness, with a focus on Ayurvedic principles.

  Answer the following question:
  {{question}}`,
});

const answerDietWellnessQuestionsFlow = ai.defineFlow(
  {
    name: 'answerDietWellnessQuestionsFlow',
    inputSchema: AnswerDietWellnessQuestionsInputSchema,
    outputSchema: AnswerDietWellnessQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
