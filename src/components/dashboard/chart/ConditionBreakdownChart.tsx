"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Props = {
  data: { condition: string; count: number }[];
};

const COLORS = [
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#10b981",
];

export default function ConditionBreakdownChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="condition"
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={3}
          strokeWidth={0}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#1e293b",
            border: "none",
            borderRadius: "0.75rem",
            color: "#f1f5f9",
            fontSize: 13,
            boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
          }}
          formatter={(v, name) => [v || 0, name]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(val) => (
            <span style={{ fontSize: 11, color: "#94a3b8" }}>{val}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
