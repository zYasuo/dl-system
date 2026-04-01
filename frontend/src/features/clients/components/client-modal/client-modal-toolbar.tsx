"use client";

import { MapPin, Plus, Save, Trash2, XIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";

const API_HINT = "Indisponível — API em evolução";

type ClientModalToolbarProps = {
  mode: "create" | "edit";
  isSubmitting: boolean;
  saveDisabled?: boolean;
  deleteDisabled?: boolean;
  onNew: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
};

export function ClientModalToolbar({
  mode,
  isSubmitting,
  saveDisabled,
  deleteDisabled,
  onNew,
  onSave,
  onCancel,
  onDelete,
}: ClientModalToolbarProps) {
  const saveOff = saveDisabled === true || isSubmitting;
  const deleteOff = deleteDisabled === true;

  return (
    <div
      className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-muted/15 px-4 py-2"
      role="toolbar"
      aria-label="Acções do cliente"
    >
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="gap-1.5"
        onClick={onNew}
      >
        <Plus className="size-4" aria-hidden />
        Novo
      </Button>
      <Button
        type="button"
        variant="default"
        size="sm"
        className="gap-1.5"
        disabled={saveOff}
        title={saveDisabled ? API_HINT : undefined}
        onClick={onSave}
      >
        <Save className="size-4" aria-hidden />
        {isSubmitting ? "A guardar…" : "Salvar"}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={onCancel}
      >
        <XIcon className="size-4" aria-hidden />
        Cancelar
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5 text-destructive hover:text-destructive"
        disabled={deleteOff}
        title={deleteOff ? API_HINT : undefined}
        onClick={onDelete}
      >
        <Trash2 className="size-4" aria-hidden />
        Deletar
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => toast.message("Localização em breve (mapa ou morada).")}
      >
        <MapPin className="size-4" aria-hidden />
        Localização
      </Button>
      {mode === "edit" ? (
        <span className="ms-auto text-xs text-muted-foreground">
          Modo edição — salvar alterações quando a API estiver disponível.
        </span>
      ) : null}
    </div>
  );
}
