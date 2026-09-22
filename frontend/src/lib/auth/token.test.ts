import { describe, it, expect, beforeEach } from "vitest";
import { getToken, setToken, clearToken } from "./token";

describe("token", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null when no token", () => {
    expect(getToken()).toBeNull();
  });

  it("saves token in LS", () => {
    setToken("test-token-123");
    expect(localStorage.getItem("meetandjam_token")).toBe("test-token-123");
  });

  it("retrieves stored token", () => {
    setToken("test-token-123");
    expect(getToken()).toBe("test-token-123");
  });

  it("clears token from LS", () => {
    setToken("test-token-123");
    clearToken();
    expect(getToken()).toBeNull();
  });

  it("overwrites current token", () => {
    setToken("old-token");
    setToken("new-token");
    expect(getToken()).toBe("new-token");
  });
});
