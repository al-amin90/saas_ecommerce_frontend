"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type Props = {
  data: { doctorName: string; count: number }[];
};

const COLORS = [
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
];

export default function PatientsPerDoctorChart({ data }: Props) {
  const trimmed = data.map((d) => ({
    ...d,
    name: "Al amin",
    // name: d?.doctorName.split(" ").slice(0, 2).join(" "),
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={trimmed}
        margin={{ top: 4, right: 8, left: -16, bottom: 4 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e2e8f0"
          strokeOpacity={0.6}
        />
        <XAxis
          dataKey="name"
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
          cursor={{ fill: "#3b82f610" }}
          formatter={(value) => [value || 0, "Patients"]}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {trimmed.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
