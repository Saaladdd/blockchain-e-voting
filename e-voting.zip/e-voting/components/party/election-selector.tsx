"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Users, Vote, Clock } from "lucide-react"
import { mockElections, type Election } from "@/lib/elections"

interface ElectionSelectorProps {
  selectedElection: Election | null
  onElectionChange: (election: Election) => void
}

export function ElectionSelector({ selectedElection, onElectionChange }: ElectionSelectorProps) {
  // Show elections that parties can participate in (active, setup, or completed)
  const availableElections = mockElections.filter(
    (election) => election.status === "active" || election.status === "setup" || election.status === "completed",
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

  const getTimeInfo = (election: Election) => {
    const now = new Date()
    if (election.status === "completed") {
      return `Ended ${election.endDate.toLocaleDateString()}`
    } else if (election.status === "setup") {
      return `Starts ${election.startDate.toLocaleDateString()}`
    } else if (election.status === "active") {
      const diff = election.endDate.getTime() - now.getTime()
      if (diff <= 0) return "Ending soon"

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      if (hours > 0) {
        return `${hours}h ${minutes}m remaining`
      }
      return `${minutes}m remaining`
    }
    return ""
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Vote className="h-5 w-5" />
          Election Performance
        </CardTitle>
        <CardDescription>View your party's performance in different elections</CardDescription>
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
                  <span>Type: {selectedElection.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{getTimeInfo(selectedElection)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Voters: {selectedElection.statistics.totalRegisteredVoters.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Vote className="h-4 w-4 text-muted-foreground" />
                  <span>Votes: {selectedElection.statistics.totalVotesCast.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {availableElections.length === 0 && (
            <div className="text-center py-8">
              <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-muted-foreground">No Elections Available</h3>
              <p className="text-sm text-muted-foreground">There are currently no elections to view performance for.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
