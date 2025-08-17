"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Trophy, TrendingUp } from "lucide-react"
import type { PartyResults } from "@/lib/admin-data"

interface ElectionResultsProps {
  results: PartyResults[]
}

export function ElectionResults({ results }: ElectionResultsProps) {
  const totalVotes = results.reduce((sum, party) => sum + party.votes, 0)
  const sortedResults = [...results].sort((a, b) => b.votes - a.votes)

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Election Results Summary
          </CardTitle>
          <CardDescription>Live results and party performance overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedResults.map((party, index) => (
              <div key={party.partyId} className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{party.partyName}</span>
                      <Badge variant="outline" style={{ borderColor: party.color, color: party.color }}>
                        {party.symbol}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{party.votes.toLocaleString()} votes</div>
                      <div className="text-sm text-muted-foreground">{party.percentage}%</div>
                    </div>
                  </div>
                  <Progress value={party.percentage} className="mt-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Vote Distribution</CardTitle>
            <CardDescription>Votes received by each party</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedResults} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="symbol" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                    formatter={(value: number) => [value.toLocaleString(), "Votes"]}
                  />
                  <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
                    {sortedResults.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Vote Share</CardTitle>
            <CardDescription>Percentage distribution of votes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={results}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ symbol, percentage }) => `${symbol}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="votes"
                  >
                    {results.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                    formatter={(value: number) => [value.toLocaleString(), "Votes"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Detailed Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <h4 className="font-semibold">Leading Party</h4>
              <p className="text-sm text-muted-foreground">
                {sortedResults[0]?.partyName} with {sortedResults[0]?.percentage}% of votes
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <h4 className="font-semibold">Total Votes Cast</h4>
              <p className="text-sm text-muted-foreground">{totalVotes.toLocaleString()} votes recorded</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <h4 className="font-semibold">Margin of Victory</h4>
              <p className="text-sm text-muted-foreground">
                {sortedResults[0] && sortedResults[1]
                  ? `${(sortedResults[0].percentage - sortedResults[1].percentage).toFixed(1)}% lead`
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
