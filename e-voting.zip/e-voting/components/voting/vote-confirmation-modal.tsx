"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Vote, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { submitVote, type Party } from "@/lib/voting"

interface VoteConfirmationModalProps {
  party: Party
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function VoteConfirmationModal({ party, isOpen, onClose, onConfirm }: VoteConfirmationModalProps) {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async () => {
    if (!user) return

    setIsSubmitting(true)
    try {
      await submitVote(user.id, party.id)
      onConfirm()
    } catch (error) {
      console.error("Vote submission failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Vote className="h-5 w-5" />
            Confirm Your Vote
          </DialogTitle>
          <DialogDescription>
            Please review your selection carefully. Once submitted, your vote cannot be changed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Party Details */}
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

          {/* Warning */}
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-200">Important Notice</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Your vote will be recorded on the blockchain and cannot be changed once submitted. Please ensure this is
                your final choice.
              </p>
            </div>
          </div>

          {/* Voter Information */}
          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Voter:</strong> {user?.name}
            </p>
            <p>
              <strong>Wallet:</strong> {user?.walletAddress}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting}
            style={{ backgroundColor: party.color }}
            className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Vote...
              </>
            ) : (
              <>
                <Vote className="mr-2 h-4 w-4" />
                Confirm Vote
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
