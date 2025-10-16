export interface Election {
  id: string
  name: string
  description: string
  type: "presidential" | "parliamentary" | "local" | "referendum"
  status: "draft" | "setup" | "active" | "completed" | "cancelled"
  startDate: Date
  endDate: Date
  createdAt: Date
  createdBy: string
  settings: {
    allowMultipleVotes: boolean
    requireVerification: boolean
    enableBlockchain: boolean
  }
  statistics: {
    totalRegisteredVoters: number
    totalVerifiedVoters: number
    totalVotesCast: number
    turnoutPercentage: number
    partiesCount: number
  }
}

export interface ElectionParty {
  electionId: string
  partyId: string
  isActive: boolean
  registeredAt: Date
}

export interface ElectionVote extends Vote {
  electionId: string
}

// Mock elections data
export const mockElections: Election[] = [
  {
    id: "election-1",
    name: "2024 Presidential Election",
    description: "National presidential election to elect the next president",
    type: "presidential",
    status: "active",
    startDate: new Date("2024-01-15T08:00:00Z"),
    endDate: new Date("2024-01-15T20:00:00Z"),
    createdAt: new Date("2024-01-01T10:00:00Z"),
    createdBy: "admin-1",
    settings: {
      allowMultipleVotes: false,
      requireVerification: true,
      enableBlockchain: true,
    },
    statistics: {
      totalRegisteredVoters: 125000,
      totalVerifiedVoters: 118500,
      totalVotesCast: 87500,
      turnoutPercentage: 73.8,
      partiesCount: 4,
    },
  },
  {
    id: "election-2",
    name: "2024 Parliamentary Election",
    description: "Election for parliamentary representatives",
    type: "parliamentary",
    status: "setup",
    startDate: new Date("2024-03-20T08:00:00Z"),
    endDate: new Date("2024-03-20T20:00:00Z"),
    createdAt: new Date("2024-01-10T14:30:00Z"),
    createdBy: "admin-1",
    settings: {
      allowMultipleVotes: false,
      requireVerification: true,
      enableBlockchain: true,
    },
    statistics: {
      totalRegisteredVoters: 0,
      totalVerifiedVoters: 0,
      totalVotesCast: 0,
      turnoutPercentage: 0,
      partiesCount: 0,
    },
  },
  {
    id: "election-3",
    name: "2023 Local Council Election",
    description: "Municipal council election for local governance",
    type: "local",
    status: "completed",
    startDate: new Date("2023-11-15T08:00:00Z"),
    endDate: new Date("2023-11-15T18:00:00Z"),
    createdAt: new Date("2023-10-01T09:00:00Z"),
    createdBy: "admin-1",
    settings: {
      allowMultipleVotes: false,
      requireVerification: true,
      enableBlockchain: true,
    },
    statistics: {
      totalRegisteredVoters: 45000,
      totalVerifiedVoters: 42000,
      totalVotesCast: 31500,
      turnoutPercentage: 75.0,
      partiesCount: 6,
    },
  },
]

// Election management functions
export const createElection = async (
  electionData: Omit<Election, "id" | "createdAt" | "statistics">,
): Promise<Election> => {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const election: Election = {
    ...electionData,
    id: `election-${Date.now()}`,
    createdAt: new Date(),
    statistics: {
      totalRegisteredVoters: 0,
      totalVerifiedVoters: 0,
      totalVotesCast: 0,
      turnoutPercentage: 0,
      partiesCount: 0,
    },
  }

  return election
}

export const updateElection = async (electionId: string, updates: Partial<Election>): Promise<Election> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const existingElection = mockElections.find((e) => e.id === electionId)
  if (!existingElection) {
    throw new Error("Election not found")
  }

  return { ...existingElection, ...updates }
}

export const deleteElection = async (electionId: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  // In real app, would delete from database
}

export const getElectionById = (electionId: string): Election | undefined => {
  return mockElections.find((election) => election.id === electionId)
}

export const getActiveElections = (): Election[] => {
  return mockElections.filter((election) => election.status === "active")
}

export const getElectionsByStatus = (status: Election["status"]): Election[] => {
  return mockElections.filter((election) => election.status === status)
}

export const getElectionResults = async (electionId: string): Promise<PartyResults[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock results based on election
  if (electionId === "election-1") {
    return mockPartyResults
  } else if (electionId === "election-3") {
    // Different results for completed local election
    return [
      {
        partyId: "party-1",
        partyName: "Progressive Alliance",
        symbol: "PA",
        votes: 12500,
        percentage: 39.7,
        color: "#3b82f6",
      },
      {
        partyId: "party-2",
        partyName: "Unity Coalition",
        symbol: "UC",
        votes: 9800,
        percentage: 31.1,
        color: "#10b981",
      },
      {
        partyId: "party-3",
        partyName: "Democratic Reform",
        symbol: "DR",
        votes: 5200,
        percentage: 16.5,
        color: "#f59e0b",
      },
      {
        partyId: "party-4",
        partyName: "Conservative Foundation",
        symbol: "CF",
        votes: 4000,
        percentage: 12.7,
        color: "#ef4444",
      },
    ]
  }

  return []
}

// Import existing types
import type { Vote, PartyResults } from "./voting"
import { mockPartyResults } from "./admin-data"
