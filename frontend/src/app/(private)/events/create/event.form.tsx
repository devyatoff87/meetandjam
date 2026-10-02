"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { ApiError } from "@/lib/api/errors";
import { EventFormValues, eventSchema } from "@/features/events/event.schema";
import { useCreateEvent } from "@/features/events/hooks/use-create-events";
import { Textarea } from "../../../../components/ui/textarea";

const categories = [
  { value: "jam", label: "Jam" },
  { value: "word", label: "Word" },
  { value: "theater", label: "Theater" },
  { value: "standup", label: "Standup" },
  { value: "dance", label: "Dance" },
  { value: "another", label: "Another" },
] as const;

export function EventForm() {
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Field>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <Input id="title" {...register("title")} />
        <FieldError errors={[errors.title]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <FieldError errors={[errors.description]} />
        <Textarea className="max-h-96" id="description" {...register("description")} />
      </Field>

      <Field>
        <FieldLabel htmlFor="address">Address</FieldLabel>
        <Input id="address" {...register("address")} />
        <FieldError errors={[errors.address]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="startsAt">Date and beginning time</FieldLabel>
        <Input id="startsAt" type="datetime-local" {...register("startsAt")} />
        <FieldError errors={[errors.startsAt]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="category">Category</FieldLabel>
        <select
          id="category"
          {...register("category")}
          className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <FieldError errors={[errors.category]} />
      </Field>

      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? "Creating..." : "Create event"}
      </Button>
    </form>
  );
}
