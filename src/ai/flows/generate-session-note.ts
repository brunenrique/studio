'use server';

/**
 * Generates a summarized note from a session transcript.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateSessionNoteInputSchema = z.object({
  transcript: z.string().describe('Transcript of the therapy session.'),
});
export type GenerateSessionNoteInput = z.infer<typeof GenerateSessionNoteInputSchema>;

const GenerateSessionNoteOutputSchema = z.object({
  summary: z.string().describe('Short summary of the session.'),
  keywords: z.array(z.string()).describe('Important keywords extracted from the transcript.'),
});
export type GenerateSessionNoteOutput = z.infer<typeof GenerateSessionNoteOutputSchema>;

export async function generateSessionNote(
  input: GenerateSessionNoteInput,
): Promise<GenerateSessionNoteOutput> {
  return generateSessionNoteFlow(input);
}

const generateSessionNotePrompt = ai.definePrompt({
  name: 'generateSessionNotePrompt',
  input: { schema: GenerateSessionNoteInputSchema },
  output: { schema: GenerateSessionNoteOutputSchema },
  config: {
    model: 'openai/gpt-4o',
    maxOutputTokens: 512,
  },
  prompt: `Você é um assistente que analisa a transcrição de uma sessão de terapia e gera um resumo breve e palavras-chave relevantes.\n\nTranscrição:\n{{{transcript}}}`,
});

const generateSessionNoteFlow = ai.defineFlow(
  {
    name: 'generateSessionNoteFlow',
    inputSchema: GenerateSessionNoteInputSchema,
    outputSchema: GenerateSessionNoteOutputSchema,
  },
  async input => {
    const { output } = await generateSessionNotePrompt(input);
    return output!;
  },
);
