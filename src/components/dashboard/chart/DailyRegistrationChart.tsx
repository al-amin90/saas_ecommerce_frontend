"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";

type Props = {
  data: { date: string; patients: number }[];
};

export default function DailyRegistrationChart({ data }: Props) {
  const formatted = data.map((d) => ({
    ...d,
    label: format(parseISO(d.date), "MMM d"),
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart
        data={formatted}
        margin={{ top: 4, right: 8, left: -16, bottom: 4 }}
      >
        <defs>
          <linearGradient id="patientGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e2e8f0"
          strokeOpacity={0.6}
        />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />

        <Tooltip
          contentStyle={{
            background: "#1e293b",
            border: "none",
            borderRadius: "0.75rem",
            color: "#f1f5f9",
            fontSize: 13,
            boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
          }}
          formatter={(v) => [v || 0, "Patients"]}
        />

        <Area
          type="monotone"
          dataKey="patients"
          stroke="#3b82f6"
          strokeWidth={2.5}
          fill="url(#patientGrad)"
          dot={{ fill: "#3b82f6", r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
