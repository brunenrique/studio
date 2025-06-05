const esbuild = require('esbuild');
const path = require('path');

// Compile the TypeScript utility file on the fly
const { outputFiles } = esbuild.buildSync({
  entryPoints: [path.join(__dirname, '../src/lib/utils.ts')],
  platform: 'node',
  format: 'cjs',
  bundle: true,
  write: false,
});

// Evaluate the compiled code to get the exports
const module = { exports: {} };
const func = new Function('module', 'exports', outputFiles[0].text);
func(module, module.exports);
const { encrypt, decrypt } = module.exports;

const sample = 'Hello World';

test('encrypt returns different string', () => {
  const encrypted = encrypt(sample);
  expect(typeof encrypted).toBe('string');
  expect(encrypted).not.toBe(sample);
});

test('decrypt(encrypt(text)) yields the original text', () => {
  const encrypted = encrypt(sample);
  const decrypted = decrypt(encrypted);
  expect(decrypted).toBe(sample);
});
