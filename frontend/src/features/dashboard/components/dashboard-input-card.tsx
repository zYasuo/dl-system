"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type Props = {
  title: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
};

export function DashboardInputCard({
  title,
  description,
  badge,
  className,
  contentClassName,
  children,
}: Props) {
  return (
    <Card
      size="sm"
      className={cn(
        "flex h-full min-h-[200px] flex-col gap-0 overflow-hidden py-0",
        className,
      )}
    >
      <CardHeader className="shrink-0 border-b border-border/60 bg-muted/30 px-3 py-3 sm:px-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-medium leading-snug">{title}</CardTitle>
          {badge != null ? (
            <span className="shrink-0 tabular-nums text-xs text-muted-foreground">
              {badge}
            </span>
          ) : null}
        </div>
        {description ? (
          <CardDescription className="mt-1.5">{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent
        className={cn(
          "flex min-h-0 flex-1 flex-col px-3 py-3 sm:px-4 sm:py-4",
          contentClassName,
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
}
