import type { ReactNode } from "react";
import { BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/common/ErrorState";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  loading?: boolean;
  error?: boolean;
  empty?: boolean;
  onRetry?: () => void;
  className?: string;
  children: ReactNode;
}

export function ChartCard({
  title,
  subtitle,
  action,
  loading,
  error,
  empty,
  onRetry,
  className,
  children,
}: ChartCardProps) {
  return (
    <Card className={className}>
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      <div className="px-3 pb-4 pt-3 sm:px-5">
        {loading ? (
          <Skeleton className="h-[280px] w-full" />
        ) : error ? (
          <ErrorState onRetry={onRetry} />
        ) : empty ? (
          <EmptyState
            icon={BarChart3}
            title="No data yet"
            description="Charts appear once records are added."
          />
        ) : (
          children
        )}
      </div>
    </Card>
  );
}
