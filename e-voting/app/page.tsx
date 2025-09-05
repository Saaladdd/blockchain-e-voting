"use client"

import Link from "next/link"
import { useEffect } from "react"
import { loadProvider, loadNetwork } from "@/lib/web3"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Vote, Users, Shield } from "lucide-react"
import { RootState, AppDispatch } from "./store";
import { ThemeToggle } from "@/components/theme-toggle"
import { FadeIn } from "@/components/ui/fade-in"
import { useDispatch, useSelector } from "react-redux";
import { connectWallet } from "@/lib/web3";

export default function HomePage() {

  const dispatch = useDispatch<AppDispatch>();
  const { provider, chainId, account } = useSelector((state: RootState) => state.web3);

  useEffect(() => {
    const init = async () => {
      const prov = loadProvider(dispatch);
      await loadNetwork(prov, dispatch);
    };
    init();
  }, [dispatch]);

  const handleConnect = async () => {
    await connectWallet(dispatch);
  };


  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-border bg-card transition-colors duration-300">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <FadeIn delay={100}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary transition-all duration-300 hover:scale-110">
                  <Vote className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-serif font-bold text-foreground">SecureVote</h1>
                  <p className="text-sm text-muted-foreground">Blockchain Voting System</p>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <ThemeToggle />
            </FadeIn>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <FadeIn delay={300}>
            <h2 className="mb-4 text-4xl font-serif font-bold text-foreground">Secure, Transparent, Democratic</h2>
            <p className="mb-12 text-lg text-muted-foreground">
              Access your role-based dashboard to participate in the democratic process with complete transparency and
              security.
            </p>
          </FadeIn>

          {/* Role Selection Cards */}
          <div className="grid gap-8 md:grid-cols-3">
            {/* Voter Card */}
            <FadeIn delay={400}>
              <Card className="group flex flex-col justify-between h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2">
                <CardHeader className="pb-4 flex-grow">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 transition-all duration-300 group-hover:bg-secondary/20 group-hover:scale-110">
                    <Vote className="h-8 w-8 text-primary transition-all duration-300 group-hover:scale-110" />
                  </div>
                  <CardTitle className="text-xl font-serif">Voter Access</CardTitle>
                  <CardDescription className="text-base">
                    Cast your vote securely using blockchain technology with wallet verification.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link href="/voter/login">
                    <Button className="w-full transition-all duration-300 hover:scale-105 active:scale-95" size="lg">
                      Login as Voter
                    </Button>
                  </Link>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Requires wallet connection and ID verification
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Party Card */}
            <FadeIn delay={500}>
              <Card className="group flex flex-col justify-between h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2">
                <CardHeader className="pb-4 flex-grow">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 transition-all duration-300 group-hover:bg-secondary/20 group-hover:scale-110">
                    <Users className="h-8 w-8 text-primary transition-all duration-300 group-hover:scale-110" />
                  </div>
                  <CardTitle className="text-xl font-serif">Party Access</CardTitle>
                  <CardDescription className="text-base">
                    Monitor your campaign performance and view real-time voting statistics.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link href="/party/login">
                    <Button
                      className="w-full transition-all duration-300 hover:scale-105 active:scale-95" size="lg"
                    >
                      Login as Party
                    </Button>
                  </Link>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Use credentials provided by election administrator
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Admin Card */}
            <FadeIn delay={600}>
              <Card className="group flex flex-col justify-between h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2">
                <CardHeader className="pb-4 flex-grow">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 transition-all duration-300 group-hover:scale-110">
                    <Shield className="h-8 w-8 text-primary transition-all duration-300 group-hover:scale-110" />
                  </div>
                  <CardTitle className="text-xl font-serif">Admin Access</CardTitle>
                  <CardDescription className="text-base">
                    Manage elections, parties, and oversee the entire voting process.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link href="/admin/login">
                    <Button
                      className="w-full transition-all duration-300 hover:scale-105 active:scale-95" size="lg"
                    >
                      Login as Admin
                    </Button>
                  </Link>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Administrative access with full system control
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          {/* Features Section */}
          <FadeIn delay={700}>
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              <div className="text-center group">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-muted transition-all duration-300 group-hover:bg-muted/80 group-hover:scale-110">
                  <Shield className="h-6 w-6 text-muted-foreground transition-all duration-300 group-hover:scale-110" />
                </div>
                <h3 className="mb-2 font-serif font-semibold">Blockchain Security</h3>
                <p className="text-sm text-muted-foreground">
                  Every vote is cryptographically secured and immutably recorded on the blockchain.
                </p>
              </div>
              <div className="text-center group">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-muted transition-all duration-300 group-hover:bg-muted/80 group-hover:scale-110">
                  <Vote className="h-6 w-6 text-muted-foreground transition-all duration-300 group-hover:scale-110" />
                </div>
                <h3 className="mb-2 font-serif font-semibold">Transparent Process</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time results and complete audit trail ensure full transparency.
                </p>
              </div>
              <div className="text-center group">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-muted transition-all duration-300 group-hover:bg-muted/80 group-hover:scale-110">
                  <Users className="h-6 w-6 text-muted-foreground transition-all duration-300 group-hover:scale-110" />
                </div>
                <h3 className="mb-2 font-serif font-semibold">Role-Based Access</h3>
                <p className="text-sm text-muted-foreground">
                  Secure, role-specific interfaces for voters, parties, and administrators.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </main>

      {/* Footer */}
      <FadeIn delay={800}>
        <footer className="border-t border-border bg-muted/30 py-8 transition-colors duration-300">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              Footer!
            </p>
          </div>
        </footer>
      </FadeIn>
    </div>
  )
}
