import { Input } from "@/components/ui/Field";

interface DateRangeFilterProps {
  from: string;
  to: string;
  onChange: (range: { from: string; to: string }) => void;
}

export function DateRangeFilter({ from, to, onChange }: DateRangeFilterProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Input
        type="date"
        aria-label="Created from"
        value={from}
        max={to || undefined}
        onChange={(e) => onChange({ from: e.target.value, to })}
      />
      <Input
        type="date"
        aria-label="Created to"
        value={to}
        min={from || undefined}
        onChange={(e) => onChange({ from, to: e.target.value })}
      />
    </div>
  );
}
