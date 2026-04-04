import type { ReactNode } from "react";
import { AuthBrandMark } from "@/features/auth/components/auth-brand-mark";

type AuthPageLayoutProps = {
  children: ReactNode;
};

export function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 sm:py-12">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,var(--primary)_0%,transparent_58%)] opacity-[0.14]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_100%,var(--accent)_0%,transparent_50%)] opacity-40"
        aria-hidden
      />
      <div className="relative w-full max-w-lg space-y-8">
        <div className="flex w-full justify-center">
          <AuthBrandMark href="/" />
        </div>
        {children}
      </div>
    </div>
  );
}
