type ClientModalPlaceholderPanelProps = {
  label: string;
};

export function ClientModalPlaceholderPanel({
  label,
}: ClientModalPlaceholderPanelProps) {
  return (
    <div className="py-10 text-center">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Conteúdo disponível em breve.
      </p>
    </div>
  );
}
