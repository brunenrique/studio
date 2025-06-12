import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

describe('users security rules', () => {
  let testEnv: any;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'demo-project',
      firestore: { rules: readFileSync('docs/firestore.rules', 'utf8') }
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  it('allows a user to read their own document', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx: any) => {
      await setDoc(doc(ctx.firestore(), 'users/alice'), { role: 'PSYCHOLOGIST' });
    });
    const alice = testEnv.authenticatedContext('alice', { role: 'PSYCHOLOGIST' });
    await assertSucceeds(getDoc(doc(alice.firestore(), 'users/alice')));
  });

  it('denies a user reading another user', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx: any) => {
      await setDoc(doc(ctx.firestore(), 'users/bob'), { role: 'PSYCHOLOGIST' });
    });
    const alice = testEnv.authenticatedContext('alice', { role: 'PSYCHOLOGIST' });
    await assertFails(getDoc(doc(alice.firestore(), 'users/bob')));
  });

  it('allows admin to update any user', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx: any) => {
      await setDoc(doc(ctx.firestore(), 'users/bob'), { role: 'PSYCHOLOGIST' });
    });
    const admin = testEnv.authenticatedContext('admin', { role: 'ADMIN' });
    await assertSucceeds(updateDoc(doc(admin.firestore(), 'users/bob'), { role: 'ADMIN' }));
  });

  it('denies non-admin updating other user', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx: any) => {
      await setDoc(doc(ctx.firestore(), 'users/bob'), { role: 'PSYCHOLOGIST' });
    });
    const alice = testEnv.authenticatedContext('alice', { role: 'PSYCHOLOGIST' });
    await assertFails(updateDoc(doc(alice.firestore(), 'users/bob'), { role: 'PSYCHOLOGIST' }));
  });
});
