import { generateSessionNote } from '../src/ai/flows/generate-session-note';

test('generateSessionNote flow stub', async () => {
  const result = await generateSessionNote({ transcript: 'olá mundo' });
  expect(result.summary).toBeDefined();
  expect(result.keywords).toBeDefined();
});
