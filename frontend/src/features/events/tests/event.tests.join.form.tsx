import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import JoinForm from "../components/join.form";
import useMembership from "../hooks/use.membership.event";
import useJoin from "../hooks/use.join.events";
import useLeave from "../hooks/use.leave.events";
import type { Event } from "../types";
import type { Me } from "@/lib/api/types";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("../hooks/use.membership.event", () => ({
  default: vi.fn(),
}));

vi.mock("../hooks/use.join.events", () => ({
  default: vi.fn(),
}));

vi.mock("../hooks/use.leave.events", () => ({
  default: vi.fn(),
}));

const mockEvent: Event = {
  id: "event-123",
  title: "Friday Jazz Jam",
  description: "Open acoustic and electric jam session",
  maxParticipants: 20,
  contactInfo: "@jam_host",
  entryPrice: null,
  isDonationBased: true,
  donationInfo: "Pay what you want at the door",
  address: "Berlin Str. 10",
  startsAt: "2026-12-10T20:00:00.000Z",
  category: "jam",
  ownerId: "owner-1",
  createdAt: "2026-11-20T10:00:00.000Z",
  updatedAt: "2026-11-20T10:00:00.000Z",
};

const mockUser: Me = {
  id: "user-1",
  name: "Max",
  email: "max@example.com",
  createdAt: "2026-11-20T10:00:00.000Z",
  updatedAt: "2026-11-20T10:00:00.000Z",
};

const mockOwner: Me = {
  id: "owner-1",
  name: "Owner",
  email: "owner@example.com",
  createdAt: "2026-11-20T10:00:00.000Z",
  updatedAt: "2026-11-20T10:00:00.000Z",
};

type RenderJoinFormProps = {
  me?: Me | undefined;
  isJoined?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  isJoinPending?: boolean;
  isLeavePending?: boolean;
};

function renderJoinForm({
  me = mockUser,
  isJoined = false,
  isLoading = false,
  isError = false,
  isJoinPending = false,
  isLeavePending = false,
}: RenderJoinFormProps = {}) {
  const push = vi.fn();
  const joinMutate = vi.fn();
  const leaveMutate = vi.fn();

  vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);

  vi.mocked(useMembership).mockReturnValue({
    data: isLoading || isError ? undefined : { isJoined },
    isLoading,
    isError,
  } as unknown as ReturnType<typeof useMembership>);

  vi.mocked(useJoin).mockReturnValue({
    mutate: joinMutate,
    isPending: isJoinPending,
  } as unknown as ReturnType<typeof useJoin>);

  vi.mocked(useLeave).mockReturnValue({
    mutate: leaveMutate,
    isPending: isLeavePending,
  } as unknown as ReturnType<typeof useLeave>);

  const view = render(<JoinForm event={mockEvent} me={me} />);

  return { ...view, push, joinMutate, leaveMutate };
}

describe("JoinForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects guest user to /login on click", async () => {
    const user = userEvent.setup();
    const { push, joinMutate, leaveMutate } = renderJoinForm({ me: undefined });

    await user.click(screen.getByRole("button", { name: /join event/i }));

    expect(push).toHaveBeenCalledWith("/login");
    expect(joinMutate).not.toHaveBeenCalled();
    expect(leaveMutate).not.toHaveBeenCalled();
  });

  it("renders nothing when user is the event owner", () => {
    const { container } = renderJoinForm({ me: mockOwner });

    expect(container).toBeEmptyDOMElement();
  });

  it("renders disabled loading button while membership is loading", () => {
    renderJoinForm({ isLoading: true });

    expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled();
  });

  it("renders disabled error button when membership fails", () => {
    renderJoinForm({ isError: true });

    expect(screen.getByRole("button", { name: /error occurred/i })).toBeDisabled();
  });

  it("renders Join button and note input when user is not joined", () => {
    renderJoinForm({ isJoined: false });

    expect(screen.getByRole("button", { name: /^join$/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders Leave button and hides note input when user is already joined", () => {
    renderJoinForm({ isJoined: true });

    expect(screen.getByRole("button", { name: /^leave$/i })).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("blocks join and shows error when note is shorter than 2 characters", async () => {
    const user = userEvent.setup();
    const { joinMutate } = renderJoinForm({ isJoined: false });

    await user.type(screen.getByRole("textbox"), "a");
    await user.click(screen.getByRole("button", { name: /^join$/i }));

    expect(joinMutate).not.toHaveBeenCalled();
    expect(screen.getByText(/between 2 and 60 characters/i)).toBeInTheDocument();
  });

  it("blocks join and shows error when note is longer than 60 characters", async () => {
    const user = userEvent.setup();
    const { joinMutate } = renderJoinForm({ isJoined: false });

    await user.type(screen.getByRole("textbox"), "a".repeat(61));
    await user.click(screen.getByRole("button", { name: /^join$/i }));

    expect(joinMutate).not.toHaveBeenCalled();
    expect(screen.getByText(/between 2 and 60 characters/i)).toBeInTheDocument();
  });

  it("calls join mutation with trimmed note, resets input and shows success message", async () => {
    const user = userEvent.setup();
    const { joinMutate, leaveMutate } = renderJoinForm({ isJoined: false });

    joinMutate.mockImplementation((_vars, options) => {
      options?.onSuccess?.({} as never, { eventId: mockEvent.id, note: "Keys" }, undefined);
    });

    const input = screen.getByRole("textbox");
    await user.type(input, "  Keys  ");
    await user.click(screen.getByRole("button", { name: /^join$/i }));

    expect(joinMutate).toHaveBeenCalledWith(
      { eventId: mockEvent.id, note: "Keys" },
      expect.any(Object),
    );
    expect(leaveMutate).not.toHaveBeenCalled();
    expect(input).toHaveValue("");
    expect(screen.getByText(/you joined the event successfully/i)).toBeInTheDocument();
  });

  it("calls leave mutation and shows message when user is joined", async () => {
    const user = userEvent.setup();
    const { leaveMutate, joinMutate } = renderJoinForm({ isJoined: true });

    leaveMutate.mockImplementation((_vars, options) => {
      options?.onSuccess?.({} as never, { eventId: mockEvent.id }, undefined);
    });

    await user.click(screen.getByRole("button", { name: /^leave$/i }));

    expect(leaveMutate).toHaveBeenCalledWith({ eventId: mockEvent.id }, expect.any(Object));
    expect(joinMutate).not.toHaveBeenCalled();
    expect(screen.getByText(/you left the event/i)).toBeInTheDocument();
  });
});
