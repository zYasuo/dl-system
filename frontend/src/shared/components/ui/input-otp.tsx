"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";

import { cn } from "@/lib/utils";

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      containerClassName={cn(
        "flex items-center gap-0 has-[:disabled]:opacity-50",
        containerClassName,
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center rounded-lg", className)} {...props} />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & { index: number }) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const slot = inputOTPContext?.slots[index];
  const char = slot?.char ?? null;
  const hasFakeCaret = slot?.hasFakeCaret ?? false;
  const isActive = slot?.isActive ?? false;

  return (
    <div
      className={cn(
        "relative z-0 flex h-10 w-9 shrink-0 items-center justify-center border-y border-r border-input bg-transparent text-sm font-mono tabular-nums transition-[color,box-shadow] first:rounded-l-lg first:border-l last:rounded-r-lg md:h-8 md:w-8 not-first:-ml-px",
        "dark:bg-input/30",
        isActive && "z-10 border-ring ring-2 ring-ring/50",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-pulse bg-foreground" />
        </div>
      ) : null}
    </div>
  );
}

function InputOTPSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="separator"
      aria-hidden
      className={cn("flex h-10 items-center px-1 md:h-8", className)}
      {...props}
    >
      <div className="h-px w-4 rounded-full bg-muted-foreground/35 md:w-3" />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
