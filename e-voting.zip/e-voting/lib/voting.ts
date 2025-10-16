export interface Party {
  id: string
  name: string
  symbol: string
  logo: string
  description: string
  manifesto: string
  color: string
}

export interface Vote {
  id: string
  voterId: string
  partyId: string
  electionId: string
  timestamp: Date
  transactionHash: string
}

export interface ElectionStatus {
  isActive: boolean
  startDate: Date
  endDate: Date
  totalVoters: number
  totalVotes: number
  turnoutPercentage: number
}

// Mock data for parties
export const mockParties: Party[] = [
  {
    id: "party-1",
    name: "Progressive Alliance",
    symbol: "PA",
    logo: "/progressive-party-logo.png",
    description: "Building a sustainable future through innovation and social progress.",
    manifesto: "Focus on renewable energy, education reform, and healthcare accessibility.",
    color: "#3b82f6",
  },
  {
    id: "party-2",
    name: "Unity Coalition",
    symbol: "UC",
    logo: "/unity-political-party-logo.png",
    description: "Bringing communities together for economic prosperity and social harmony.",
    manifesto: "Economic growth, infrastructure development, and community empowerment.",
    color: "#10b981",
  },
  {
    id: "party-3",
    name: "Democratic Reform",
    symbol: "DR",
    logo: "/democratic-reform-party-logo.png",
    description: "Transparent governance and democratic accountability for all citizens.",
    manifesto: "Government transparency, anti-corruption measures, and citizen participation.",
    color: "#f59e0b",
  },
  {
    id: "party-4",
    name: "Conservative Foundation",
    symbol: "CF",
    logo: "/conservative-political-logo.png",
    description: "Preserving traditional values while embracing responsible progress.",
    manifesto: "Fiscal responsibility, traditional values, and measured reform.",
    color: "#ef4444",
  },
]

// Mock election status
export const mockElectionStatus: ElectionStatus = {
  isActive: true,
  startDate: new Date("2024-01-15T08:00:00Z"),
  endDate: new Date("2024-01-15T20:00:00Z"),
  totalVoters: 125000,
  totalVotes: 87500,
  turnoutPercentage: 70,
}

import { blockchainService, type BlockchainElectionData } from "./blockchain"

// Mock voting functions
export const submitVoteForElection = async (electionId: string, voterId: string, partyId: string): Promise<Vote> => {
  try {
    // Submit vote to blockchain with election context
    const transactionHash = await blockchainService.submitVote(partyId, voterId, electionId)

    const vote: Vote = {
      id: `vote-${Date.now()}`,
      voterId,
      partyId,
      electionId,
      timestamp: new Date(),
      transactionHash,
    }

    // Store vote with election context
    if (typeof window !== "undefined") {
      localStorage.setItem(`vote-${electionId}-${voterId}`, JSON.stringify(vote))
    }

    return vote
  } catch (error) {
    console.error("Error submitting vote:", error)
    throw error
  }
}

export const getVoterStatusForElection = async (
  electionId: string,
  voterId: string,
): Promise<{ hasVoted: boolean; vote?: Vote }> => {
  try {
    // Check blockchain for specific election
    const hasVotedOnChain = await blockchainService.hasVoted(voterId, electionId)

    if (hasVotedOnChain && typeof window !== "undefined") {
      const stored = localStorage.getItem(`vote-${electionId}-${voterId}`)
      if (stored) {
        return { hasVoted: true, vote: JSON.parse(stored) }
      }
    }

    return { hasVoted: hasVotedOnChain }
  } catch (error) {
    console.error("Error checking voter status:", error)
    // Fallback to localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`vote-${electionId}-${voterId}`)
      if (stored) {
        return { hasVoted: true, vote: JSON.parse(stored) }
      }
    }
    return { hasVoted: false }
  }
}

export const submitVote = async (voterId: string, partyId: string): Promise<Vote> => {
  try {
    // Submit vote to blockchain
    const transactionHash = await blockchainService.submitVote(partyId, voterId)

    const vote: Vote = {
      id: `vote-${Date.now()}`,
      voterId,
      partyId,
      electionId: "default-election", // Assuming a default election ID
      timestamp: new Date(),
      transactionHash,
    }

    // Store vote in localStorage for demo
    if (typeof window !== "undefined") {
      localStorage.setItem(`vote-${voterId}`, JSON.stringify(vote))
    }

    return vote
  } catch (error) {
    console.error("Error submitting vote:", error)
    throw error
  }
}

export const getVoterStatus = async (voterId: string): Promise<{ hasVoted: boolean; vote?: Vote }> => {
  try {
    // Check blockchain first
    const hasVotedOnChain = await blockchainService.hasVoted(voterId)

    if (hasVotedOnChain && typeof window !== "undefined") {
      const stored = localStorage.getItem(`vote-${voterId}`)
      if (stored) {
        return { hasVoted: true, vote: JSON.parse(stored) }
      }
    }

    return { hasVoted: hasVotedOnChain }
  } catch (error) {
    console.error("Error checking voter status:", error)
    // Fallback to localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`vote-${voterId}`)
      if (stored) {
        return { hasVoted: true, vote: JSON.parse(stored) }
      }
    }
    return { hasVoted: false }
  }
}

export const getPartyById = (partyId: string): Party | undefined => {
  return mockParties.find((party) => party.id === partyId)
}

export const getLiveElectionData = async (): Promise<BlockchainElectionData> => {
  const partyIds = mockParties.map((party) => party.id)
  return await blockchainService.getElectionData(partyIds)
}
