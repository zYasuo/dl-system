import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import { cn } from "@/lib/utils";

type AuthCardProps = {
  header: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function AuthCard({ header, children, footer, className }: AuthCardProps) {
  return (
    <Card
      className={cn(
        "mx-auto w-full max-w-md border-border/50 bg-card/90 shadow-2xl shadow-black/25 ring-1 ring-white/5 backdrop-blur-md",
        className,
      )}
    >
      <CardHeader className="space-y-0 px-5 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
        {header}
      </CardHeader>
      {children != null ? (
        <CardContent className="space-y-6 px-5 pb-6 sm:px-6 sm:pb-8">
          {children}
        </CardContent>
      ) : null}
      {footer ? (
        <CardFooter className="flex-col gap-2 border-border/40 bg-muted/30 px-5 py-4 sm:px-6">
          {footer}
        </CardFooter>
      ) : null}
    </Card>
  );
}
