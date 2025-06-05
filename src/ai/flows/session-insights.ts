'use server';

/**
 * @fileOverview AI-driven session insights for psychologists.
 *
 * - getSessionInsights - A function that analyzes session notes and patient history to surface potential issues.
 * - SessionInsightsInput - The input type for the getSessionInsights function.
 * - SessionInsightsOutput - The return type for the getSessionInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SessionInsightsInputSchema = z.object({
  sessionNotes: z
    .string()
    .describe('The notes taken during a therapy session.'),
  patientHistory: z
    .string()
    .describe('The patient medical history.'),
});
export type SessionInsightsInput = z.infer<typeof SessionInsightsInputSchema>;

const SessionInsightsOutputSchema = z.object({
  insights: z
    .string()
    .describe('The AI-generated insights, warnings, and concerns based on the session notes and patient history.'),
});
export type SessionInsightsOutput = z.infer<typeof SessionInsightsOutputSchema>;

export async function getSessionInsights(input: SessionInsightsInput): Promise<SessionInsightsOutput> {
  return sessionInsightsFlow(input);
}

const sessionInsightsPrompt = ai.definePrompt({
  name: 'sessionInsightsPrompt',
  input: {schema: SessionInsightsInputSchema},
  output: {schema: SessionInsightsOutputSchema},
  prompt: `You are an AI assistant for psychologists, trained to analyze therapy session notes and patient history.

  Your goal is to identify potential issues, warnings, and concerns that the psychologist should be aware of.

  Based on the session notes and patient history provided, generate a list of insights that can help improve treatment effectiveness.

  Session Notes: {{{sessionNotes}}}
  Patient History: {{{patientHistory}}}`,
});

const sessionInsightsFlow = ai.defineFlow(
  {
    name: 'sessionInsightsFlow',
    inputSchema: SessionInsightsInputSchema,
    outputSchema: SessionInsightsOutputSchema,
  },
  async input => {
    const {output} = await sessionInsightsPrompt(input);
    return output!;
  }
);
