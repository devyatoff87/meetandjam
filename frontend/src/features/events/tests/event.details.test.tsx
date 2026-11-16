import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { EventDetails } from "../components/event.details";
import { useMe } from "@/features/auth/hooks/use-me";
import { useDeleteEvent } from "../hooks/use.delete.event";
import { mockEventDetails } from "./event.mocks";

// Мокаем хуки
vi.mock("@/features/auth/hooks/use-me");
vi.mock("../hooks/use.delete.event");

const event = mockEventDetails;
const mutate = vi.fn();

vi.mock("@/lib/env", () => ({
  env: { NEXT_PUBLIC_API_URL: "http://localhost:3000" },
}));

// Хелпер для рендера с разным состоянием юзера
function renderEventDetails(me: { id: string } | undefined) {
  vi.mocked(useMe).mockReturnValue({ data: me } as any);
  vi.mocked(useDeleteEvent).mockReturnValue({
    mutate,
    isPending: false,
  } as any);

  render(<EventDetails event={event} />);
}

describe("EventDetails", () => {
  beforeEach(() => {
    mutate.mockClear();
  });

  it("renders event details", () => {
    renderEventDetails(undefined);

    expect(screen.getByText(event.title)).toBeInTheDocument();
    expect(screen.getByText(event.address)).toBeInTheDocument();
    expect(screen.getByText(event.description)).toBeInTheDocument();
    expect(screen.getByText("jam")).toBeInTheDocument();
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });

  it("shows owner UI when current user is the owner", () => {
    // Передаем ID, который совпадает с ownerId ивента
    renderEventDetails({ id: event.ownerId });

    expect(screen.getByText(/your event/i)).toBeInTheDocument();
    // Update - это ссылка (Link), Delete - кнопка (Button)
    expect(screen.getByRole("link", { name: /update/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("hides owner UI when current user is not the owner", () => {
    // Передаем чужой ID
    renderEventDetails({ id: "other-user-id" });

    expect(screen.queryByText(/your event/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /update/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
  });

  it("hides owner UI when user is not logged in", () => {
    renderEventDetails(undefined);

    expect(screen.queryByText(/your event/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
  });

  it("calls mutate with event id when delete is clicked", async () => {
    const user = userEvent.setup();
    renderEventDetails({ id: event.ownerId });

    // Ищем кнопку удаления
    await user.click(screen.getByRole("button", { name: /delete/i }));

    // Проверяем, что хук удаления был вызван с правильным ID
    expect(mutate).toHaveBeenCalledWith(event.id);
  });
});
