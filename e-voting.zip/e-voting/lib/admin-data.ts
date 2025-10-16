export interface VoterApplication {
  id: string
  name: string
  nationalId: string
  walletAddress: string
  status: "pending" | "approved" | "rejected"
  appliedAt: Date
  reviewedAt?: Date
  reviewedBy?: string
}

export interface PartyCredentials {
  partyId: string
  username: string
  password: string
  createdAt: Date
  isActive: boolean
}

export interface ElectionOverview {
  totalRegisteredVoters: number
  totalVerifiedVoters: number
  totalVotesCast: number
  turnoutPercentage: number
  partiesCount: number
  electionStatus: "setup" | "active" | "completed"
  startTime: Date
  endTime: Date
}

export interface PartyResults {
  partyId: string
  partyName: string
  symbol: string
  votes: number
  percentage: number
  color: string
}

// Mock data for admin
export const mockVoterApplications: VoterApplication[] = [
  {
    id: "app-1",
    name: "John Smith",
    nationalId: "ID123456789",
    walletAddress: "0x1234...5678",
    status: "pending",
    appliedAt: new Date("2024-01-14T10:30:00Z"),
  },
  {
    id: "app-2",
    name: "Sarah Johnson",
    nationalId: "ID987654321",
    walletAddress: "0x9876...4321",
    status: "approved",
    appliedAt: new Date("2024-01-14T09:15:00Z"),
    reviewedAt: new Date("2024-01-14T11:00:00Z"),
    reviewedBy: "Admin User",
  },
  {
    id: "app-3",
    name: "Mike Wilson",
    nationalId: "ID456789123",
    walletAddress: "0x4567...8901",
    status: "pending",
    appliedAt: new Date("2024-01-14T12:45:00Z"),
  },
  {
    id: "app-4",
    name: "Emma Davis",
    nationalId: "ID789123456",
    walletAddress: "0x7891...2345",
    status: "rejected",
    appliedAt: new Date("2024-01-13T16:20:00Z"),
    reviewedAt: new Date("2024-01-14T08:30:00Z"),
    reviewedBy: "Admin User",
  },
]

export const mockPartyCredentials: PartyCredentials[] = [
  {
    partyId: "party-1",
    username: "progressive_alliance",
    password: "PA2024!Secure",
    createdAt: new Date("2024-01-10T10:00:00Z"),
    isActive: true,
  },
  {
    partyId: "party-2",
    username: "unity_coalition",
    password: "UC2024!Strong",
    createdAt: new Date("2024-01-10T10:15:00Z"),
    isActive: true,
  },
]

export const mockElectionOverview: ElectionOverview = {
  totalRegisteredVoters: 125000,
  totalVerifiedVoters: 118500,
  totalVotesCast: 87500,
  turnoutPercentage: 73.8,
  partiesCount: 4,
  electionStatus: "active",
  startTime: new Date("2024-01-15T08:00:00Z"),
  endTime: new Date("2024-01-15T20:00:00Z"),
}

export const mockPartyResults: PartyResults[] = [
  {
    partyId: "party-1",
    partyName: "Progressive Alliance",
    symbol: "PA",
    votes: 28500,
    percentage: 32.6,
    color: "#3b82f6",
  },
  {
    partyId: "party-2",
    partyName: "Unity Coalition",
    symbol: "UC",
    votes: 24100,
    percentage: 27.5,
    color: "#10b981",
  },
  {
    partyId: "party-3",
    partyName: "Democratic Reform",
    symbol: "DR",
    votes: 19800,
    percentage: 22.6,
    color: "#f59e0b",
  },
  {
    partyId: "party-4",
    partyName: "Conservative Foundation",
    symbol: "CF",
    votes: 15100,
    percentage: 17.3,
    color: "#ef4444",
  },
]

// Mock functions for admin operations
export const approveVoter = async (applicationId: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  // In real app, would update database
}

export const rejectVoter = async (applicationId: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  // In real app, would update database
}

export const createParty = async (partyData: {
  name: string
  symbol: string
  description: string
  logo?: string
}): Promise<{ party: any; credentials: PartyCredentials }> => {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const partyId = `party-${Date.now()}`
  const credentials: PartyCredentials = {
    partyId,
    username: partyData.name.toLowerCase().replace(/\s+/g, "_"),
    password: `${partyData.symbol}${new Date().getFullYear()}!${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date(),
    isActive: true,
  }

  return {
    party: { id: partyId, ...partyData },
    credentials,
  }
}
