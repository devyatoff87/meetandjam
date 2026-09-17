"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "../hooks/use-register";
import { registerSchema, type RegisterFormValues } from "../auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { ApiError } from "@/lib/api/errors";

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", name: "" },
  });

  const mutation = useRegister();

  const onSubmit = (values: RegisterFormValues) => {
    mutation.mutate(values);
  };

  const error = mutation.error;
  const errorMessage =
    error instanceof ApiError ? error.message : error ? "Something went wrong" : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input id="name" placeholder="John Doe" {...register("name")} />
        <FieldError errors={[errors.name]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
        <FieldError errors={[errors.email]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input id="password" type="password" {...register("password")} />
        <FieldError errors={[errors.password]} />
      </Field>

      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? "Creating account..." : "Sign up"}
      </Button>
    </form>
  );
}
