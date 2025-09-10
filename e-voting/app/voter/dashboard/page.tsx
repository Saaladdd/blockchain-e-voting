"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { UserRole } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Vote, Clock, Users, CheckCircle, Wallet, AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { mockParties, getVoterStatusForElection, submitVoteForElection, type Party } from "@/lib/voting"
import { getActiveElections, type Election } from "@/lib/elections"
import { VoteConfirmationModal } from "@/components/voting/vote-confirmation-modal"
import { ElectionSelector } from "@/components/voter/election-selector"
import { Navbar } from "@/components/navigation/navbar"
import {
  getVerificationStatus,
  type VerificationData,
  type VerificationStatus,
} from "@/lib/voter-verification"
import WalletConnectButton from "@/components/voter/WallectConnectButton"
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

export default function VoterDashboard() {
  const {user,logout,login } = useAuth()
  const {account, connected} = useSelector((state:RootState)=> state.wallet)
  const router = useRouter()
  const [selectedParty, setSelectedParty] = useState<Party | null>(null)
  const [selectedElection, setSelectedElection] = useState<Election | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [voterStatus, setVoterStatus] = useState({ hasVoted: false, vote: undefined })
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null)
  
  const [isConnecting, setIsConnecting] = useState(false)
  

  const [verificationData, setVerificationData] = useState<VerificationData>({
    fullName: "",
    dateOfBirth: "",
    otp: "",
    phoneNumber: ""
  })
  const [error, setError] = useState<string | null>(null)
  console.log("User:",user);
  useEffect(() => {
   
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch("/api/voter-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: verificationData.fullName.trim(), 
                                dateOfBirth: verificationData.dateOfBirth, 
                                otp: verificationData.otp.trim(), 
                                phoneNumber: verificationData.phoneNumber.trim() }), 
      })

      const data = await res.json()
      console.log("Show:",data)
      if (!data.exists) {
        setError("Credentials do not match");
        return
      }
      else{
        setError(null);
        login({
          fullName: verificationData.fullName,
          dateOfBirth: verificationData.dateOfBirth,
          role: "voter" as UserRole,
        })
        setVerificationStatus("verified" as VerificationStatus);
              
      }
      
    } catch (error) {
      console.error("Error submitting verification:", error)
    }
  }
    

  const handleWalletConnect = async () => {
    setIsConnecting(true)
    // Mock wallet connection
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsConnecting(false)
  }

  const handleVoteClick = (party: Party) => {
    if (voterStatus.hasVoted || connected || !selectedElection) return
    setSelectedParty(party)
    setShowConfirmation(true)
  }

  const handleVoteConfirm = async () => {
    if (!user || !selectedParty || !selectedElection) return

    try {
      //await submitVoteForElection(selectedElection.id, selectedParty.id)
      setShowConfirmation(false)
      router.push("/voter/confirmation")
    } catch (error) {
      console.error("Error submitting vote:", error)
    }
  }

  if (!user) return null

  if (!verificationStatus || verificationStatus !== "verified") {
    return (
      <div className="min-h-screen bg-background transition-colors duration-200">
        <Navbar role="voter" title="Voter Dashboard" />

        <main className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-2xl">
            <Card className="transition-all duration-200">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 transition-colors duration-200">
                  {verificationStatus?.status === "pending" ? (
                    <Loader2 className="h-8 w-8 text-secondary animate-spin" />
                  ) : (
                    <Vote className="h-8 w-8 text-secondary" />
                  )}
                </div>
                <CardTitle className="text-2xl font-serif">Identity Verification</CardTitle>
                <CardDescription>
                  {verificationStatus?.status === "pending"
                    ? "Your verification is being processed. Please wait..."
                    : "Complete your identity verification to access voting features."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {verificationStatus?.status === "pending" ? (
                  <div className="text-center space-y-4">
                    <div className="rounded-lg border border-border bg-yellow-50 dark:bg-yellow-950 p-4">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-6 w-6 text-yellow-600" />
                        <div>
                          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Verification Pending</h3>
                          <p className="text-sm text-yellow-600 dark:text-yellow-300">
                            Your identity verification is being reviewed. This usually takes a few minutes.
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Submitted on {verificationStatus.submittedAt.toLocaleString()}
                    </p>
                  </div>
                ) : verificationStatus?.status === "rejected" ? (
                  <div className="text-center space-y-4">
                    <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 p-4">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                        <div>
                          <h3 className="font-semibold text-red-800 dark:text-red-200">Verification Rejected</h3>
                          <p className="text-sm text-red-600 dark:text-red-300">
                            {verificationStatus.rejectionReason || "Please contact support for assistance."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
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
                          className="transition-all duration-200 focus:ring-2"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={verificationData.dateOfBirth}
                          onChange={(e) => setVerificationData({ ...verificationData, dateOfBirth: e.target.value })}
                          required
                          className="transition-all duration-200 focus:ring-2"
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
                              setVerificationData({
                                ...verificationData,
                                phoneNumber: e.target.value,
                              })
                            }
                            required
                            className="transition-all duration-200 focus:ring-2"
                          />
                          <Button
                            type="button"
                            className="shrink-0"
                            onClick={() => {
                              // 👇 your OTP sending logic goes here
                              console.log("Send OTP to", verificationData.phoneNumber);
                               setVerificationData({
                                ...verificationData,
                                otp: "",
                              });
                            }}
                          >
                            Send OTP
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="otp">OTP</Label>
                        <div className="flex gap-1">
                          <Input
                            id="otp"
                            type="num"
                            placeholder="Enter your OTP"
                            value={verificationData.otp}
                            onChange={(e) =>
                              setVerificationData({
                                ...verificationData,
                                otp: e.target.value,
                              })
                            }
                            required
                            className="transition-all duration-200 focus:ring-2"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button type="submit" className="w-full transition-all duration-200 hover:scale-105" size="lg">
                      Submit for Verification
                    </Button>
                  </form>
                )}

                <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4 transition-colors duration-200">
                  <h4 className="mb-2 text-sm font-medium">Security Notice</h4>
                  <p className="text-xs text-muted-foreground">
                    Your personal information is processed securely and used only for voter eligibility verification.
                    Your vote remains completely anonymous.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <Navbar role="voter" title="Voter Dashboard" />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <ElectionSelector selectedElection={selectedElection} onElectionChange={setSelectedElection} />
        </div>

        {!selectedElection && (
          <Card className="mb-8">
            <CardContent className="pt-6 text-center">
              <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-muted-foreground mb-2">No Election Selected</h3>
              <p className="text-sm text-muted-foreground">Please select an election above to continue.</p>
            </CardContent>
          </Card>
        )}

        {selectedElection && (
          <>
            {/* Verification Success & Wallet Connection */}
            {!connected && (
              <Card className="mb-8 transition-all duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Identity Verified
                  </CardTitle>
                  <CardDescription>
                    Your identity has been verified. Connect your wallet to participate in {selectedElection.name}.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <WalletConnectButton />
                </CardContent>
              </Card>
            )}

            {/* Wallet Connected Status */}
            {connected && (
              <Card className="mb-8 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 transition-all duration-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-800 dark:text-green-200">Wallet Connected</h3>
                      <p className="text-sm text-green-600 dark:text-green-300">
                        You're ready to vote in {selectedElection.name}! Select a party below to cast your vote.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Election Status */}
            <Card className="mb-8 transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {selectedElection.name} Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {selectedElection.statistics.totalVotesCast.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Votes Cast</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {selectedElection.statistics.turnoutPercentage}%
                    </div>
                    <p className="text-sm text-muted-foreground">Voter Turnout</p>
                  </div>
                  <div className="text-center">
                    <Badge variant={selectedElection.status === "active" ? "default" : "secondary"} className="text-sm">
                      {selectedElection.status === "active" ? "Voting Active" : selectedElection.status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{selectedElection.statistics.turnoutPercentage}%</span>
                  </div>
                  <Progress value={selectedElection.statistics.turnoutPercentage} className="mt-2" />
                </div>
              </CardContent>
            </Card>

            {/* Voting Status */}
            {voterStatus.hasVoted && (
              <Card className="mb-8 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 transition-all duration-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-800 dark:text-green-200">Vote Successfully Cast</h3>
                      <p className="text-sm text-green-600 dark:text-green-300">
                        Your vote for {selectedElection.name} has been recorded on the blockchain. Thank you for
                        participating!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Parties List */}
            {connected && selectedElection.status === "active" && (
              <div className="mb-8">
                <h2 className="mb-6 text-2xl font-serif font-bold">Available Parties</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {mockParties.map((party) => (
                    <Card key={party.id} className="transition-all duration-200 hover:shadow-lg hover:shadow-primary/5">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <img
                            src={party.logo || "/placeholder.svg"}
                            alt={`${party.name} logo`}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <CardTitle className="flex items-center gap-2">
                              {party.name}
                              <Badge variant="outline" style={{ borderColor: party.color, color: party.color }}>
                                {party.symbol}
                              </Badge>
                            </CardTitle>
                            <CardDescription className="mt-2">{party.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4 text-sm text-muted-foreground">{party.manifesto}</p>
                        <Button
                          onClick={() => handleVoteClick(party)}
                          disabled={selectedElection.status !== "active" || voterStatus.hasVoted || !connected}
                          className="w-full transition-all duration-200 hover:scale-105"
                          style={{ backgroundColor: voterStatus.hasVoted ? undefined : party.color }}
                        >
                          <Vote className="mr-2 h-4 w-4" />
                          {voterStatus.hasVoted
                            ? "Vote Cast"
                            : !connected
                              ? "Connect Wallet First"
                              : "Vote for this Party"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Voting Information */}
            <Card className="transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Voting Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold">Your Status</h4>
                    <p className="text-sm text-muted-foreground">
                      {!connected
                        ? "Identity verified - Connect wallet to vote"
                        : voterStatus.hasVoted
                          ? `You have successfully cast your vote in ${selectedElection.name}.`
                          : selectedElection.status === "active"
                            ? "Ready to vote - Select a party above."
                            : "Election is not currently active for voting."}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Blockchain Security</h4>
                    <p className="text-sm text-muted-foreground">
                      All votes are cryptographically secured and recorded immutably on the blockchain.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>

      {/* Vote Confirmation Modal */}
      {selectedParty && selectedElection && (
        <VoteConfirmationModal
          party={selectedParty}
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleVoteConfirm}
        />
      )}
    </div>
  )
}
