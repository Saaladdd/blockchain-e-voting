"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useEVotingContract } from "@/components/ui/useEvotingContract"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, PlusCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CandidateInfo {
  name: string
  voteCount: number
}

export function ElectionsList() {
  const { contract, signer, address } = useEVotingContract()
  const [candidates, setCandidates] = useState<CandidateInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [newElectionName, setNewElectionName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState("")

  const fetchCandidates = async () => {
    if (!contract) return
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/get-candidate-list")
      if (!response.ok) throw new Error("Failed to fetch candidates")

      const names: string[] = await response.json()

      // ✅ Blockchain voteCount fetch for each candidate
      const chainData = await Promise.all(
        names.map(async (name, i) => {
          const candidate = await contract.getCandidate(i)
          return {
            name,
            voteCount: Number(candidate.voteCount),
          }
        })
      )

      setCandidates(chainData)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (contract) fetchCandidates()
  }, [contract])

  const handleCreateElection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contract) return

    if (!newElectionName) {
      setSubmitStatus("Please enter candidate name.")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("Submitting to blockchain...")
    try {
      const tx = await contract.addCandidate(newElectionName)
      const receipt = await tx.wait()
      if (receipt.status !== 1) throw new Error("Transaction failed")

      setSubmitStatus("Syncing with backend...")

      await fetch("/api/add-candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newElectionName }),
      })

      setSubmitStatus("Candidate added ✅")
      setNewElectionName("")
      fetchCandidates()

      setTimeout(() => setSubmitStatus(""), 2500)
    } catch (err: any) {
      setSubmitStatus(`Error: ${err.message}`)
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent>
          <form onSubmit={handleCreateElection} className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="election-name">Candidate Name</Label>
                <Input
                  id="election-name"
                  placeholder="e.g., Candidate ABC"
                  value={newElectionName}
                  onChange={(e) => setNewElectionName(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button type="submit" disabled={isSubmitting || !contract}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="mr-2 h-4 w-4" />
                )}
                {isSubmitting ? "Creating..." : "Add Candidate"}
              </Button>
              {submitStatus && <p className="text-sm text-muted-foreground">{submitStatus}</p>}
            </div>

            {!contract && (
              <p className="text-sm text-yellow-600">Connecting to blockchain...</p>
            )}
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Existing Candidates</h2>

        {isLoading ? (
          <Card><CardContent className="pt-6 text-center">Loading...</CardContent></Card>
        ) : error ? (
          <Card><CardContent className="pt-6 text-center text-red-500">{error}</CardContent></Card>
        ) : candidates.length === 0 ? (
          <Card><CardContent className="pt-6 text-center text-muted-foreground">No candidates found</CardContent></Card>
        ) : (
          <div className="grid gap-4">
            {candidates.map((cand, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>
                    {cand.name} — Votes: <b>{cand.voteCount}</b>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
