import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { registerSchema } from "@hms/contracts";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const registerFormSchema = registerSchema
  .extend({
    confirmPassword: z.string().min(8, "Please confirm your password")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function Register() {
  const navigate = useNavigate();
  const { register: createAccount } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  async function onSubmit({ confirmPassword: _confirmPassword, ...data }: RegisterFormData) {
    setFormError(null);

    const parsed = registerFormSchema.safeParse({ ...data, confirmPassword: _confirmPassword });

    if (!parsed.success) {
      setFormError(parsed.error.errors[0]?.message ?? "Please check your account details");
      return;
    }

    try {
      await createAccount({
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password
      });
      await navigate("/dashboard");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to create account");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm"
      >
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground">Start your HMS workspace</p>
          <h1 className="mt-1 text-2xl font-semibold">Create account</h1>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium">
            Full name
            <input
              className="mt-2 h-10 w-full rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
              type="text"
              {...register("name")}
            />
          </label>
          {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}

          <label className="block text-sm font-medium">
            Email
            <input
              className="mt-2 h-10 w-full rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
              type="email"
              {...register("email")}
            />
          </label>
          {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}

          <label className="block text-sm font-medium">
            Password
            <input
              className="mt-2 h-10 w-full rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
              type="password"
              {...register("password")}
            />
          </label>
          {errors.password ? (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          ) : null}

          <label className="block text-sm font-medium">
            Confirm password
            <input
              className="mt-2 h-10 w-full rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
              type="password"
              {...register("confirmPassword")}
            />
          </label>
          {errors.confirmPassword ? (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          ) : null}

          {formError ? (
            <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{formError}</p>
          ) : null}
        </div>

        <Button className="mt-6 w-full" type="submit" disabled={isSubmitting}>
          <UserPlus className="h-4 w-4" />
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <Link className="font-medium text-primary" to="/login">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
