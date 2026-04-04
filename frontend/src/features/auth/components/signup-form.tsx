"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ARegisterUser } from "@/features/auth/actions";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthScreenHeader } from "@/features/auth/components/auth-screen-header";
import { AuthSubmitButton } from "@/features/auth/components/auth-submit-button";
import {
  SSignup,
  type SignupFormValues,
} from "@/features/auth/schemas/signup.schema";
import { cn } from "@/lib/utils";
import { ErrorAlert } from "@/shared/components/error-alert";
import { FormField } from "@/shared/components/form-field";
import { PasswordInput } from "@/shared/components/password-input";
import { buttonVariants } from "@/shared/components/ui/button-variants";
import { Input } from "@/shared/components/ui/input";

export function SignupForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<unknown>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SSignup),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <AuthCard
      className="max-w-lg"
      header={
        <AuthScreenHeader
          title="Criar conta"
          description="Em poucos passos ficas pronto(a) para gerir tickets e clientes."
        />
      }
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Já tens conta?{" "}
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "link", className: "h-auto p-0" }),
            )}
          >
            Entrar
          </Link>
        </p>
      }
    >
      <form
        className="space-y-8"
        onSubmit={form.handleSubmit(async (values) => {
          setSubmitError(null);
          try {
            await ARegisterUser({
              name: values.name,
              email: values.email,
              password: values.password,
            });
            toast.success(
              "Conta criada. Enviámos um código de 6 dígitos para o teu email.",
            );
            router.replace(
              `/verify-email?email=${encodeURIComponent(values.email)}`,
            );
          } catch (e) {
            setSubmitError(e);
          }
        })}
      >
        {submitError ? <ErrorAlert error={submitError} /> : null}

        <div
          className="space-y-4"
          role="group"
          aria-labelledby="signup-profile-heading"
        >
          <h2
            id="signup-profile-heading"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Perfil
          </h2>
          <div className="space-y-4">
            <FormField
              label="Nome"
              htmlFor="name"
              required
              error={form.formState.errors.name?.message}
            >
              <Input
                id="name"
                autoComplete="name"
                autoFocus
                className="h-10"
                {...form.register("name")}
              />
            </FormField>

            <FormField
              label="Email"
              htmlFor="email"
              required
              error={form.formState.errors.email?.message}
            >
              <Input
                id="email"
                type="email"
                autoComplete="email"
                className="h-10"
                {...form.register("email")}
              />
            </FormField>
          </div>
        </div>

        <div
          className="space-y-4 rounded-xl border border-border/50 bg-muted/25 p-4 sm:p-5"
          role="group"
          aria-labelledby="signup-password-heading"
        >
          <h2
            id="signup-password-heading"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Password
          </h2>
          <div className="space-y-4">
            <FormField
              label="Password"
              htmlFor="password"
              required
              error={form.formState.errors.password?.message}
            >
              <>
                <PasswordInput
                  id="password"
                  autoComplete="new-password"
                  className="h-10"
                  aria-invalid={!!form.formState.errors.password}
                  {...form.register("password")}
                />
                <p className="text-xs text-muted-foreground">
                  Mínimo de 8 caracteres.
                </p>
              </>
            </FormField>

            <FormField
              label="Confirmar password"
              htmlFor="confirmPassword"
              required
              error={form.formState.errors.confirmPassword?.message}
            >
              <PasswordInput
                id="confirmPassword"
                autoComplete="new-password"
                className="h-10"
                aria-invalid={!!form.formState.errors.confirmPassword}
                {...form.register("confirmPassword")}
              />
            </FormField>
          </div>
        </div>

        <AuthSubmitButton
          pending={form.formState.isSubmitting}
          idleLabel="Criar conta"
          pendingLabel="A criar…"
        />
      </form>
    </AuthCard>
  );
}
