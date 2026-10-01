import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { RegisterForm } from "../components/register-form";
import { useRegister } from "../hooks/use-register";
import { ApiError } from "@/lib/api/errors";

vi.mock("../hooks/use-register", () => ({
  useRegister: vi.fn(),
}));

describe("RegisterForm", () => {
  const mutate = vi.fn();

  beforeEach(() => {
    vi.mocked(useRegister).mockReturnValue({
      mutate,
      isPending: false,
      error: null,
    } as any);
    mutate.mockClear();
  });

  it("renders name, email and password fields", () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.click(screen.getByRole("button", { name: /sign up/i }));

    const alerts = await screen.findAllByRole("alert");
    expect(alerts.length).toBeGreaterThan(0);
    expect(mutate).not.toHaveBeenCalled();
  });

  it("shows validation error for invalid email", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText("Name"), "Maria Kowalska");
    await user.type(screen.getByLabelText("Email"), "not-an-email");
    await user.type(screen.getByLabelText("Password"), "Sunset!Jam2026");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    const alerts = await screen.findAllByRole("alert");
    expect(alerts.length).toBeGreaterThan(0);
    expect(mutate).not.toHaveBeenCalled();
  });

  it("shows validation error for weak password", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText("Name"), "Maria Kowalska");
    await user.type(screen.getByLabelText("Email"), "maria.kowalska@example.com");
    await user.type(screen.getByLabelText("Password"), "weak");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    const alerts = await screen.findAllByRole("alert");
    expect(alerts.length).toBeGreaterThan(0);
    expect(mutate).not.toHaveBeenCalled();
  });

  it("calls mutate with valid data", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText("Name"), "Maria Kowalska");
    await user.type(screen.getByLabelText("Email"), "maria.kowalska@example.com");
    await user.type(screen.getByLabelText("Password"), "Sunset!Jam2026");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(mutate).toHaveBeenCalledWith({
      name: "Maria Kowalska",
      email: "maria.kowalska@example.com",
      password: "Sunset!Jam2026",
    });
  });

  it("disables button when pending", () => {
    vi.mocked(useRegister).mockReturnValue({
      mutate,
      isPending: true,
      error: null,
    } as any);

    render(<RegisterForm />);

    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByText(/creating account/i)).toBeInTheDocument();
  });

  it("shows ApiError message when registration fails", () => {
    const apiError = new ApiError(
      409,
      "EMAIL_ALREADY_EXISTS",
      "An account with this email already exists",
    );

    vi.mocked(useRegister).mockReturnValue({
      mutate,
      isPending: false,
      error: apiError,
    } as any);

    render(<RegisterForm />);

    expect(screen.getByText("An account with this email already exists")).toBeInTheDocument();
  });
});
