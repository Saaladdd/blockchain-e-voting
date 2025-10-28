"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Shield, LogOut } from "lucide-react"
import { mockElections, type Election } from "@/lib/elections"
import { ElectionsList } from "@/components/admin/elections-list"

export default function AdminDashboard() {
  const [elections, setElections] = useState<Election[]>(mockElections)


  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logged out")
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl space-y-8">
          {/* Elections List */}
          <ElectionsList />
        </div>
      </main>
    </div>
  )
}
