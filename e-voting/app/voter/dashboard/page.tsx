"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Vote, CheckCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import hashid from "@/scripts/hashId"
import { useEVotingContract } from "@/components/ui/useEvotingContract"

export default function VoterDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  const { contract, readContract, signer, address } = useEVotingContract()

  const [verificationData, setVerificationData] = useState({
    fullName: "",
    idHash: "",
    otp: "",
    phoneNumber: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)

  // ✅ candidates are now array of { id, name }
  const [candidates, setCandidates] = useState<{ id: number; name: string }[]>([])
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null)

  useEffect(() => {
    if (isVerified) {
      loadCandidates()
    }
  }, [isVerified])

  const loadCandidates = async () => {
    setIsLoadingCandidates(true)
    try {
      const res = await fetch("/api/get-candidate-list-voter", { cache: "no-store" })
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

      const data = await res.json()
      console.log("Candidate Response:", data)

      if (!Array.isArray(data)) throw new Error("Expected an array of candidates")

      // ✅ expecting [{ id: 1, name: "Alice" }, ...]
      setCandidates(data)
    } catch (error) {
      console.error("Error loading candidates:", error)
      setError("Failed to load candidates")
    } finally {
      setIsLoadingCandidates(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/voter-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: verificationData.fullName.trim(),
          voterId: verificationData.idHash,
          otp: verificationData.otp.trim(),
          phoneNumber: verificationData.phoneNumber.trim(),
        }),
      })
      const data = await res.json()
      console.log("Verification Response:", data)

      if (!data.exists) {
        setError("Credentials do not match")
        return
      }

      setIsVerified(true)
      setError(null)
    } catch (error) {
      console.error("Error submitting verification:", error)
      setError("Something went wrong while verifying.")
    }
  }

  const handleVote = async (candidateId: number) => {
    try {
      console.log("candidateId is:",candidateId);
      const proofRes = await fetch("/proof.json")
      const publicRes = await fetch("/public.json")

      const proof = await proofRes.json()
      const publicSignals = await publicRes.json()

      const a: [bigint, bigint] = [
        BigInt(proof.pi_a[0]),
        BigInt(proof.pi_a[1]),
      ]

      const b: [[bigint, bigint], [bigint, bigint]] = [
        [BigInt(proof.pi_b[0][1]), BigInt(proof.pi_b[0][0])],
        [BigInt(proof.pi_b[1][1]), BigInt(proof.pi_b[1][0])],
      ]

      const c: [bigint, bigint] = [
        BigInt(proof.pi_c[0]),
        BigInt(proof.pi_c[1]),
      ]

      const input: [bigint, bigint] = [
        BigInt(publicSignals[0]),
        BigInt(publicSignals[1]),
      ]

      if (!contract) {
        console.error("Contract not available")
        return
      }

      const hashedId = await hashid(verificationData.idHash)
      console.log("Voting for candidate:", candidateId)
      console.log("Sending parameters:", BigInt(candidateId), BigInt(hashedId), a, b, c, input)

      // Call the smart contract with the actual selected candidate index
      const tx = await contract.vote(BigInt(candidateId), BigInt(hashedId), a, b, c, input)
      console.log("✅ Vote submitted:", tx.hash)

      setSelectedCandidate(candidateId)
    } catch (error: any) {
      console.error("❌ Error during vote:", error)
      setError("Failed to cast vote. Check console for details.")
    }
  }

  // -------------------- UI --------------------
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-200">
        <main className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
                  <Vote className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-2xl font-serif">Identity Verification</CardTitle>
                <CardDescription>Complete your identity verification to access voting features.</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={verificationData.fullName}
                        onChange={(e) => setVerificationData({ ...verificationData, fullName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="idHash">ID</Label>
                      <Input
                        id="idHash"
                        type="text"
                        value={verificationData.idHash}
                        onChange={(e) => setVerificationData({ ...verificationData, idHash: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <div className="flex gap-2">
                        <Input
                          id="phoneNumber"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={verificationData.phoneNumber}
                          onChange={(e) =>
                            setVerificationData({ ...verificationData, phoneNumber: e.target.value })
                          }
                          required
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            console.log("Send OTP to", verificationData.phoneNumber)
                            setVerificationData({ ...verificationData, otp: "" })
                          }}
                        >
                          Send OTP
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="otp">OTP</Label>
                      <Input
                        id="otp"
                        type="number"
                        placeholder="Enter your OTP"
                        value={verificationData.otp}
                        onChange={(e) => setVerificationData({ ...verificationData, otp: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <Button type="submit" className="w-full">
                    Submit for Verification
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  // -------------------- Voting Section --------------------
  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif">Cast Your Vote</CardTitle>
            <CardDescription>Select a candidate to vote for</CardDescription>
          </CardHeader>

          <CardContent>
            {error && <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

            {isLoadingCandidates ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium">{candidate.name}</span>
                    <Button
                      onClick={() => handleVote(candidate.id)}
                      disabled={selectedCandidate !== null}
                      variant={selectedCandidate === candidate.id ? "default" : "outline"}
                    >
                      {selectedCandidate === candidate.id ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Voted
                        </>
                      ) : (
                        <>
                          <Vote className="mr-2 h-4 w-4" />
                          Vote
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
