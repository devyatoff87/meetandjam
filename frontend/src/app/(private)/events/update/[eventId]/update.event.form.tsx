"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@/lib/api/errors";
import { EventFormValues, eventSchema } from "@/features/events/event.schema";
import { EventForm } from "../../event.form.ui";
import { Event } from "@/lib/api/types";
import { toDatetimeLocal } from "@/lib/utils";
import { useUpdateEvent } from "@/features/events/hooks/use.update.event";

export function UpdateEventForm({ event }: { event: Event }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event.title,
      description: event.description,
      address: event.address,
      startsAt: toDatetimeLocal(event.startsAt),
      category: event.category ?? undefined,
    },
  });

  const mutation = useUpdateEvent(event.id);

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

  return <EventForm form={form} submitLabel="Update event" pendingLabel="Updating..." />;
}
