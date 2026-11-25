import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useMembership from "../hooks/use.membership.event";
import useJoin from "../hooks/use.join.events";
import { mockEventDetails } from "./event.mocks";
import { useRouter } from "next/navigation";
import JoinButton from "../components/join.button";
vi.mock("../hooks/use.membership.event");
vi.mock("../hooks/use.join.events");
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));
const event = mockEventDetails;
const mutate = vi.fn();
const push = vi.fn();
const owner = {
  id: event.ownerId,
  email: "owner@test.com",
  name: "Owner",
  createdAt: "",
  updatedAt: "",
};
const guest = {
  id: "guest-id",
  email: "guest@test.com",
  name: "Guest",
  createdAt: "",
  updatedAt: "",
};
function mockState({
  isJoined = false,
  isLoading = false,
  isError = false,
}: {
  isJoined?: boolean;
  isLoading?: boolean;
  isError?: boolean;
} = {}) {
  vi.mocked(useMembership).mockReturnValue({
    data: isLoading || isError ? undefined : { isJoined },
    isLoading,
    isError,
  } as any);
  vi.mocked(useJoin).mockReturnValue({
    mutate,
    isPending: false,
  } as any);
  vi.mocked(useRouter).mockReturnValue({
    push,
  } as any);
}
describe("JoinButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("shows Join and redirects to login when user is not logged in", async () => {
    const user = userEvent.setup();
    mockState();
    render(<JoinButton event={event} me={undefined} />);
    const button = screen.getByRole("button", { name: /join event/i });
    await user.click(button);
    expect(push).toHaveBeenCalledWith("/login");
  });
  it("renders nothing when user is the owner", () => {
    mockState();
    const { container } = render(<JoinButton event={event} me={owner} />);
    expect(container).toBeEmptyDOMElement();
  });
  it("shows Join when user is logged in and not joined", async () => {
    const user = userEvent.setup();
    mockState({ isJoined: false });
    render(<JoinButton event={event} me={guest} />);
    const button = screen.getByRole("button", { name: /^join$/i });
    await user.click(button);
    expect(mutate).toHaveBeenCalledWith({ eventId: event.id, operation: "join" });
  });
  it("shows Leave when user is logged in and already joined", async () => {
    const user = userEvent.setup();
    mockState({ isJoined: true });
    render(<JoinButton event={event} me={guest} />);
    const button = screen.getByRole("button", { name: /leave/i });
    await user.click(button);
    expect(mutate).toHaveBeenCalledWith({ eventId: event.id, operation: "leave" });
  });
  it("shows loading state", () => {
    mockState({ isLoading: true });
    render(<JoinButton event={event} me={guest} />);
    expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled();
  });
  it("shows error state", () => {
    mockState({ isError: true });
    render(<JoinButton event={event} me={guest} />);
    expect(screen.getByRole("button", { name: /error/i })).toBeDisabled();
  });
});
