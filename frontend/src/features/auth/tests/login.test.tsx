import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LoginForm } from "../components/login-form";
import { useLogin } from "../hooks/use-login";
import { ApiError } from "@/lib/api/errors";

vi.mock("../hooks/use-login", () => ({
  useLogin: vi.fn(),
}));

describe("LoginForm", () => {
  const mutate = vi.fn();

  beforeEach(() => {
    vi.mocked(useLogin).mockReturnValue({
      mutate,
      isPending: false,
      error: null,
    } as any);
    mutate.mockClear();
  });

  it("renders email and password fields", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows validation error when submitting empty form", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it("shows validation error for invalid email", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "not-an-email");
    await user.type(screen.getByLabelText("Password"), "Sunset!Jam2026");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it("calls mutate with valid credentials", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "maria.kowalska@example.com");
    await user.type(screen.getByLabelText("Password"), "Sunset!Jam2026");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mutate).toHaveBeenCalledWith({
      email: "maria.kowalska@example.com",
      password: "Sunset!Jam2026",
    });
  });

  it("disables button when pending", () => {
    vi.mocked(useLogin).mockReturnValue({
      mutate,
      isPending: true,
      error: null,
    } as any);

    render(<LoginForm />);

    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
  });

  it("shows ApiError message when login fails", () => {
    const apiError = new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password");

    vi.mocked(useLogin).mockReturnValue({
      mutate,
      isPending: false,
      error: apiError,
    } as any);

    render(<LoginForm />);

    expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
  });
});
