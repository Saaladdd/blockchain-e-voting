"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ExternalLink, ArrowLeft, Copy, Check } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { getVoterStatus, getPartyById, mockElectionStatus } from "@/lib/voting"

export default function VoteConfirmationPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [voterStatus, setVoterStatus] = useState({ hasVoted: false, vote: undefined })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!user || user.role !== "voter") {
      router.push("/voter/login")
      return
    }

    const status = getVoterStatus(user.id)
    if (!status.hasVoted) {
      router.push("/voter/dashboard")
      return
    }

    setVoterStatus(status)
  }, [user, router])

  const copyTransactionHash = async () => {
    if (voterStatus.vote?.transactionHash) {
      await navigator.clipboard.writeText(voterStatus.vote.transactionHash)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!user || !voterStatus.hasVoted || !voterStatus.vote) {
    return null
  }

  const party = getPartyById(voterStatus.vote.partyId)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/voter/dashboard"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-serif font-semibold">Vote Confirmed</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          {/* Success Message */}
          <Card className="mb-8 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-600" />
                <h1 className="mb-2 text-2xl font-serif font-bold text-green-800 dark:text-green-200">
                  Vote Successfully Cast!
                </h1>
                <p className="text-green-600 dark:text-green-300">
                  Your vote has been securely recorded on the blockchain. Thank you for participating in the democratic
                  process.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Vote Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Vote Details</CardTitle>
              <CardDescription>Your vote has been recorded with the following information:</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Party Information */}
              {party && (
                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={party.logo || "/placeholder.svg"}
                      alt={`${party.name} logo`}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{party.name}</h3>
                        <Badge variant="outline" style={{ borderColor: party.color, color: party.color }}>
                          {party.symbol}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{party.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Transaction Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-semibold">Vote ID</h4>
                  <p className="text-sm text-muted-foreground">{voterStatus.vote.id}</p>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold">Timestamp</h4>
                  <p className="text-sm text-muted-foreground">{voterStatus.vote.timestamp.toLocaleString()}</p>
                </div>
              </div>

              {/* Transaction Hash */}
              <div>
                <h4 className="mb-2 font-semibold">Blockchain Transaction Hash</h4>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded bg-muted px-3 py-2 text-sm">{voterStatus.vote.transactionHash}</code>
                  <Button variant="outline" size="sm" onClick={copyTransactionHash}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  This hash can be used to verify your vote on the blockchain explorer.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Election Status */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Election Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {mockElectionStatus.totalVotes.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Votes</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{mockElectionStatus.turnoutPercentage}%</div>
                  <p className="text-sm text-muted-foreground">Turnout</p>
                </div>
                <div className="text-center">
                  <Badge variant={mockElectionStatus.isActive ? "default" : "secondary"}>
                    {mockElectionStatus.isActive ? "Active" : "Closed"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button asChild className="flex-1 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
              <Link href="/voter/dashboard">Return to Dashboard</Link>
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-transparent transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View on Blockchain
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
