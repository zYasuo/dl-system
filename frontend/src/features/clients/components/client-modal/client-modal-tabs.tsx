"use client";

import { MoreHorizontal } from "lucide-react";

import {
  CLIENT_MODAL_INLINE_TAB_COUNT,
  CLIENT_MODAL_TABS,
} from "@/features/clients/components/client-modal/client-modal-constants";
import { buttonVariants } from "@/shared/components/ui/button-variants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { cn } from "@/lib/utils";

type ClientModalTabsProps = {
  activeTab: string;
  onTabChange: (value: string) => void;
};

export function ClientModalTabsBar({
  activeTab,
  onTabChange,
}: ClientModalTabsProps) {
  const inline = CLIENT_MODAL_TABS.slice(0, CLIENT_MODAL_INLINE_TAB_COUNT);
  const overflow = CLIENT_MODAL_TABS.slice(CLIENT_MODAL_INLINE_TAB_COUNT);

  return (
    <div className="shrink-0 border-b border-border bg-muted/10">
      <div className="flex min-w-0 items-stretch gap-1 px-2 py-1.5">
        <div
          className={cn(
            "flex min-w-0 flex-1 overflow-x-auto overscroll-x-contain scroll-smooth",
            "[scrollbar-width:thin]",
          )}
          role="presentation"
        >
          <TabsList
            variant="line"
            className="inline-flex h-9 w-max min-h-9 items-center justify-start gap-0.5 rounded-none bg-transparent p-0"
          >
            {inline.map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="shrink-0 rounded-md px-3 py-1.5 text-xs sm:text-sm"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {overflow.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-sm" }),
                "shrink-0",
                overflow.some((t) => t.id === activeTab) && "bg-muted",
              )}
              aria-label="Mais separadores"
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-72 overflow-y-auto">
              {overflow.map((t) => (
                <DropdownMenuItem
                  key={t.id}
                  onClick={() => onTabChange(t.id)}
                  data-active={t.id === activeTab}
                >
                  {t.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </div>
  );
}
