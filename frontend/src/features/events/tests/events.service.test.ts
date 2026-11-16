import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteEvent, getEvents } from "../events.service";
import { apiFetch } from "@/lib/api/client";

vi.mock("@/lib/api/client", () => ({
  apiFetch: vi.fn(),
}));

describe("getEvents", () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockResolvedValue({ events: [], total: 0 });
  });

  it("calls apiFetch without query string when no filters", async () => {
    await getEvents();
    expect(apiFetch).toHaveBeenCalledWith("/events/");
  });

  it("adds page and limit to query string", async () => {
    await getEvents({ page: 2, limit: 10 });
    expect(apiFetch).toHaveBeenCalledWith("/events/?page=2&limit=10");
  });

  it("adds search and category to query string", async () => {
    await getEvents({ search: "jazz", category: "jam" });
    expect(apiFetch).toHaveBeenCalledWith("/events/?search=jazz&category=jam");
  });

  it("adds all params in order", async () => {
    await getEvents({ page: 1, limit: 10, search: "jazz", category: "jam" });
    expect(apiFetch).toHaveBeenCalledWith("/events/?page=1&limit=10&search=jazz&category=jam");
  });
});

describe("deleteEvent", () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockResolvedValue(undefined);
  });

  it("calls apiFetch with correct path, method and token", async () => {
    await deleteEvent("abc-123", "my-token");

    expect(apiFetch).toHaveBeenCalledWith("/events/abc-123", {
      method: "DELETE",
      token: "my-token",
    });
  });

  it("returns undefined (204 no content)", async () => {
    const result = await deleteEvent("abc-123", "my-token");
    expect(result).toBeUndefined();
  });
});
