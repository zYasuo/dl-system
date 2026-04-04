"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  AResendEmailVerification,
  AVerifyEmail,
} from "@/features/auth/actions";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthScreenHeader } from "@/features/auth/components/auth-screen-header";
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
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
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
          <AuthScreenHeader
            title="Verificar email"
            description="Esta página precisa do email na ligação. Regista-te de novo ou inicia sessão se já tiveres conta."
          />
        }
        footer={
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3">
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
        <AuthScreenHeader
          title="Confirma o teu email"
          description={
            <>
              Introduz o código de 6 dígitos que enviámos para{" "}
              <span className="break-all font-mono text-[0.8125rem] font-medium text-foreground">
                {emailParam}
              </span>
              .
            </>
          }
          adornment={
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/25">
              <Mail className="size-6" aria-hidden />
            </span>
          }
        />
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
        className="space-y-6"
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
          label="Código de verificação"
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
                containerClassName="flex w-full flex-wrap items-center justify-center gap-2 sm:justify-start"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            )}
          />
        </FormField>

        <div className="flex flex-col gap-3 pt-1">
          <AuthSubmitButton
            pending={form.formState.isSubmitting}
            idleLabel="Confirmar e continuar"
            pendingLabel="A confirmar…"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
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
