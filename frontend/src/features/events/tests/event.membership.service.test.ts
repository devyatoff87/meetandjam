import { apiFetch } from "@/lib/api/client";
import { getMembership, joinEvent, leaveEvent } from "../events.service";

vi.mock("@/lib/api/client");

const eventId = "event-123";
const token = "my-token";
const note = "Acoustic guitar";

describe("joinEvent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(apiFetch).mockResolvedValue({});
  });

  it("calls apiFetch with POST /events/join, eventId, note and token", async () => {
    await joinEvent(eventId, note, token);

    expect(apiFetch).toHaveBeenCalledWith("/events/join", {
      method: "POST",
      body: { eventId, note },
      token,
    });
  });
});

describe("leaveEvent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(apiFetch).mockResolvedValue({});
  });

  it("calls apiFetch with POST /events/leave, eventId and token", async () => {
    await leaveEvent(eventId, token);

    expect(apiFetch).toHaveBeenCalledWith("/events/leave", {
      method: "POST",
      body: { eventId },
      token,
    });
  });
});

describe("getMembership", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls apiFetch with GET and token", async () => {
    await getMembership(eventId, token);

    expect(apiFetch).toHaveBeenCalledWith(`/events/${eventId}/membership`, {
      token,
    });
  });

  it("calls apiFetch and returns the response", async () => {
    vi.mocked(apiFetch).mockResolvedValue({ isJoined: true });

    const result = await getMembership(eventId, token);

    expect(result).toEqual({ isJoined: true });
  });
});
