import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiFetch } from "./client";
import { ApiError } from "./errors";

vi.mock("@/lib/env", () => ({
  env: { NEXT_PUBLIC_API_URL: "http://localhost:3000" },
}));

describe("apiFetch", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("adds content-type header when body is present", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    } as any);

    await apiFetch("/events", { body: { title: "Concert" }, method: "POST" });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/events"),
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("does not add content-type header when body is missing", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    } as any);

    await apiFetch("/events");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/events"),
      expect.objectContaining({
        headers: expect.not.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("returns undefined by status 204 (no content)", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 204,
    } as any);

    const res = await apiFetch("/events");
    expect(res).toBeUndefined();
  });

  it("calls apiFetch with bearer token option since the token exists", async () => {
    const token = "abc123";

    vi.mocked(fetch).mockResolvedValue({
      status: 200,
      ok: true,
      json: () => Promise.resolve({ success: true }),
    } as any);

    await apiFetch("/events", {
      token: token,
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/events"),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: `Bearer ${token}` }),
      }),
    );
  });

  it("throws ApiError when response is not ok", async () => {
    const validationErrorObj = {
      code: "VALIDATION_ERROR",
      message: "Validation failed",
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: false, // <-- the main flag for falling into the error block in apiFetch
      status: 400,
      json: () =>
        Promise.resolve({
          statusCode: 400,
          ...validationErrorObj,
          details: null,
        }),
    } as any);

    await expect(apiFetch("/events")).rejects.toThrow(ApiError);
    await expect(apiFetch("/events")).rejects.toMatchObject(validationErrorObj);
  });

  it("serializes body to JSON string", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    } as any);

    const payload = { title: "Concert", category: "jam" };

    await apiFetch("/events", { body: payload, method: "POST" });

    const [, options] = vi.mocked(fetch).mock.calls[0];

    expect(typeof options?.body).toBe("string");
    expect(JSON.parse(options?.body as string)).toEqual(payload);
  });
});
