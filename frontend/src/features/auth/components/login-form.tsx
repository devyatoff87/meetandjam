"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../auth.schema";
import { useLogin } from "../hooks/use-login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { ApiError } from "@/lib/api/errors";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useLogin();

  const onSubmit = (values: LoginFormValues) => {
    mutation.mutate(values);
  };

  const error = mutation.error;
  const errorMessage =
    error instanceof ApiError ? error.message : error ? "Something went wrong" : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        {mutation.isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
