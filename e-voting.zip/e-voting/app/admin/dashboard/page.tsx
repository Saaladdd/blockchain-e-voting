"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, LogOut, Users, Vote, TrendingUp, Settings, Plus, BarChart3 } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { mockElectionOverview, mockPartyResults } from "@/lib/admin-data"
import { mockElections, getElectionResults, type Election } from "@/lib/elections"
import { ElectionOverviewChart } from "@/components/admin/election-overview-chart"
import { PartyManagement } from "@/components/admin/party-management"
import { VoterManagement } from "@/components/admin/voter-management"
import { ElectionResults } from "@/components/admin/election-results"
import { ElectionSelector } from "@/components/admin/election-selector"

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [selectedElection, setSelectedElection] = useState<Election | null>(mockElections[0] || null)
  const [electionResults, setElectionResults] = useState(mockPartyResults)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/admin/login")
      return
    }
  }, [user, router])

  useEffect(() => {
    if (selectedElection) {
      getElectionResults(selectedElection.id).then(setElectionResults)
    }
  }, [selectedElection])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user) return null

  const currentStats = selectedElection?.statistics || mockElectionOverview

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-serif font-semibold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  {selectedElection ? selectedElection.name : "Election Management System"}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <ElectionSelector selectedElection={selectedElection} onElectionChange={setSelectedElection} />
        </div>

        {/* Key Metrics */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Voters</p>
                  <p className="text-2xl font-bold">{currentStats.totalRegisteredVoters.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Votes Cast</p>
                  <p className="text-2xl font-bold">{currentStats.totalVotesCast.toLocaleString()}</p>
                </div>
                <Vote className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Turnout</p>
                  <p className="text-2xl font-bold">{currentStats.turnoutPercentage}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={selectedElection?.status === "active" ? "default" : "secondary"}>
                    {selectedElection?.status || "No Election"}
                  </Badge>
                </div>
                <Settings className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="parties" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Parties
            </TabsTrigger>
            <TabsTrigger value="voters" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Voters
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <Vote className="h-4 w-4" />
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Election Timeline</CardTitle>
                  <CardDescription>
                    {selectedElection ? `${selectedElection.name} status and timeline` : "No election selected"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedElection ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Start Time</span>
                        <span className="text-sm text-muted-foreground">
                          {selectedElection.startDate.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">End Time</span>
                        <span className="text-sm text-muted-foreground">
                          {selectedElection.endDate.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Type</span>
                        <span className="text-sm text-muted-foreground capitalize">{selectedElection.type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status</span>
                        <Badge variant={selectedElection.status === "active" ? "default" : "secondary"}>
                          {selectedElection.status}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Please select an election to view details</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Voter Statistics</CardTitle>
                  <CardDescription>Voter registration and participation metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ElectionOverviewChart data={currentStats} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="parties">
            <PartyManagement />
          </TabsContent>

          <TabsContent value="voters">
            <VoterManagement />
          </TabsContent>

          <TabsContent value="results">
            <ElectionResults results={electionResults} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
