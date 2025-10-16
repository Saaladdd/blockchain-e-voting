import { ethers } from "ethers"

// Mock contract ABI for voting system
const VOTING_CONTRACT_ABI = [
  "function getVoteCount(string memory partyId) public view returns (uint256)",
  "function getTotalVotes() public view returns (uint256)",
  "function hasVoted(address voter) public view returns (bool)",
  "function vote(string memory partyId) public",
  "function getPartyVotes() public view returns (string[] memory, uint256[] memory)",
  "event VoteCast(address indexed voter, string partyId, uint256 timestamp)",
]

// Mock contract address
const VOTING_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"

// Mock RPC URL (in production, this would be a real blockchain RPC)
const RPC_URL = "https://mock-blockchain-rpc.example.com"

export interface BlockchainVoteData {
  partyId: string
  voteCount: number
}

export interface BlockchainElectionData {
  totalVotes: number
  partyVotes: BlockchainVoteData[]
  lastUpdated: Date
}

const mockElectionData: { [electionId: string]: { [partyId: string]: number } } = {
  "election-1": {
    "party-1": 28750,
    "party-2": 31200,
    "party-3": 18900,
    "party-4": 8650,
  },
  "election-2": {
    "party-1": 0,
    "party-2": 0,
    "party-3": 0,
    "party-4": 0,
  },
  "election-3": {
    "party-1": 12500,
    "party-2": 9800,
    "party-3": 5200,
    "party-4": 4000,
  },
}

// Mock blockchain data for demonstration (default election)
const mockBlockchainData: { [key: string]: number } = mockElectionData["election-1"]

let mockTotalVotes = Object.values(mockBlockchainData).reduce((sum, votes) => sum + votes, 0)

// Simulate vote count changes over time
setInterval(() => {
  // Randomly increment vote counts to simulate live voting
  const partyIds = Object.keys(mockBlockchainData)
  const randomParty = partyIds[Math.floor(Math.random() * partyIds.length)]
  const increment = Math.floor(Math.random() * 5) + 1

  mockBlockchainData[randomParty] += increment
  mockTotalVotes += increment
}, 10000) // Update every 10 seconds

export class BlockchainVotingService {
  private provider: ethers.JsonRpcProvider | null = null
  private contract: ethers.Contract | null = null

  constructor() {
    this.initializeProvider()
  }

  private async initializeProvider() {
    try {
      // In a real implementation, this would connect to actual blockchain
      this.provider = new ethers.JsonRpcProvider(RPC_URL)
      this.contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, this.provider)
    } catch (error) {
      console.log("[v0] Using mock blockchain data due to connection error:", error)
    }
  }

  async getVoteCount(partyId: string, electionId?: string): Promise<number> {
    try {
      const targetElection = electionId || "election-1"
      const electionData = mockElectionData[targetElection] || {}
      return electionData[partyId] || 0
    } catch (error) {
      console.error("[v0] Error fetching vote count:", error)
      const electionData = mockElectionData[electionId || "election-1"] || {}
      return electionData[partyId] || 0
    }
  }

  async getTotalVotes(electionId?: string): Promise<number> {
    try {
      const targetElection = electionId || "election-1"
      const electionData = mockElectionData[targetElection] || {}
      return Object.values(electionData).reduce((sum, votes) => sum + votes, 0)
    } catch (error) {
      console.error("[v0] Error fetching total votes:", error)
      const electionData = mockElectionData[electionId || "election-1"] || {}
      return Object.values(electionData).reduce((sum, votes) => sum + votes, 0)
    }
  }

  async getAllPartyVotes(partyIds: string[], electionId?: string): Promise<BlockchainVoteData[]> {
    try {
      const partyVotes: BlockchainVoteData[] = []

      for (const partyId of partyIds) {
        const voteCount = await this.getVoteCount(partyId, electionId)
        partyVotes.push({ partyId, voteCount })
      }

      return partyVotes
    } catch (error) {
      console.error("[v0] Error fetching party votes:", error)
      const electionData = mockElectionData[electionId || "election-1"] || {}
      return partyIds.map((partyId) => ({
        partyId,
        voteCount: electionData[partyId] || 0,
      }))
    }
  }

  async getElectionData(partyIds: string[], electionId?: string): Promise<BlockchainElectionData> {
    try {
      const [totalVotes, partyVotes] = await Promise.all([
        this.getTotalVotes(electionId),
        this.getAllPartyVotes(partyIds, electionId),
      ])

      return {
        totalVotes,
        partyVotes,
        lastUpdated: new Date(),
      }
    } catch (error) {
      console.error("[v0] Error fetching election data:", error)
      const electionData = mockElectionData[electionId || "election-1"] || {}
      return {
        totalVotes: Object.values(electionData).reduce((sum, votes) => sum + votes, 0),
        partyVotes: partyIds.map((partyId) => ({
          partyId,
          voteCount: electionData[partyId] || 0,
        })),
        lastUpdated: new Date(),
      }
    }
  }

  async hasVoted(voterAddress: string, electionId?: string): Promise<boolean> {
    try {
      // In production: return await this.contract?.hasVoted(voterAddress)

      // Mock implementation - check localStorage with election context
      if (typeof window !== "undefined") {
        const key = electionId ? `vote-${electionId}-${voterAddress}` : `vote-${voterAddress}`
        const stored = localStorage.getItem(key)
        return !!stored
      }
      return false
    } catch (error) {
      console.error("[v0] Error checking vote status:", error)
      return false
    }
  }

  async submitVote(partyId: string, voterAddress: string, electionId?: string): Promise<string> {
    try {
      // In production, this would submit transaction to blockchain
      // const tx = await this.contract?.vote(partyId)
      // await tx.wait()
      // return tx.hash

      // Mock implementation
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`

      // Simulate blockchain delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update mock data for specific election
      const targetElection = electionId || "election-1"
      if (!mockElectionData[targetElection]) {
        mockElectionData[targetElection] = {}
      }
      mockElectionData[targetElection][partyId] = (mockElectionData[targetElection][partyId] || 0) + 1

      // Update default data if it's the default election
      if (targetElection === "election-1") {
        mockBlockchainData[partyId] = (mockBlockchainData[partyId] || 0) + 1
        mockTotalVotes += 1
      }

      return transactionHash
    } catch (error) {
      console.error("[v0] Error submitting vote:", error)
      throw new Error("Failed to submit vote to blockchain")
    }
  }
}

// Singleton instance
export const blockchainService = new BlockchainVotingService()

// Helper function to calculate vote percentages
export function calculateVotePercentages(partyVotes: BlockchainVoteData[], totalVotes: number) {
  return partyVotes.map((party) => ({
    ...party,
    percentage: totalVotes > 0 ? Math.round((party.voteCount / totalVotes) * 100) : 0,
  }))
}
