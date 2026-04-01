"use client";

import { History, Maximize2, Minimize2, XIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { DialogTitle } from "@/shared/components/ui/dialog";

type ClientModalHeaderProps = {
  expanded: boolean;
  onToggleExpand: () => void;
  onClose: () => void;
};

export function ClientModalHeader({
  expanded,
  onToggleExpand,
  onClose,
}: ClientModalHeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
      <DialogTitle className="text-lg font-semibold tracking-tight">
        Cliente
      </DialogTitle>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0"
          aria-label="Histórico"
          title="Histórico"
          onClick={() => toast.message("Histórico do cliente em breve.")}
        >
          <History className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0"
          aria-label={expanded ? "Restaurar tamanho" : "Maximizar"}
          title={expanded ? "Restaurar" : "Maximizar"}
          onClick={onToggleExpand}
        >
          {expanded ? (
            <Minimize2 className="size-4" />
          ) : (
            <Maximize2 className="size-4" />
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0"
          aria-label="Fechar"
          onClick={onClose}
        >
          <XIcon className="size-4" />
        </Button>
      </div>
    </header>
  );
}
