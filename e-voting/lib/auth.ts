export type UserRole = "voter" | "party" | "admin"

export interface User {
  id: string
  role: UserRole
  name: string
  email?: string
  walletAddress?: string
  partyId?: string
  isVerified?: boolean
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Mock authentication functions - in real app would connect to blockchain/backend
export const mockUsers = {
  voter: {
    id: "1",
    role: "voter" as UserRole,
    name: "John Doe",
    email: "john@example.com",
    walletAddress: "0x1234...5678",
    isVerified: true,
  },
  party: {
    id: "2",
    role: "party" as UserRole,
    name: "Democratic Party",
    partyId: "party-1",
    isVerified: true,
  },
  admin: {
    id: "3",
    role: "admin" as UserRole,
    name: "Admin User",
    email: "admin@securevote.com",
    isVerified: true,
  },
}

export const authenticateUser = async (role: UserRole, credentials: any): Promise<User | null> => {
  // Mock authentication - replace with real authentication logic
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockUsers[role]
}

export const getCurrentUser = (): User | null => {
  // Mock current user - replace with real session management
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("currentUser")
    return stored ? JSON.parse(stored) : null
  }
  return null
}

export const setCurrentUser = (user: User | null) => {
  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user))
    } else {
      localStorage.removeItem("currentUser")
    }
  }
}

export const logout = () => {
  setCurrentUser(null)
}
