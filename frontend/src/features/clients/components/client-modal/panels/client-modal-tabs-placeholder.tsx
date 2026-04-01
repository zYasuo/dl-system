import { ClientModalPlaceholderPanel } from "@/features/clients/components/client-modal/panels/client-modal-placeholder-panel";
import { TabsContent } from "@/shared/components/ui/tabs";

type ClientModalTabsPlaceholderProps = {
  value: string;
  label: string;
};

export function ClientModalTabsPlaceholder({
  value,
  label,
}: ClientModalTabsPlaceholderProps) {
  return (
    <TabsContent
      value={value}
      className="mt-0 max-h-[min(52dvh,520px)] overflow-y-auto pe-1 pt-2 outline-none data-[orientation=horizontal]:mt-0"
    >
      <ClientModalPlaceholderPanel label={label} />
    </TabsContent>
  );
}
