import { LogIn } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { loginSchema, type LoginInput } from "@hms/contracts";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginInput>({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  async function onSubmit(data: LoginInput) {
    setFormError(null);

    const parsed = loginSchema.safeParse(data);

    if (!parsed.success) {
      setFormError(parsed.error.errors[0]?.message ?? "Please check your sign-in details");
      return;
    }

    try {
      await login(parsed.data);
      await navigate("/dashboard");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to sign in");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm"
      >
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground">HMS secure access</p>
          <h1 className="mt-1 text-2xl font-semibold">Sign in</h1>
        </div>

        <div className="space-y-4">
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

          {formError ? (
            <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{formError}</p>
          ) : null}
        </div>

        <Button className="mt-6 w-full" type="submit" disabled={isSubmitting}>
          <LogIn className="h-4 w-4" />
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          New to HMS?{" "}
          <Link className="font-medium text-primary" to="/signup">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}
