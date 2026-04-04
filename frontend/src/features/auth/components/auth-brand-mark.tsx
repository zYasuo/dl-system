import Link from "next/link";
import { Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthBrandMarkProps = {
  href?: string;
  className?: string;
};

export function AuthBrandMark({ href, className }: AuthBrandMarkProps) {
  const inner = (
    <div
      className={cn(
        "flex items-center gap-2.5 text-muted-foreground transition-colors",
        className,
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/20">
        <Ticket className="size-[1.125rem]" aria-hidden />
      </span>
      <span className="text-xl font-semibold tracking-tight text-foreground">
        DL Tickets
      </span>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex rounded-xl outline-none ring-offset-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {inner}
      </Link>
    );
  }

  return inner;
}
