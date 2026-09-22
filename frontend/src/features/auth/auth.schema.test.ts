import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema } from "./auth.schema";
import { loginMock, registerMock } from "./auth.mocks";

describe("loginSchema", () => {
  it("accepts valid email and password", () => {
    const result = loginSchema.safeParse(loginMock.success);
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse(loginMock.invalidEmail);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["email"]);
    }
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse(loginMock.noPassword);
    expect(result.success).toBe(false);
  });

  it("rejects missing email", () => {
    const result = loginSchema.safeParse(loginMock.noEmail);
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("accepts valid registration input", () => {
    const result = registerSchema.safeParse(registerMock.success);
    expect(result.success).toBe(true);
  });

  it("rejects password without uppercase letter", () => {
    const result = registerSchema.safeParse(registerMock.noUpperCaseInPassword);
    expect(result.success).toBe(false);
  });

  it("rejects password without lowercase letter", () => {
    const result = registerSchema.safeParse(registerMock.noLowerCaseInPassword);
    expect(result.success).toBe(false);
  });

  it("rejects password without digit", () => {
    const result = registerSchema.safeParse(registerMock.noDigitInPassword);
    expect(result.success).toBe(false);
  });

  it("rejects password without special character", () => {
    const result = registerSchema.safeParse(registerMock.noSpecialsInPassword);
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than 8 characters", () => {
    const result = registerSchema.safeParse(registerMock.tooShortPassword);
    expect(result.success).toBe(false);
  });

  it("rejects password longer than 32 characters", () => {
    const result = registerSchema.safeParse(registerMock.tooLongPassword);
    expect(result.success).toBe(false);
  });

  it("rejects name shorter than 2 characters", () => {
    const result = registerSchema.safeParse(registerMock.tooShortName);
    expect(result.success).toBe(false);
  });

  it("rejects name longer than 32 characters", () => {
    const result = registerSchema.safeParse(registerMock.tooLongName);
    expect(result.success).toBe(false);
  });

  it("rejects name with invalid characters", () => {
    const result = registerSchema.safeParse(registerMock.invalidCharsInName);
    expect(result.success).toBe(false);
  });

  it("accepts name with hyphen", () => {
    const result = registerSchema.safeParse(registerMock.acceptsNameWithHyphen);
    expect(result.success).toBe(true);
  });

  it("accepts name with apostrophe", () => {
    const result = registerSchema.safeParse(registerMock.acceptsNameWithApstr);
    expect(result.success).toBe(true);
  });
});
