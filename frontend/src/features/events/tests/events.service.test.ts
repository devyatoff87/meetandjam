import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteEvent } from "../events.service";
import { apiFetch } from "@/lib/api/client";

vi.mock("@/lib/api/client", () => ({
  apiFetch: vi.fn(),
}));

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
