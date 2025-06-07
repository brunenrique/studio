import { isValidEmail, isValidE164 } from "../functions/src/validators";

describe("validators", () => {
  test("isValidEmail validates correctly", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
    expect(isValidEmail("invalid")).toBe(false);
  });

  test("isValidE164 validates correctly", () => {
    expect(isValidE164("+1234567890")).toBe(true);
    expect(isValidE164("12345")).toBe(false);
  });
});
