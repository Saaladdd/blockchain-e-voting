"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { ElectionOverview } from "@/lib/admin-data"

interface ElectionOverviewChartProps {
  data: ElectionOverview
}

export function ElectionOverviewChart({ data }: ElectionOverviewChartProps) {
  const chartData = [
    {
      category: "Registered",
      count: data.totalRegisteredVoters,
      percentage: 100,
    },
    {
      category: "Verified",
      count: data.totalVerifiedVoters,
      percentage: (data.totalVerifiedVoters / data.totalRegisteredVoters) * 100,
    },
    {
      category: "Voted",
      count: data.totalVotesCast,
      percentage: data.turnoutPercentage,
    },
  ]

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="category" className="text-xs fill-muted-foreground" />
          <YAxis className="text-xs fill-muted-foreground" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            formatter={(value: number) => [value.toLocaleString(), "Count"]}
          />
          <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
