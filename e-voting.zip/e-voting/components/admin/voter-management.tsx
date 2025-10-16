"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle, Clock, Users } from "lucide-react"
import { mockVoterApplications, approveVoter, rejectVoter, type VoterApplication } from "@/lib/admin-data"

export function VoterManagement() {
  const [applications, setApplications] = useState<VoterApplication[]>(mockVoterApplications)
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleApprove = async (applicationId: string) => {
    setProcessingId(applicationId)
    try {
      await approveVoter(applicationId)
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, status: "approved", reviewedAt: new Date(), reviewedBy: "Admin User" }
            : app,
        ),
      )
    } catch (error) {
      console.error("Failed to approve voter:", error)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (applicationId: string) => {
    setProcessingId(applicationId)
    try {
      await rejectVoter(applicationId)
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, status: "rejected", reviewedAt: new Date(), reviewedBy: "Admin User" }
            : app,
        ),
      )
    } catch (error) {
      console.error("Failed to reject voter:", error)
    } finally {
      setProcessingId(null)
    }
  }

  const pendingCount = applications.filter((app) => app.status === "pending").length
  const approvedCount = applications.filter((app) => app.status === "approved").length
  const rejectedCount = applications.filter((app) => app.status === "rejected").length

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold">{applications.length}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{approvedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{rejectedCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voter Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Voter Applications</CardTitle>
          <CardDescription>Review and manage voter verification applications</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>National ID</TableHead>
                <TableHead>Wallet Address</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <div className="font-medium">{application.name}</div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm">{application.nationalId}</code>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm">{application.walletAddress}</code>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {application.appliedAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        application.status === "approved"
                          ? "default"
                          : application.status === "rejected"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {application.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {application.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(application.id)}
                          disabled={processingId === application.id}
                          className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(application.id)}
                          disabled={processingId === application.id}
                          className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <XCircle className="mr-1 h-3 w-3" />
                          Reject
                        </Button>
                      </div>
                    )}
                    {application.status !== "pending" && application.reviewedAt && (
                      <div className="text-xs text-muted-foreground">
                        Reviewed {application.reviewedAt.toLocaleDateString()}
                        <br />
                        by {application.reviewedBy}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
