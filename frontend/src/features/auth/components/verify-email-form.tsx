"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  AResendEmailVerification,
  AVerifyEmail,
} from "@/features/auth/actions";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthSubmitButton } from "@/features/auth/components/auth-submit-button";
import {
  SVerifyEmail,
  type VerifyEmailFormValues,
} from "@/features/auth/schemas/verify-email.schema";
import { cn } from "@/lib/utils";
import { ErrorAlert } from "@/shared/components/error-alert";
import { FormField } from "@/shared/components/form-field";
import { Button } from "@/shared/components/ui/button";
import { buttonVariants } from "@/shared/components/ui/button-variants";
import {
  CardDescription,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/components/ui/input-otp";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email")?.trim() ?? "";

  const [submitError, setSubmitError] = useState<unknown>(null);
  const [resendPending, setResendPending] = useState(false);

  const form = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(SVerifyEmail),
    defaultValues: { email: emailParam, code: "" },
  });

  useEffect(() => {
    if (emailParam) {
      form.setValue("email", emailParam);
    }
  }, [emailParam, form.setValue]);

  if (!emailParam) {
    return (
      <AuthCard
        header={
          <>
            <CardTitle className="text-xl font-semibold">
              Verificar email
            </CardTitle>
            <CardDescription>
              Falta o email na ligação. Regista-te de novo ou inicia sessão se
              já tiveres conta.
            </CardDescription>
          </>
        }
        footer={
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className={cn(buttonVariants({ className: "w-full sm:w-auto" }))}
            >
              Criar conta
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  className: "w-full sm:w-auto",
                }),
              )}
            >
              Entrar
            </Link>
          </div>
        }
      />
    );
  }

  return (
    <AuthCard
      header={
        <>
          <CardTitle className="text-xl font-semibold">
            Verificar email
          </CardTitle>
          <CardDescription>
            Introduz o código de 6 dígitos que enviámos para{" "}
            <span className="font-medium text-foreground">{emailParam}</span>.
          </CardDescription>
        </>
      }
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Já verificaste?{" "}
          <Link
            href={`/login?email=${encodeURIComponent(emailParam)}`}
            className={cn(
              buttonVariants({ variant: "link", className: "h-auto p-0" }),
            )}
          >
            Ir para o login
          </Link>
        </p>
      }
    >
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(async (values) => {
          setSubmitError(null);
          try {
            await AVerifyEmail(values.email, values.code);
            toast.success("Email verificado. Podes iniciar sessão.");
            router.replace(
              `/login?email=${encodeURIComponent(values.email)}`,
            );
          } catch (e) {
            setSubmitError(e);
          }
        })}
      >
        {submitError ? <ErrorAlert error={submitError} /> : null}

        <input type="hidden" {...form.register("email")} />

        <FormField
          label="Código"
          htmlFor="code"
          required
          error={form.formState.errors.code?.message}
        >
          <Controller
            control={form.control}
            name="code"
            render={({ field, fieldState }) => (
              <InputOTP
                id="code"
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                disabled={form.formState.isSubmitting}
                aria-invalid={fieldState.invalid}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              >
                <InputOTPGroup className="w-full justify-center">
                  {Array.from({ length: 6 }, (_, i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />
        </FormField>

        <div className="flex flex-col gap-3 sm:flex-row-reverse sm:items-center sm:justify-between">
          <AuthSubmitButton
            className="w-full sm:w-auto sm:min-w-[140px]"
            pending={form.formState.isSubmitting}
            idleLabel="Confirmar"
            pendingLabel="A confirmar…"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            disabled={resendPending}
            onClick={async () => {
              setResendPending(true);
              try {
                const msg = await AResendEmailVerification(emailParam);
                toast.success(msg);
              } catch (e) {
                toast.error(
                  e instanceof Error ? e.message : "Não foi possível reenviar.",
                );
              } finally {
                setResendPending(false);
              }
            }}
          >
            {resendPending ? "A enviar…" : "Reenviar código"}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
