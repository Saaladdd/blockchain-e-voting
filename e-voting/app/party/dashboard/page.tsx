"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, TrendingUp, Award, Clock, MapPin, RefreshCw } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { getPartyStats, getPartyProfile, type PartyStats, type PartyProfile } from "@/lib/party-data"
import { mockElections, getElectionResults, type Election } from "@/lib/elections"
import { VoteChart } from "@/components/charts/vote-chart"
import { DemographicChart } from "@/components/charts/demographic-chart"
import { RegionChart } from "@/components/charts/region-chart"
import { ElectionSelector } from "@/components/party/election-selector"
import { Navbar } from "@/components/navigation/navbar"
import { blockchainService, type BlockchainVoteData } from "@/lib/blockchain"

export default function PartyDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [selectedElection, setSelectedElection] = useState<Election | null>(null)
  const [partyStats, setPartyStats] = useState<PartyStats | null>(null)
  const [partyProfile, setPartyProfile] = useState<PartyProfile | null>(null)
  const [liveVoteData, setLiveVoteData] = useState<BlockchainVoteData | null>(null)
  const [totalVotes, setTotalVotes] = useState<number>(0)
  const [electionResults, setElectionResults] = useState<any[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    if (!user || user.role !== "party") {
      router.push("/party/login")
      return
    }

    // Set default election to first active election
    const activeElections = mockElections.filter(
      (election) => election.status === "active" || election.status === "completed",
    )
    if (activeElections.length > 0 && !selectedElection) {
      setSelectedElection(activeElections[0])
    }

    // In a real app, this would be based on the authenticated party
    const partyId = user.partyId || "party-1"
    const stats = getPartyStats(partyId)
    const profile = getPartyProfile(partyId)

    setPartyStats(stats)
    setPartyProfile(profile)
  }, [user, router, selectedElection])

  useEffect(() => {
    if (selectedElection) {
      const partyId = user?.partyId || "party-1"
      fetchElectionSpecificData(selectedElection.id, partyId)

      const interval = setInterval(() => {
        fetchElectionSpecificData(selectedElection.id, partyId)
      }, 30000) // Update every 30 seconds

      return () => clearInterval(interval)
    }
  }, [selectedElection, user])

  const fetchElectionSpecificData = async (electionId: string, partyId: string) => {
    try {
      const [results, partyVotes, total] = await Promise.all([
        getElectionResults(electionId),
        blockchainService.getVoteCount(partyId, electionId),
        blockchainService.getTotalVotes(electionId),
      ])

      setElectionResults(results)
      setLiveVoteData({ partyId, voteCount: partyVotes })
      setTotalVotes(total)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("[v0] Error fetching election-specific data:", error)
    }
  }

  const handleRefresh = async () => {
    if ((!user?.partyId && !partyProfile) || !selectedElection) return

    setIsRefreshing(true)
    const partyId = user.partyId || "party-1"
    await fetchElectionSpecificData(selectedElection.id, partyId)
    setIsRefreshing(false)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user || !partyStats || !partyProfile) {
    return null
  }

  const currentPartyResult = electionResults.find((result) => result.partyId === (user.partyId || "party-1"))
  const liveVotePercentage =
    liveVoteData && totalVotes > 0
      ? Math.round((liveVoteData.voteCount / totalVotes) * 100)
      : currentPartyResult?.percentage || partyStats.percentage

  const currentRank =
    electionResults
      .sort((a, b) => b.votes - a.votes)
      .findIndex((result) => result.partyId === (user.partyId || "party-1")) + 1

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <Navbar role="party" title="Party Dashboard" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <ElectionSelector selectedElection={selectedElection} onElectionChange={setSelectedElection} />
        </div>

        {!selectedElection && (
          <Card className="mb-8">
            <CardContent className="pt-6 text-center">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-muted-foreground mb-2">No Election Selected</h3>
              <p className="text-sm text-muted-foreground">
                Please select an election above to view your party's performance.
              </p>
            </CardContent>
          </Card>
        )}

        {selectedElection && (
          <>
            {/* Live Data Header */}
            <Card className="mb-8 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950 transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                    <div>
                      <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                        Live Data - {selectedElection.name}
                      </h3>
                      <p className="text-sm text-blue-600 dark:text-blue-300">
                        Last updated: {lastUpdated.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="bg-transparent"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="mb-8 grid gap-6 md:grid-cols-4">
              <Card className="transition-all duration-200 hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Votes</p>
                      <p className="text-2xl font-bold">
                        {liveVoteData
                          ? liveVoteData.voteCount.toLocaleString()
                          : (currentPartyResult?.votes || partyStats.totalVotes).toLocaleString()}
                      </p>
                      {liveVoteData && (
                        <p className="text-xs text-green-600 dark:text-green-400">Live from blockchain</p>
                      )}
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all duration-200 hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Vote Share</p>
                      <p className="text-2xl font-bold">{liveVotePercentage}%</p>
                      {liveVoteData && <p className="text-xs text-green-600 dark:text-green-400">Live calculation</p>}
                    </div>
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all duration-200 hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Current Rank</p>
                      <p className="text-2xl font-bold">#{currentRank || partyStats.rank}</p>
                    </div>
                    <Award className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all duration-200 hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Election Status</p>
                      <Badge variant={selectedElection.status === "active" ? "default" : "secondary"}>
                        {selectedElection.status}
                      </Badge>
                    </div>
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Election-specific Performance Summary */}
            <Card className="mb-8 transition-all duration-200">
              <CardHeader>
                <CardTitle>Election Performance Summary</CardTitle>
                <CardDescription>Your party's performance in {selectedElection.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-border bg-muted/50 p-4 transition-colors duration-200">
                    <h4 className="font-semibold">Election Type</h4>
                    <p className="text-sm text-muted-foreground capitalize">{selectedElection.type}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/50 p-4 transition-colors duration-200">
                    <h4 className="font-semibold">Turnout Rate</h4>
                    <p className="text-sm text-muted-foreground">{selectedElection.statistics.turnoutPercentage}%</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/50 p-4 transition-colors duration-200">
                    <h4 className="font-semibold">Total Participants</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedElection.statistics.totalVotesCast.toLocaleString()} voters
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Party Information */}
            <Card className="mb-8 transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <img
                    src={partyProfile.logo || "/placeholder.svg"}
                    alt={`${partyProfile.name} logo`}
                    className="h-6 w-6 rounded object-cover"
                  />
                  Party Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Party Details</h4>
                      <div className="mt-2 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Symbol:</span>
                          <Badge
                            variant="outline"
                            style={{ borderColor: partyProfile.color, color: partyProfile.color }}
                          >
                            {partyProfile.symbol}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Founded:</span>
                          <span>{partyProfile.founded}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Leader:</span>
                          <span>{partyProfile.leader}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Headquarters:</span>
                          <span>{partyProfile.headquarters}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Campaign Focus</h4>
                      <p className="mt-2 text-sm text-muted-foreground">{partyProfile.description}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{partyProfile.manifesto}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Charts Section */}
            <div className="mb-8 grid gap-6 lg:grid-cols-2">
              {/* Hourly Votes Chart */}
              <Card className="transition-all duration-200">
                <CardHeader>
                  <CardTitle>Hourly Vote Trends</CardTitle>
                  <CardDescription>Votes received throughout the day in {selectedElection.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <VoteChart data={partyStats.hourlyVotes} color={partyProfile.color} />
                </CardContent>
              </Card>

              {/* Demographic Breakdown */}
              <Card className="transition-all duration-200">
                <CardHeader>
                  <CardTitle>Age Demographics</CardTitle>
                  <CardDescription>Vote distribution by age group in {selectedElection.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <DemographicChart data={partyStats.demographicBreakdown} color={partyProfile.color} />
                </CardContent>
              </Card>
            </div>

            {/* Regional Breakdown */}
            <Card className="mb-8 transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Regional Performance
                </CardTitle>
                <CardDescription>Vote distribution across different regions in {selectedElection.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    {partyStats.regionBreakdown.map((region) => (
                      <div key={region.region} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{region.region}</span>
                          <span className="text-muted-foreground">
                            {region.votes.toLocaleString()} ({region.percentage}%)
                          </span>
                        </div>
                        <Progress value={region.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <RegionChart data={partyStats.regionBreakdown} color={partyProfile.color} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}
