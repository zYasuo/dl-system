"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const VerifyEmailForm = dynamic(
  () =>
    import("@/features/auth/components/verify-email-form").then((mod) => ({
      default: mod.VerifyEmailForm,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="text-center text-sm text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        A carregar…
      </div>
    ),
  },
);

export function VerifyEmailFormLazy() {
  return (
    <Suspense
      fallback={<div className="text-sm text-muted-foreground">…</div>}
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
