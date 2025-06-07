import { createCipheriv, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);
const IV = Buffer.alloc(16, 0);

function base64decode(value: string): Buffer {
  return Buffer.from(value.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

export interface FirebaseHashConfig {
  base64_signer_key: string;
  base64_salt_separator: string;
  rounds: number;
  mem_cost: number;
}

export async function firebaseScryptHash(
  password: string,
  salt: string,
  config: FirebaseHashConfig,
): Promise<string> {
  const saltBuffer = Buffer.concat([
    base64decode(salt),
    base64decode(config.base64_salt_separator),
  ]);

  const derivedKey = await scryptAsync(password, saltBuffer, 32, {
    N: 2 ** config.mem_cost,
    r: config.rounds,
    p: 1,
  });

  const cipher = createCipheriv('aes-256-ctr', derivedKey, IV);
  const result = Buffer.concat([
    cipher.update(base64decode(config.base64_signer_key)),
    cipher.final(),
  ]);

  return result.toString('base64');
}
