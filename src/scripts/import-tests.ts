import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { adminDb } from '@/lib/firebaseAdmin';

const file = process.argv[2];
if (!file) {
  console.error('usage: ts-node import-tests.ts <file.csv>');
  process.exit(1);
}

const content = fs.readFileSync(file);
const records = parse(content, { columns: true });

async function run() {
  for (const r of records) {
    await adminDb.collection('testsLibrary').add({
      name: r.name,
      domain: r.domain,
      numQuestions: Number(r.numQuestions),
      instructions: r.instructions,
      scoringAlgorithm: r.scoringAlgorithm,
    });
  }
}

run();
