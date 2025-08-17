export interface PartyStats {
  partyId: string
  totalVotes: number
  percentage: number
  rank: number
  hourlyVotes: { hour: string; votes: number }[]
  demographicBreakdown: { category: string; votes: number; percentage: number }[]
  regionBreakdown: { region: string; votes: number; percentage: number }[]
}

export interface PartyProfile {
  id: string
  name: string
  symbol: string
  logo: string
  description: string
  manifesto: string
  color: string
  founded: string
  leader: string
  headquarters: string
  website: string
}

// Mock party statistics
export const mockPartyStats: Record<string, PartyStats> = {
  "party-1": {
    partyId: "party-1",
    totalVotes: 28500,
    percentage: 32.6,
    rank: 1,
    hourlyVotes: [
      { hour: "08:00", votes: 1200 },
      { hour: "09:00", votes: 2100 },
      { hour: "10:00", votes: 2800 },
      { hour: "11:00", votes: 3200 },
      { hour: "12:00", votes: 2900 },
      { hour: "13:00", votes: 3100 },
      { hour: "14:00", votes: 3400 },
      { hour: "15:00", votes: 3800 },
      { hour: "16:00", votes: 3200 },
      { hour: "17:00", votes: 2700 },
    ],
    demographicBreakdown: [
      { category: "18-25", votes: 8500, percentage: 29.8 },
      { category: "26-35", votes: 9200, percentage: 32.3 },
      { category: "36-50", votes: 7100, percentage: 24.9 },
      { category: "51+", votes: 3700, percentage: 13.0 },
    ],
    regionBreakdown: [
      { region: "Urban", votes: 18200, percentage: 63.9 },
      { region: "Suburban", votes: 7300, percentage: 25.6 },
      { region: "Rural", votes: 3000, percentage: 10.5 },
    ],
  },
  "party-2": {
    partyId: "party-2",
    totalVotes: 24100,
    percentage: 27.5,
    rank: 2,
    hourlyVotes: [
      { hour: "08:00", votes: 1000 },
      { hour: "09:00", votes: 1800 },
      { hour: "10:00", votes: 2400 },
      { hour: "11:00", votes: 2700 },
      { hour: "12:00", votes: 2500 },
      { hour: "13:00", votes: 2600 },
      { hour: "14:00", votes: 2900 },
      { hour: "15:00", votes: 3200 },
      { hour: "16:00", votes: 2800 },
      { hour: "17:00", votes: 2300 },
    ],
    demographicBreakdown: [
      { category: "18-25", votes: 4800, percentage: 19.9 },
      { category: "26-35", votes: 6200, percentage: 25.7 },
      { category: "36-50", votes: 8100, percentage: 33.6 },
      { category: "51+", votes: 5000, percentage: 20.8 },
    ],
    regionBreakdown: [
      { region: "Urban", votes: 9600, percentage: 39.8 },
      { region: "Suburban", votes: 8900, percentage: 36.9 },
      { region: "Rural", votes: 5600, percentage: 23.2 },
    ],
  },
}

// Extended party profiles
export const partyProfiles: Record<string, PartyProfile> = {
  "party-1": {
    id: "party-1",
    name: "Progressive Alliance",
    symbol: "PA",
    logo: "/progressive-party-logo.png",
    description: "Building a sustainable future through innovation and social progress.",
    manifesto: "Focus on renewable energy, education reform, and healthcare accessibility.",
    color: "#3b82f6",
    founded: "2018",
    leader: "Sarah Johnson",
    headquarters: "Metropolitan City",
    website: "www.progressivealliance.org",
  },
  "party-2": {
    id: "party-2",
    name: "Unity Coalition",
    symbol: "UC",
    logo: "/unity-political-party-logo.png",
    description: "Bringing communities together for economic prosperity and social harmony.",
    manifesto: "Economic growth, infrastructure development, and community empowerment.",
    color: "#10b981",
    founded: "2015",
    leader: "Michael Chen",
    headquarters: "Central District",
    website: "www.unitycoalition.org",
  },
}

export const getPartyStats = (partyId: string): PartyStats | null => {
  return mockPartyStats[partyId] || null
}

export const getPartyProfile = (partyId: string): PartyProfile | null => {
  return partyProfiles[partyId] || null
}
