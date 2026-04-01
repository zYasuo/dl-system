import { cn } from "@/lib/utils";

type RequiredMarkProps = {
  className?: string;
};

export function RequiredMark({ className }: RequiredMarkProps) {
  return (
    <span className={cn("text-destructive", className)} aria-hidden>
      *
    </span>
  );
}
