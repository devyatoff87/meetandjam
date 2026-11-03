import { zodResolver } from "@hookform/resolvers/zod";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { EventForm } from "../../components/event.form";
import { eventSchema } from "../event.schema";
import { EventFormValues } from "../event.schema";

function renderEventForm() {
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

    const form = {
      submitHandle: handleSubmit(onSubmit),
      register,
      errors,
      isPending: false,
      errorMessage: null,
      cancelFn: () => {},
    };

    return (
      <EventForm
        form={form}
        cancelFn={onCancel}
        submitLabel="Create event"
        pendingLabel="Creating..."
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
});
