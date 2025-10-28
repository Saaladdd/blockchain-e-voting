"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import type { Election } from "@/lib/elections"

interface AddElectionFormProps {
  onElectionAdded: (election: Election) => void
}

export function AddElectionForm({ onElectionAdded }: AddElectionFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newElection: Election = {
      id: Date.now().toString(),
      name: formData.name,
    }   

    onElectionAdded(newElection)
    setFormData({ name: "", type: "presidential", startDate: "", endDate: "" })
    setIsOpen(true)
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Election
      </Button>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Election</CardTitle>
        <CardDescription>Create a new election for the system</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Election Name</Label>
            <Input
              id="name"
              placeholder="e.g., Presidential Election 2024"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Create Election
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
