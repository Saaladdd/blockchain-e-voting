import { User } from "./auth"

export interface VerificationData {
  fullName: string
  dateOfBirth: string
  otp: string
  phoneNumber: string
}

// Mock verification data storage
export type VerificationStatus = "pending" | "verified" | "rejected"

export const getVerificationStatuses = (): Record<string, VerificationStatus> => {
  if (typeof window === "undefined") return {}
  const stored = localStorage.getItem("verificationStatuses")
  return stored ? JSON.parse(stored) : {}
}

export const setVerificationStatus = (user: User, status: VerificationStatus) => {
  if (!user.walletAddress || typeof window === "undefined") return

  const statuses = getVerificationStatuses()
  statuses[user.walletAddress] = status
  localStorage.setItem("verificationStatuses", JSON.stringify(statuses))
}

export const getVerificationStatus = (user: User): VerificationStatus | null => {
  if (!user.walletAddress || typeof window === "undefined") return null

  const statuses = getVerificationStatuses()
  return statuses[user.walletAddress] || null
}

