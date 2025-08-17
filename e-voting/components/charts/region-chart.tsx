"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface RegionChartProps {
  data: { region: string; votes: number; percentage: number }[]
  color: string
}

const REGION_COLORS = ["#6366f1", "#8b5cf6", "#ec4899"]

export function RegionChart({ data }: RegionChartProps) {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="votes">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={REGION_COLORS[index % REGION_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            formatter={(value: number, name: string) => [
              `${value.toLocaleString()} votes`,
              name.charAt(0).toUpperCase() + name.slice(1),
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
