const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function main() {
  const date = new Date().toISOString().slice(0, 10);
  const dir = path.join(__dirname, '..', 'backups', `dev-${date}`);
  fs.mkdirSync(dir, { recursive: true });
  execSync(`npx firebase emulators:export ${dir}`, { stdio: 'inherit' });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
