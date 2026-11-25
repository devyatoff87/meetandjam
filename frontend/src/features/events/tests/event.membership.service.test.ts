import { apiFetch } from "@/lib/api/client";
import { getMembership, joinEvent } from "../events.service";

vi.mock("@/lib/api/client");

const eventId = "event-123";
const token = "my-token";

describe("joinEvent", () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockResolvedValue({});
  });

  it("calls apiFetch with POST /events/join for join operation", async () => {
    await joinEvent(eventId, token, "join");

    expect(apiFetch).toHaveBeenCalledWith("/events/join", {
      method: "POST",
      body: { eventId: eventId },
      token: token,
    });
  });

  it("calls apiFetch with POST /events/leave for leave operation", async () => {
    await joinEvent(eventId, token, "leave");

    expect(apiFetch).toHaveBeenCalledWith("/events/leave", {
      method: "POST",
      body: { eventId: eventId },
      token: token,
    });
  });
});

describe("getMembership", () => {
  it("calls apiFetch with GET and token", async () => {
    await getMembership(eventId, token);

    expect(apiFetch).toHaveBeenCalledWith(`/events/${eventId}/membership`, {
      token: token,
    });
  });

  it("calls apiFetch and returns the response", async () => {
    vi.mocked(apiFetch).mockResolvedValue({ isJoined: true });

    const result = await getMembership(eventId, token);

    expect(result).toEqual({ isJoined: true });
  });
});
