"use client"

import { useState, useEffect } from "react"
import { useEVotingContract } from "@/components/ui/useEvotingContract"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, PlusCircle, Calendar, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"


// The component no longer needs to receive 'elections' as a prop
export function ElectionsList() {   
  // --- State ---
  const { contract, signer, address } = useEVotingContract() // Hook to get the contract instance
  const [candidateNames, setCandidateNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for the new election form
  const [newElectionName, setNewElectionName] = useState("")
  
  // State for the submission logic
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState("")

  // --- 1. "Get Function" (Fetching Elections) ---
  const fetchCandidates = async () => {
  setIsLoading(true);
  setError(null);
  try {
    // 1. Fetch from the correct API route for candidate names
    const response = await fetch("/api/get-candidate-list"); // Or "/api/candidate-names" if you used that

    if (!response.ok) {
      // Try to get a more specific error from the API response body
      let errorMsg = "Failed to fetch candidates";
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMsg = errorData.error;
        }
      } catch (parseError) {
        // Ignore if the error response isn't JSON
      }
      throw new Error(errorMsg);
    }

    // 2. Parse the JSON response, which should be an array of strings
    const names: string[] = await response.json();

    // 3. Update the state with the array of names
    setCandidateNames(names);

  } catch (err: any) {
    console.error("Error fetching candidates:", err); // Log the actual error
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};

// Fetch candidates when the component mounts
useEffect(() => {
  fetchCandidates(); // Call the renamed function
}, []);

  // --- 2. "Add to Chain + Backend" Function ---
  const handleCreateElection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contract) {
      setSubmitStatus("Error: Contract not connected")
      return
    }
    
    // Basic validation
    if (!newElectionName) {
        setSubmitStatus("Please fill out all fields.")
        return
    }
    
    setIsSubmitting(true)
    setSubmitStatus("Submitting to blockchain...")
    let transactionHash = ""

    try {
      if(contract){
        console.log("This is the contract:",contract);
            // --- Step 1: Submit to the Chain ---
        // NOTE: You must add a 'createElection' function to your 'EVoting.sol' contract
        // that matches these parameters.
        const tx = await contract.addCandidate(
          newElectionName
        )
        console.log("Signers:",signer);
        console.log("Address:",address);
        //const testx = await contract.updateVariable();
        //console.log("testx",testx);
        //const testy = await contract.getMyNewVariable();
        
        //console.log("testy",testy);
        try {
            const candidatesAfter = await contract.getCandidateNames();
            console.log("Candidates AFTER confirmation:", candidatesAfter);
        } catch (readError) {
            console.error("Error fetching candidates after add:", readError);
        }
        
        const receipt = await tx.wait()
        console.log("Receipt",receipt);
        if (receipt.status !== 1) {
            throw new Error("Blockchain transaction failed!")
        }
        transactionHash = receipt.hash
        setSubmitStatus("Syncing with backend...")

        // --- Step 2: Push to the Backend ---
        const response = await fetch('/api/add-candidate', { // Your backend POST route
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newElectionName,
          }),
        })

        if (!response.ok) {
          throw new Error("Backend sync failed!")
        }

        setSubmitStatus("Successfully created new election!")
        
        // Clear form and refresh the list
        setNewElectionName("")
        fetchCandidates() // Refresh the elections list

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

  // --- Render Logic ---

  return (
    <div className="space-y-8">
      {/* --- New Election Form --- */}
      <Card>
        <CardContent>
          <form onSubmit={handleCreateElection} className="space-y-4">
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
            </div>
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
      {/* --- Existing Candidates List --- */}
<div className="space-y-4">
  <h2 className="text-lg font-semibold">Existing Candidates</h2> {/* Changed Title */}
  {isLoading ? (
    <Card>
      <CardContent className="pt-6">
        <p className="text-center text-muted-foreground">Loading candidates...</p> {/* Updated text */}
      </CardContent>
    </Card>
  ) : error ? (
     <Card>
      <CardContent className="pt-6">
        <p className="text-center text-red-500">{error}</p>
      </CardContent>
    </Card>
  ) : candidateNames.length === 0 ? ( // Use candidateNames state
    <Card>
      <CardContent className="pt-6">
        <p className="text-center text-muted-foreground">No candidates found.</p> {/* Updated text */}
      </CardContent>
    </Card>
  ) : (
    <div className="grid gap-4">
      {/* Map over the array of candidate name strings */}
      {candidateNames.map((name, index) => (
        // Use index as key (not ideal, but necessary without unique IDs here)
        <Card key={index}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                {/* Display the name string directly */}
                <CardTitle>{name}</CardTitle>
                {/* Removed CardDescription as type info is unavailable */}
              </div>
              {/* Removed Badge */}
            </div>
          </CardHeader>
          {/* Removed CardContent as date/voter info is unavailable */}
        </Card>
      ))}
    </div>
  )}
</div>
</div>
)}
