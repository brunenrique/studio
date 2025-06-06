import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { adminDb } from '@/lib/firebaseAdmin';

const file = process.argv[2];
if (!file) {
  console.error('usage: ts-node import-tests.ts <file.csv>');
  process.exit(1);
}

const content = fs.readFileSync(file);
interface CsvRecord {
  name: string;
  domain: string;
  numQuestions: string;
  instructions?: string;
  scoringAlgorithm?: string;
}

const records = parse(content, { columns: true, skip_empty_lines: true }) as CsvRecord[];

async function run() {
  for (const r of records) {
    if (!r.name || !r.domain || isNaN(Number(r.numQuestions))) {
      console.warn('Skipping invalid row', r);
      continue;
    }

    await adminDb.collection('testsLibrary').add({
      name: r.name.trim(),
      domain: r.domain.trim(),
      numQuestions: Number(r.numQuestions),
      instructions: r.instructions?.trim() || '',
      scoringAlgorithm: r.scoringAlgorithm?.trim() || '',
    });
  }
}

run();
