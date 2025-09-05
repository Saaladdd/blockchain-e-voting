export interface VerificationData {
  nationalId: string
  fullName: string
  dateOfBirth: string
  otp: string
  phoneNumber: string
}

export interface VerificationStatus {
  id: string
  status: "pending" | "approved" | "rejected"
  submittedAt: Date
  reviewedAt?: Date
  rejectionReason?: string
}

// Mock verification data storage
const verificationStatuses = new Map<string, VerificationStatus>()

export function submitVerification(userId: string, data: VerificationData): VerificationStatus {
  const verification: VerificationStatus = {
    id: `verification_${Date.now()}`,
    status: "pending",
    submittedAt: new Date(),
  }

  verificationStatuses.set(userId, verification)

  // Mock auto-approval after 3 seconds for demo
  setTimeout(() => {
    const current = verificationStatuses.get(userId)
    if (current && current.status === "pending") {
      verificationStatuses.set(userId, {
        ...current,
        status: "approved",
        reviewedAt: new Date(),
      })
    }
  }, 3000)

  return verification
}

export function getVerificationStatus(userId: string): VerificationStatus | null {
  return verificationStatuses.get(userId) || null
}
