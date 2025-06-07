import { encrypt, decrypt, formatCPF, isValidCPF } from "../src/lib/utils";

beforeAll(() => {
  const key = Buffer.alloc(32).toString("base64");
  process.env.CRYPTO_SECRET_KEY = key;
});

afterAll(() => {
  delete process.env.CRYPTO_SECRET_KEY;
});

describe("encrypt/decrypt", () => {
  const plaintext = "hello world";

  it("encrypt produces output different from the plaintext", () => {
    const cipher = encrypt(plaintext);
    expect(cipher).not.toBe(plaintext);
  });

  it("decrypt(encrypt(text)) returns the original plaintext", () => {
    const cipher = encrypt(plaintext);
    const decrypted = decrypt(cipher);
    expect(decrypted).toBe(plaintext);
  });
});

describe("formatCPF/isValidCPF", () => {
  it("formats CPF correctly", () => {
    expect(formatCPF("52998224725")).toBe("529.982.247-25");
  });

  it("validates CPF", () => {
    expect(isValidCPF("529.982.247-25")).toBe(true);
    expect(isValidCPF("111.111.111-11")).toBe(false);
  });
});

describe("getCryptoKey", () => {
  it("throws if key not set and not in development", () => {
    delete process.env.CRYPTO_SECRET_KEY;
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "test";
    jest.resetModules();
    const { getCryptoKey } = require("../src/lib/utils");
    expect(() => getCryptoKey()).toThrow("CRYPTO_SECRET_KEY is not set");
    process.env.NODE_ENV = prev;
    process.env.CRYPTO_SECRET_KEY = Buffer.alloc(32).toString("base64");
  });

  it("generates random key in development", () => {
    delete process.env.CRYPTO_SECRET_KEY;
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    jest.resetModules();
    const { getCryptoKey } = require("../src/lib/utils");
    const key = getCryptoKey();
    expect(Buffer.isBuffer(key)).toBe(true);
    process.env.NODE_ENV = prev;
    process.env.CRYPTO_SECRET_KEY = Buffer.alloc(32).toString("base64");
  });
});

test("cn merges class names", () => {
  const { cn } = require("../src/lib/utils");
  expect(cn("a", false && "b", "c")).toBe("a c");
});
