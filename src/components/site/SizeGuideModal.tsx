import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { sizeGuideColumns, sizeGuideRows } from "@/lib/site";

export function SizeGuideModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-border bg-background sm:rounded-none">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl font-normal tracking-normal">
            Size guide
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Measurements are shown only when verified values are provided by EYVORA. No estimated
          figures are published here.
        </p>
        {sizeGuideRows.length === 0 ? (
          <div className="mt-6 border border-dashed border-border px-6 py-10 text-center">
            <p className="text-sm text-muted-foreground">Size measurements coming soon.</p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  {sizeGuideColumns.map((col) => (
                    <th
                      key={col}
                      className="px-3 py-3 text-[0.625rem] font-normal tracking-[0.22em] uppercase"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sizeGuideRows.map((row) => (
                  <tr key={row.Size} className="border-b border-border/70">
                    {sizeGuideColumns.map((col) => (
                      <td key={col} className="px-3 py-3">
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
