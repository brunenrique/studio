import { generateSessionSummary, extractSessionTags } from '../src/lib/sessionNotes';

test('generateSessionSummary returns first two sentences', () => {
  const text = 'Primeira frase. Segunda frase. Terceira frase.';
  expect(generateSessionSummary(text)).toBe('Primeira frase. Segunda frase.');
});

test('extractSessionTags finds keywords', () => {
  const text = 'Paciente relatou ansiedade na escola e tristeza persistente.';
  const tags = extractSessionTags(text);
  expect(tags).toEqual(expect.arrayContaining(['ansiedade', 'tristeza', 'escola']));
});
