"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { EventFormValues } from "@/features/events/event.schema";
import { Textarea } from "@/components/ui/textarea";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type EventFormProps = {
  form: {
    register: UseFormRegister<EventFormValues>;
    errors: FieldErrors<EventFormValues>;
    submitHandle: () => Promise<void>;
    isPending: boolean;
    errorMessage: string | null;
  };
  submitLabel: string;
  pendingLabel: string;
};

const categories = [
  { value: "jam", label: "Jam" },
  { value: "word", label: "Word" },
  { value: "theater", label: "Theater" },
  { value: "standup", label: "Standup" },
  { value: "dance", label: "Dance" },
  { value: "another", label: "Another" },
] as const;

export function EventForm({ form, submitLabel, pendingLabel }: EventFormProps) {
  const { register, errors, submitHandle, isPending, errorMessage } = form;

  return (
    <form onSubmit={submitHandle} noValidate className="space-y-4">
      <Field>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <Input id="title" {...register("title")} />
        <FieldError errors={[errors.title]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Textarea className="max-h-96" id="description" {...register("description")} />
        <FieldError errors={[errors.description]} />
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

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
}
