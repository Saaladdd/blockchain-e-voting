"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Vote, Calendar, Clock } from "lucide-react"
import { useElection } from "@/lib/election-context"
import type { Election } from "@/lib/elections"

export function ElectionSwitcher() {
  const { selectedElection, setSelectedElection, availableElections } = useElection()

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
      if (hours > 24) {
        const days = Math.floor(hours / 24)
        return `${days}d remaining`
      } else if (hours > 0) {
        return `${hours}h remaining`
      }
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      return `${minutes}m remaining`
    }
    return ""
  }

  if (!selectedElection || availableElections.length <= 1) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-2 hover:bg-muted/50">
          <div className="flex items-center gap-2 text-left">
            <Vote className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate max-w-[120px]">{selectedElection.name}</span>
                <Badge variant={getStatusColor(selectedElection.status)} className="text-xs">
                  {selectedElection.status}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">{getTimeInfo(selectedElection)}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        <DropdownMenuLabel>Switch Election</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableElections.map((election) => (
          <DropdownMenuItem
            key={election.id}
            onClick={() => setSelectedElection(election)}
            className="flex flex-col items-start gap-2 p-3 cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-medium">{election.name}</span>
              <Badge variant={getStatusColor(election.status)} className="text-xs">
                {election.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{election.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{election.startDate.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{getTimeInfo(election)}</span>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
