'use server';
/**
 * @fileOverview Summarizes a patient's health history for healthcare professionals.
 *
 * - summarizeHealthHistory - A function that summarizes a patient's health history.
 * - SummarizeHealthHistoryInput - The input type for the summarizeHealthHistory function.
 * - SummarizeHealthHistoryOutput - The return type for the summarizeHealthHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeHealthHistoryInputSchema = z.object({
  healthHistory: z
    .string()
    .describe('The patient health history to be summarized.'),
});
export type SummarizeHealthHistoryInput = z.infer<typeof SummarizeHealthHistoryInputSchema>;

const SummarizeHealthHistoryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the patient health history.'),
});
export type SummarizeHealthHistoryOutput = z.infer<typeof SummarizeHealthHistoryOutputSchema>;

export async function summarizeHealthHistory(input: SummarizeHealthHistoryInput): Promise<SummarizeHealthHistoryOutput> {
  return summarizeHealthHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeHealthHistoryPrompt',
  input: {schema: SummarizeHealthHistoryInputSchema},
  output: {schema: SummarizeHealthHistoryOutputSchema},
  prompt: `You are an expert healthcare professional.  Please provide a concise summary of the following patient health history:\n\n{{healthHistory}}`,
});

const summarizeHealthHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeHealthHistoryFlow',
    inputSchema: SummarizeHealthHistoryInputSchema,
    outputSchema: SummarizeHealthHistoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
