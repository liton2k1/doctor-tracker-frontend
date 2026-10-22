"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  DistributionItem,
  PatientsPerDoctorItem,
  TimelineInterval,
  TimelinePoint,
} from "@/types";

export const CHART_COLORS = [
  "#0d9488",
  "#6366f1",
  "#f59e0b",
  "#ec4899",
  "#0ea5e9",
  "#84cc16",
  "#a855f7",
  "#f97316",
];

const AXIS_STYLE = { fontSize: 12, fill: "#64748b" };
const TOOLTIP_STYLE = {
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 12px rgb(15 23 42 / 0.08)",
  fontSize: 12,
};

const formatBucket = (value: string, interval: TimelineInterval): string => {
  const date = new Date(
    interval === "day" ? `${value}T00:00:00Z` : `${value}-01T00:00:00Z`,
  );
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    ...(interval === "day" ? { day: "numeric" } : { year: "2-digit" }),
  }).format(date);
};

export function TimelineChart({
  data,
  interval,
}: {
  data: TimelinePoint[];
  interval: TimelineInterval;
}) {
  return (
    <div
      className="h-[300px] w-full"
      role="img"
      aria-label="Doctors and patients added over time"
    >
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
        >
          <defs>
            <linearGradient id="grad-patients" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0d9488" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="grad-doctors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={(value: string) => formatBucket(value, interval)}
            tick={AXIS_STYLE}
            tickLine={false}
            axisLine={false}
            minTickGap={24}
          />
          <YAxis
            allowDecimals={false}
            tick={AXIS_STYLE}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            labelFormatter={(value: string) => formatBucket(value, interval)}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="patients"
            name="Patients"
            stroke="#0d9488"
            strokeWidth={2}
            fill="url(#grad-patients)"
          />
          <Area
            type="monotone"
            dataKey="doctors"
            name="Doctors"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#grad-doctors)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PatientsPerDoctorChart({
  data,
}: {
  data: PatientsPerDoctorItem[];
}) {
  return (
    <div
      className="h-[300px] w-full"
      role="img"
      aria-label="Patients per doctor"
    >
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
            horizontal={false}
          />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={AXIS_STYLE}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={AXIS_STYLE}
            tickLine={false}
            axisLine={false}
            tickFormatter={(name: string) =>
              name.length > 16 ? `${name.slice(0, 15)}…` : name
            }
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "#f1f5f9" }} />
          <Bar
            dataKey="patientCount"
            name="Patients"
            fill="#0d9488"
            radius={[0, 6, 6, 0]}
            barSize={18}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DonutChart({
  data,
  label,
  formatLabel,
}: {
  data: DistributionItem[];
  label: string;
  formatLabel?: (value: string) => string;
}) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div
      className="flex flex-col items-center gap-4 sm:flex-row"
      role="img"
      aria-label={label}
    >
      <div className="relative h-[200px] w-[200px] shrink-0">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="label"
              innerRadius={62}
              outerRadius={90}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((item, index) => (
                <Cell
                  key={item.label}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tabular-nums text-slate-900">
            {total}
          </span>
          <span className="text-xs text-slate-500">total</span>
        </div>
      </div>
      <ul className="w-full space-y-2 text-sm">
        {data.map((item, index) => (
          <li
            key={item.label}
            className="flex items-center justify-between gap-3"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                  background: CHART_COLORS[index % CHART_COLORS.length],
                }}
              />
              <span className="truncate text-slate-700">
                {formatLabel ? formatLabel(item.label) : item.label}
              </span>
            </span>
            <span className="tabular-nums text-slate-500">
              {item.count}{" "}
              <span className="text-xs text-slate-400">
                ({total ? Math.round((item.count / total) * 100) : 0}%)
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DistributionBarChart({
  data,
  label,
}: {
  data: DistributionItem[];
  label: string;
}) {
  return (
    <div className="h-[260px] w-full" role="img" aria-label={label}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={AXIS_STYLE}
            tickLine={false}
            axisLine={false}
            interval={0}
            tickFormatter={(value: string) =>
              value.length > 9 ? `${value.slice(0, 8)}…` : value
            }
          />
          <YAxis
            allowDecimals={false}
            tick={AXIS_STYLE}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "#f1f5f9" }} />
          <Bar
            dataKey="count"
            name="Doctors"
            radius={[6, 6, 0, 0]}
            maxBarSize={36}
          >
            {data.map((item, index) => (
              <Cell
                key={item.label}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
