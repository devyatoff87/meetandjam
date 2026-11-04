import { zodResolver } from "@hookform/resolvers/zod";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormState, useForm } from "react-hook-form";
import { EventForm } from "../../components/event.form";
import { eventSchema } from "../event.schema";
import { EventFormValues } from "../event.schema";
import { mockEventsSimple } from "./event.mocks";

const { full } = mockEventsSimple;
const { title, description, address, startsAt, category } = full;

type RenderEventFormProps = {
  isPending?: boolean;
  pendingLabel?: string;
  errorMessage?: string | null;
};

function renderEventForm({
  isPending = false,
  pendingLabel = "Creating...",
  errorMessage = null,
}: RenderEventFormProps = {}) {
  const onSubmit = vi.fn();
  const onCancel = vi.fn();

  const Wrapper = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<EventFormValues>({
      resolver: zodResolver(eventSchema),
      defaultValues: {
        title: "",
        description: "",
        address: "",
        startsAt: "",
        category: "jam",
      },
    });

    console.log(errors);

    const form = {
      submitHandle: handleSubmit(onSubmit),
      register,
      errors,
      isPending,
      errorMessage,
      cancelFn: () => {},
    };
    return (
      <EventForm
        form={form}
        cancelFn={onCancel}
        submitLabel="Create event"
        pendingLabel={pendingLabel}
      />
    );
  };

  render(<Wrapper />);

  return { onSubmit };
}

describe("Event form", () => {
  const byLabel = (text: string) => {
    return screen.getByLabelText(text);
  };
  it("should render all form fields", () => {
    renderEventForm();

    expect(byLabel("Title")).toBeInTheDocument();
    expect(byLabel("Description")).toBeInTheDocument();
    expect(byLabel("Address")).toBeInTheDocument();
    expect(byLabel("Date and beginning time")).toBeInTheDocument();
    expect(byLabel("Category")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create event/i })).toBeInTheDocument();
  });

  it("should disable button by isPedning and show a proper label", () => {
    renderEventForm({
      isPending: true,
      pendingLabel: "Updating...",
    });

    const button = screen.getByRole("button", { name: /updating.../i });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Updating...");
  });

  it("Should show the error message when it was passed", () => {
    renderEventForm({
      errorMessage: "Something went wrong",
    });

    expect(screen.queryByText("Something went wrong")).toBeInTheDocument();
  });

  it("Should not show error message it was not passed", () => {
    renderEventForm({
      errorMessage: null,
    });

    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });

  it("calls submitFn with valid values", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderEventForm();

    await user.type(screen.getByLabelText("Title"), title);
    await user.type(screen.getByLabelText("Description"), description);
    await user.type(screen.getByLabelText("Address"), address);
    await user.selectOptions(screen.getByLabelText("Category"), category);
    console.log(startsAt);
    fireEvent.change(screen.getByLabelText("Date and beginning time"), {
      target: { value: startsAt },
    });

    await user.click(screen.getByRole("button", { name: /create event/i }));
    expect(screen.queryByText(/too small/i)).not.toBeInTheDocument();

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: title,
        description: description,
        startsAt: startsAt,
        address: address,
        category: category,
      }),
      expect.anything(),
    );
  });
});
