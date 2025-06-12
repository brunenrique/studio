import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';

const rules = readFileSync('docs/firestore.rules', 'utf8');

let env: any;

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-project',
    firestore: { rules }
  });
});

afterAll(async () => {
  await env.cleanup();
});

test('allow append only logs', async () => {
  const ctx = env.authenticatedContext('user1', { role: 'PSYCHOLOGIST' });
  const db = ctx.firestore();
  const ref = db.collection('patients').doc('p1').collection('logs').doc('log1');
  await assertSucceeds(ref.set({ action: 'create' }));
  await assertFails(ref.update({ action: 'update' }));
  await assertFails(ref.delete());
});
