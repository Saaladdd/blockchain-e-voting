"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Calendar, Users, Vote } from "lucide-react"
import { mockElections, createElection, type Election } from "@/lib/elections"

interface ElectionSelectorProps {
  selectedElection: Election | null
  onElectionChange: (election: Election) => void
}

export function ElectionSelector({ selectedElection, onElectionChange }: ElectionSelectorProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newElection, setNewElection] = useState({
    name: "",
    description: "",
    type: "presidential" as Election["type"],
    startDate: "",
    endDate: "",
  })

  const handleCreateElection = async () => {
    if (!newElection.name || !newElection.startDate || !newElection.endDate) return

    setIsCreating(true)
    try {
      const election = await createElection({
        name: newElection.name,
        description: newElection.description,
        type: newElection.type,
        status: "draft",
        startDate: new Date(newElection.startDate),
        endDate: new Date(newElection.endDate),
        createdBy: "admin-1",
        settings: {
          allowMultipleVotes: false,
          requireVerification: true,
          enableBlockchain: true,
        },
      })

      onElectionChange(election)
      setIsCreateDialogOpen(false)
      setNewElection({
        name: "",
        description: "",
        type: "presidential",
        startDate: "",
        endDate: "",
      })
    } catch (error) {
      console.error("Error creating election:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const getStatusColor = (status: Election["status"]) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "setup":
        return "outline"
      case "draft":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Vote className="h-5 w-5" />
              Election Management
            </CardTitle>
            <CardDescription>Select or create elections to manage</CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Election
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Election</DialogTitle>
                <DialogDescription>Set up a new election with basic information</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Election Name</Label>
                  <Input
                    id="name"
                    value={newElection.name}
                    onChange={(e) => setNewElection({ ...newElection, name: e.target.value })}
                    placeholder="e.g., 2024 Presidential Election"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newElection.description}
                    onChange={(e) => setNewElection({ ...newElection, description: e.target.value })}
                    placeholder="Brief description of the election"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Election Type</Label>
                  <Select
                    value={newElection.type}
                    onValueChange={(value: Election["type"]) => setNewElection({ ...newElection, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presidential">Presidential</SelectItem>
                      <SelectItem value="parliamentary">Parliamentary</SelectItem>
                      <SelectItem value="local">Local</SelectItem>
                      <SelectItem value="referendum">Referendum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={newElection.startDate}
                      onChange={(e) => setNewElection({ ...newElection, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={newElection.endDate}
                      onChange={(e) => setNewElection({ ...newElection, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateElection} disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create Election"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Current Election</Label>
            <Select
              value={selectedElection?.id || ""}
              onValueChange={(value) => {
                const election = mockElections.find((e) => e.id === value)
                if (election) onElectionChange(election)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an election" />
              </SelectTrigger>
              <SelectContent>
                {mockElections.map((election) => (
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
          </div>

          {selectedElection && (
            <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{selectedElection.name}</h4>
                <Badge variant={getStatusColor(selectedElection.status)}>{selectedElection.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{selectedElection.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
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
                  <span>Voters: {selectedElection.statistics.totalRegisteredVoters.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Vote className="h-4 w-4 text-muted-foreground" />
                  <span>Votes: {selectedElection.statistics.totalVotesCast.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
