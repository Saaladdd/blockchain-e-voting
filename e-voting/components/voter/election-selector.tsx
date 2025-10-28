"use client"

import { useState, useEffect } from "react"
import { useEVotingContract } from "@/components/ui/useEvotingContract"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, PlusCircle, Calendar, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Election } from "@/lib/elections" // Your Election type

// The component no longer needs to receive 'elections' as a prop
export function ElectionsList() {
  // --- State ---
  const { contract, signer, address } = useEVotingContract() // Hook to get the contract instance
  const [elections, setElections] = useState<Election[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for the new election form
  const [newElectionName, setNewElectionName] = useState("")
  const [newElectionType, setNewElectionType] = useState("")
  const [newStartDate, setNewStartDate] = useState("")
  const [newEndDate, setNewEndDate] = useState("")
  
  // State for the submission logic
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState("")

  // --- 1. "Get Function" (Fetching Elections) ---
  const fetchElections = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Assumes your backend API route is /api/elections
      const response = await fetch("/api/elections") 
      if (!response.ok) {
        throw new Error("Failed to fetch elections")
      }
      // Parse the JSON response and ensure dates are converted
      const data = await response.json()
      const formattedElections: Election[] = data.map((election: any) => ({
        ...election,
        startDate: new Date(election.startDate), // Convert date strings to Date objects
        endDate: new Date(election.endDate),
      }))
      setElections(formattedElections)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch elections when the component mounts
  useEffect(() => {
    fetchElections()
  }, [])

  // --- 2. "Add to Chain + Backend" Function ---
  const handleCreateElection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contract) {
      setSubmitStatus("Error: Contract not connected")
      return
    }
    
    // --- UPDATED: Basic validation for all fields ---
    if (!newElectionName || !newElectionType || !newStartDate || !newEndDate) {
        setSubmitStatus("Please fill out all fields.")
        return
    }
    
    setIsSubmitting(true)
    setSubmitStatus("Submitting to blockchain...")
    let transactionHash = ""

    try {
      if(contract){
        console.log("Submitting with contract:",contract);
        
        // --- Step 1: Submit to the Chain ---
        
        // --- FIX: Combine all form data into one string ---
        const combinedDataString = `${newElectionName} (${newElectionType}) | ${newStartDate} to ${newEndDate}`;
        // --- END OF FIX ---

        // NOTE: We are now calling `addCandidate` with the single combined string.
        // This will succeed because the function is now public.
        const tx = await contract.addCandidate(
          combinedDataString
        )
        
        const receipt = await tx.wait()
        if (receipt.status !== 1) {
            throw new Error("Blockchain transaction failed!")
        }
        transactionHash = receipt.hash
        setSubmitStatus("Syncing with backend...")

        // --- Step 2: Push to the Backend ---
        const response = await fetch('/api/elections', { // Your backend POST route
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newElectionName,
            type: newElectionType,
            startDate: newStartDate,
            endDate: newEndDate,
            transactionHash: transactionHash,
          }),
        })

        if (!response.ok) {
          throw new Error("Backend sync failed!")
        }

        setSubmitStatus("Successfully created new election!")
        
        // Clear form and refresh the list
        setNewElectionName("")
        setNewElectionType("")
        setNewStartDate("")
        setNewEndDate("")
        fetchElections() // Refresh the elections list

        // Clear the status message after a few seconds
        setTimeout(() => setSubmitStatus(""), 3000)
    }

    } catch (err: any) {
      console.error(err)
      setSubmitStatus(`Error: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }
  console.log("Contract is:",contract);

  // --- Render Logic ---

  return (
    <div className="space-y-8">
      {/* --- New Election Form --- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Create New Election
          </CardTitle>
          <CardDescription>
            Add a new election to the smart contract and sync it with the backend.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateElection} className="space-y-4">
            
            {/* --- UPDATED: Added all form fields --- */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="election-name">Election Name</Label>
                <Input
                  id="election-name"
                  placeholder="e.g., General Election 2025"
                  value={newElectionName}
                  onChange={(e) => setNewElectionName(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="election-type">Election Type</Label>
                <Input
                  id="election-type"
                  placeholder="e.g., Presidential"
                  value={newElectionType}
                  onChange={(e) => setNewElectionType(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
            {/* --- END OF UPDATE --- */}

            <div className="flex items-center justify-between">
              <Button type="submit" disabled={isSubmitting || !contract}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="mr-2 h-4 w-4" />
                )}
                {isSubmitting ? "Creating..." : "Create Election"}
              </Button>
              {submitStatus && <p className="text-sm text-muted-foreground">{submitStatus}</p>}
            </div>
            {!contract && <p className="text-sm text-yellow-600">Connecting to contract...</p>}
          </form>
        </CardContent>
      </Card>

      {/* --- Existing Elections List --- */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Existing Elections</h2>
        {isLoading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Loading elections...</p>
            </CardContent>
          </Card>
        ) : error ? (
           <Card>
            <CardContent className="pt-6">
              <p className="text-center text-red-500">{error}</p>
            </CardContent>
          </Card>
        ) : elections.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No elections found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {elections.map((election) => (
              <Card key={election.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{election.name}</CardTitle>
                      <CardDescription className="capitalize">{election.type} Election</CardDescription>
                    </div>
                    {/* You can add a Badge for status here if your Election type has it */}
                    {/* <Badge>Active</Badge> */}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="font-medium">{election.startDate.toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">Start Date</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="font-medium">{election.endDate.toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">End Date</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="font-medium">
                          {election.statistics?.totalRegisteredVoters.toLocaleString() ?? 'N/A'}
                        </p>
                        <p className="text-xs text-muted-foreground">Registered Voters</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}