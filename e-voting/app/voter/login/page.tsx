"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Vote, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { authenticateUser } from "@/lib/auth"
import { Navbar } from "@/components/navigation/navbar"
import { FadeIn } from "@/components/ui/fade-in"
import WalletConnectButton from "@/components/voter/WallectConnectButton"

export default function VoterLoginPage() {
  const [formData, setFormData] = useState({
    nationalId: "",
    fullName: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const user = await authenticateUser("voter", formData)
      if (user) {
        login(user)
        router.push("/voter/dashboard")
      }
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-md">
          <FadeIn delay={200}>
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 transition-all duration-300 hover:bg-secondary/20 hover:scale-110">
                  <Vote className="h-8 w-8 text-secondary transition-all duration-300" />
                </div>
                <CardTitle className="text-2xl font-serif">Voter Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access the verification process and voting system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nationalId">Voter ID Number</Label>
                    <Input
                      id="nationalId"
                      type="text"
                      placeholder="Enter your Voter ID"
                      value={formData.nationalId}
                      onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                      required
                      disabled={isLoading}
                      className="transition-all duration-300 focus:ring-2 focus:scale-[1.02]"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full transition-all duration-300 hover:scale-105 active:scale-95"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      "Continue to Verification"
                    )}
                  </Button>
                </form>
                <WalletConnectButton />
                <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4 transition-all duration-300 hover:bg-muted/50">
                  <h4 className="mb-2 text-sm font-medium">Next Steps</h4>
                  <p className="text-xs text-muted-foreground">
                    After login, you'll complete identity verification, then connect your wallet to participate in
                    voting.
                  </p>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </main>
    </div>
  )
}
