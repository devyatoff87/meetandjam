"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@/lib/api/errors";
import { EventFormValues, eventSchema } from "@/features/events/event.schema";
import { useCreateEvent } from "@/features/events/hooks/use-create-events";
import { EventForm } from "../event.form.ui";

export function CreateEventForm() {
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

  const mutation = useCreateEvent();

  const onSubmit = (values: EventFormValues) => {
    mutation.mutate(values);
  };

  const error = mutation.error;
  const errorMessage =
    error instanceof ApiError ? error.message : error ? "Something went wrong" : null;

  const form = {
    register,
    errors,
    submitHandle: handleSubmit(onSubmit),
    isPending: mutation.isPending,
    errorMessage,
  };

  return <EventForm form={form} submitLabel="Create event" pendingLabel="Creating..." />;
}
