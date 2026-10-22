"use client";

import { useMemo, useState } from "react";
import {
  CalendarPlus,
  Stethoscope,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { capitalize, cn, toISODate } from "@/lib/utils";
import {
  useGetDistributionsQuery,
  useGetOverviewQuery,
  useGetPatientsPerDoctorQuery,
  useGetTimelineQuery,
} from "@/services/dashboardApi";
import type { TimelineParams } from "@/types";
import { ChartCard } from "@/components/dashboard/ChartCard";
import {
  DistributionBarChart,
  DonutChart,
  PatientsPerDoctorChart,
  TimelineChart,
} from "@/components/dashboard/charts";
import { StatCard } from "@/components/dashboard/StatCard";
import { PageHeader } from "@/components/ui/Card";

const DAY_MS = 24 * 60 * 60 * 1000;

const RANGES = [
  { key: "7d", label: "7D", interval: "day", days: 7 },
  { key: "30d", label: "30D", interval: "day", days: 30 },
  { key: "90d", label: "90D", interval: "day", days: 90 },
  { key: "12m", label: "12M", interval: "month", days: 365 },
] as const;

type RangeKey = (typeof RANGES)[number]["key"];

function buildTimelineParams(rangeKey: RangeKey): TimelineParams {
  const range = RANGES.find((r) => r.key === rangeKey) ?? RANGES[1];
  const now = new Date();
  const from =
    range.interval === "month"
      ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1))
      : new Date(now.getTime() - (range.days - 1) * DAY_MS);
  return {
    interval: range.interval,
    from: toISODate(from),
    to: toISODate(now),
  };
}

export default function DashboardPage() {
  const [rangeKey, setRangeKey] = useState<RangeKey>("30d");
  const timelineParams = useMemo(
    () => buildTimelineParams(rangeKey),
    [rangeKey],
  );

  const overview = useGetOverviewQuery();
  const timeline = useGetTimelineQuery(timelineParams);
  const perDoctor = useGetPatientsPerDoctorQuery(8);
  const distributions = useGetDistributionsQuery();

  const stats = overview.data;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="An overview of your doctors, patients and activity."
      />

      <section
        aria-label="Key metrics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
      >
        <StatCard
          label="Total doctors"
          value={stats?.totalDoctors}
          hint={`+${stats?.newDoctorsLast30Days ?? 0} in 30 days`}
          icon={Stethoscope}
          tone="brand"
          loading={overview.isLoading}
        />
        <StatCard
          label="Total patients"
          value={stats?.totalPatients}
          hint={`+${stats?.newPatientsLast30Days ?? 0} in 30 days`}
          icon={Users}
          tone="blue"
          loading={overview.isLoading}
        />
        <StatCard
          label="Avg. patients / doctor"
          value={stats?.averagePatientsPerDoctor}
          icon={TrendingUp}
          tone="violet"
          loading={overview.isLoading}
        />
        <StatCard
          label="New patients (30d)"
          value={stats?.newPatientsLast30Days}
          icon={UserPlus}
          tone="amber"
          loading={overview.isLoading}
        />
        <StatCard
          label="Patients today"
          value={stats?.patientsToday}
          icon={CalendarPlus}
          tone="rose"
          loading={overview.isLoading}
        />
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <ChartCard
          className="xl:col-span-2"
          title="Growth over time"
          subtitle="New doctors and patients"
          loading={timeline.isLoading}
          error={timeline.isError}
          onRetry={timeline.refetch}
          action={
            <div
              role="group"
              aria-label="Date range"
              className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5"
            >
              {RANGES.map((range) => (
                <button
                  key={range.key}
                  type="button"
                  onClick={() => setRangeKey(range.key)}
                  aria-pressed={rangeKey === range.key}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                    rangeKey === range.key
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900",
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          }
        >
          {timeline.data && (
            <TimelineChart
              data={timeline.data.series}
              interval={timeline.data.interval}
            />
          )}
        </ChartCard>

        <ChartCard
          title="Patients per doctor"
          subtitle="Top doctors by patient load"
          loading={perDoctor.isLoading}
          error={perDoctor.isError}
          empty={perDoctor.data?.length === 0}
          onRetry={perDoctor.refetch}
        >
          {perDoctor.data && <PatientsPerDoctorChart data={perDoctor.data} />}
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Patients by condition"
          subtitle="Most common conditions"
          loading={distributions.isLoading}
          error={distributions.isError}
          empty={distributions.data?.patientsByCondition.length === 0}
          onRetry={distributions.refetch}
        >
          {distributions.data && (
            <DonutChart
              data={distributions.data.patientsByCondition}
              label="Patients by condition"
            />
          )}
        </ChartCard>

        <ChartCard
          title="Patients by gender"
          subtitle="Demographic split"
          loading={distributions.isLoading}
          error={distributions.isError}
          empty={distributions.data?.patientsByGender.length === 0}
          onRetry={distributions.refetch}
        >
          {distributions.data && (
            <DonutChart
              data={distributions.data.patientsByGender}
              label="Patients by gender"
              formatLabel={capitalize}
            />
          )}
        </ChartCard>

        <ChartCard
          className="lg:col-span-2"
          title="Doctors by specialization"
          subtitle="Staff distribution"
          loading={distributions.isLoading}
          error={distributions.isError}
          empty={distributions.data?.doctorsBySpecialization.length === 0}
          onRetry={distributions.refetch}
        >
          {distributions.data && (
            <DistributionBarChart
              data={distributions.data.doctorsBySpecialization}
              label="Doctors by specialization"
            />
          )}
        </ChartCard>
      </div>
    </>
  );
}
