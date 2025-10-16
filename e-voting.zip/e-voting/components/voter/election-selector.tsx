"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Users, Vote, Clock } from "lucide-react"
import { mockElections, getActiveElections, type Election } from "@/lib/elections"
import  WalletConnectButton from "@/components/voter/WallectConnectButton";

interface ElectionSelectorProps {
  selectedElection: Election | null
  onElectionChange: (election: Election) => void
}

export function ElectionSelector({ selectedElection, onElectionChange }: ElectionSelectorProps) {
  const activeElections = getActiveElections()
  const availableElections = mockElections.filter(
    (election) => election.status === "active" || election.status === "setup",
  )

  const getStatusColor = (status: Election["status"]) => {
    switch (status) {
      case "active":
        return "default"
      case "setup":
        return "outline"
      case "completed":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getTimeRemaining = (endDate: Date) => {
    const now = new Date()
    const diff = endDate.getTime() - now.getTime()

    if (diff <= 0) return "Ended"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`
    }
    return `${minutes}m remaining`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Vote className="h-5 w-5" />
          Select Election
        </CardTitle>
        <CardDescription>Choose which election you want to participate in</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select
            value={selectedElection?.id || ""}
            onValueChange={(value) => {
              const election = availableElections.find((e) => e.id === value)
              if (election) onElectionChange(election)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an election" />
            </SelectTrigger>
            <SelectContent>
              {availableElections.map((election) => (
                <SelectItem key={election.id} value={election.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{election.name}</span>
                    <Badge variant={getStatusColor(election.status)} className="ml-2">
                      {election.status}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedElection && (
            <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{selectedElection.name}</h4>
                <Badge variant={getStatusColor(selectedElection.status)}>{selectedElection.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{selectedElection.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Start: {selectedElection.startDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>End: {selectedElection.endDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Registered: {selectedElection.statistics.totalRegisteredVoters.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{getTimeRemaining(selectedElection.endDate)}</span>
                </div>
              </div>
              {selectedElection.status === "setup" && (
                <div className="rounded-md bg-yellow-50 dark:bg-yellow-950 p-3 border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    This election is in setup phase. Voting will begin on{" "}
                    {selectedElection.startDate.toLocaleDateString()}.
                  </p>
                </div>
              )}
            </div>
          )}

          {availableElections.length === 0 && (
            <div className="text-center py-8">
              <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-muted-foreground">No Active Elections</h3>
              <p className="text-sm text-muted-foreground">There are currently no elections available for voting.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
