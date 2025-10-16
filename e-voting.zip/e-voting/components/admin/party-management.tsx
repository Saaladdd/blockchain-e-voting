"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Eye, Copy, Check } from "lucide-react"
import { mockPartyCredentials, createParty, type PartyCredentials } from "@/lib/admin-data"
import { mockParties } from "@/lib/voting"

export function PartyManagement() {
  const [isCreating, setIsCreating] = useState(false)
  const [showCredentials, setShowCredentials] = useState<PartyCredentials | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
    logo: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      const result = await createParty(formData)
      setShowCredentials(result.credentials)
      setFormData({ name: "", symbol: "", description: "", logo: "" })
    } catch (error) {
      console.error("Failed to create party:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Add New Party */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Party
          </CardTitle>
          <CardDescription>Create a new political party and generate login credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Party Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter party name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="symbol">Party Symbol</Label>
                <Input
                  id="symbol"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  placeholder="e.g., PA, UC, DR"
                  maxLength={5}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the party"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL (Optional)</Label>
              <Input
                id="logo"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="https://example.com/logo.png"
                type="url"
              />
            </div>
            <Button
              type="submit"
              disabled={isCreating}
              className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isCreating ? "Creating Party..." : "Create Party"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Parties */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Parties</CardTitle>
          <CardDescription>Manage existing political parties and their credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Party</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockParties.map((party) => {
                const credentials = mockPartyCredentials.find((cred) => cred.partyId === party.id)
                return (
                  <TableRow key={party.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={party.logo || "/placeholder.svg"}
                          alt={party.name}
                          className="h-8 w-8 rounded object-cover"
                        />
                        <div>
                          <div className="font-medium">{party.name}</div>
                          <div className="text-sm text-muted-foreground">{party.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" style={{ borderColor: party.color, color: party.color }}>
                        {party.symbol}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={credentials?.isActive ? "default" : "secondary"}>
                        {credentials?.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {credentials?.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {credentials && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] bg-transparent"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Credentials
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Party Login Credentials</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Username</Label>
                                <div className="flex items-center gap-2">
                                  <Input value={credentials.username} readOnly />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copyToClipboard(credentials.username, "username")}
                                    className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                  >
                                    {copiedField === "username" ? (
                                      <Check className="h-4 w-4" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <Label>Password</Label>
                                <div className="flex items-center gap-2">
                                  <Input value={credentials.password} readOnly type="password" />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copyToClipboard(credentials.password, "password")}
                                    className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                  >
                                    {copiedField === "password" ? (
                                      <Check className="h-4 w-4" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950">
                                <p className="text-sm text-amber-800 dark:text-amber-200">
                                  <strong>Important:</strong> Share these credentials securely with the party
                                  representatives. They cannot be recovered if lost.
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Credentials Modal */}
      {showCredentials && (
        <Dialog open={!!showCredentials} onOpenChange={() => setShowCredentials(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Party Created Successfully!</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                <p className="text-sm text-green-800 dark:text-green-200">
                  The party has been created successfully. Here are the login credentials:
                </p>
              </div>
              <div>
                <Label>Username</Label>
                <div className="flex items-center gap-2">
                  <Input value={showCredentials.username} readOnly />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(showCredentials.username, "new-username")}
                    className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {copiedField === "new-username" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <Label>Password</Label>
                <div className="flex items-center gap-2">
                  <Input value={showCredentials.password} readOnly />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(showCredentials.password, "new-password")}
                    className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {copiedField === "new-password" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Save these credentials!</strong> They cannot be recovered once this dialog is closed.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
