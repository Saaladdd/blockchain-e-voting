"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { mockElections, getActiveElections, type Election } from "@/lib/elections"

interface ElectionContextType {
  selectedElection: Election | null
  setSelectedElection: (election: Election | null) => void
  availableElections: Election[]
  isLoading: boolean
}

const ElectionContext = createContext<ElectionContextType | undefined>(undefined)

export function ElectionProvider({ children }: { children: ReactNode }) {
  const [selectedElection, setSelectedElection] = useState<Election | null>(null)
  const [availableElections, setAvailableElections] = useState<Election[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize with available elections
    const elections = mockElections.filter(
      (election) => election.status === "active" || election.status === "setup" || election.status === "completed",
    )
    setAvailableElections(elections)

    // Set default to first active election
    const activeElections = getActiveElections()
    if (activeElections.length > 0 && !selectedElection) {
      setSelectedElection(activeElections[0])
    } else if (elections.length > 0 && !selectedElection) {
      setSelectedElection(elections[0])
    }

    setIsLoading(false)
  }, [selectedElection])

  return (
    <ElectionContext.Provider
      value={{
        selectedElection,
        setSelectedElection,
        availableElections,
        isLoading,
      }}
    >
      {children}
    </ElectionContext.Provider>
  )
}

export function useElection() {
  const context = useContext(ElectionContext)
  if (context === undefined) {
    throw new Error("useElection must be used within an ElectionProvider")
  }
  return context
}
