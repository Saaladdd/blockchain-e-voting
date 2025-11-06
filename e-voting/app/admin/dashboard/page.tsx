"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, LogOut } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ElectionsList } from "@/components/admin/elections-list"
import { useEVotingContract } from "@/components/ui/useEvotingContract"
import { register } from "module"
import * as circomlibjs from "circomlibjs"

export default function AdminDashboard() {
  const [voterId, setVoterId] = useState("")
  const { contract, signer, address } = useEVotingContract()

  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logged out")
  }

  const handleRegisterVoter = async (e: React.FormEvent) => {
    const poseidon = await circomlibjs.buildPoseidon();
     const hash = poseidon([BigInt(voterId)]);
    const hashBigInt = poseidon.F.toObject(hash);
    console.log("Hashed ID:", BigInt(hashBigInt));
    
    e.preventDefault()
    if(!contract) return
    try{
      const tx = await contract.registerVoter(BigInt(hashBigInt));
      const receipt = await tx.wait()
        console.log("Receipt", receipt)
        if (receipt.status !== 1) {
          throw new Error("Blockchain transaction failed!")
        } 
    }
    catch (error){
      console.error("Error registering voter:", error)
    }


    setVoterId("")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-serif font-semibold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Election Management System</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl space-y-8">
          <Tabs defaultValue="candidates" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="candidates">Add Candidates</TabsTrigger>
              <TabsTrigger value="register">Register Voter</TabsTrigger>
            </TabsList>

            <TabsContent value="candidates" className="mt-6">
              <ElectionsList />
            </TabsContent>

            <TabsContent value="register" className="mt-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="mb-6 font-serif text-xl font-semibold">Register Voter</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="voterId">Voter ID</Label>
                    <Input
                      id="voterId"
                      placeholder="Enter voter ID"
                      value={voterId}
                      onChange={(e) => setVoterId(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleRegisterVoter} disabled={!voterId.trim()} className="w-full">
                    Register Voter
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
