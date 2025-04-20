"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// Assuming you have your types in a separate file // Import your server action
import { useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { approveHawker } from "@/app/lib/actions/admin-actions"
import { Hawker } from "@/app/types/hawker"

// This is a client component that handles the approve button
const ApproveButton = ({ hawkerID }: { hawkerID: number }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleApprove = async () => {
    try {
      setIsLoading(true)
      await approveHawker(hawkerID.toString())
      toast.success("Successfully approved hawker")
    } catch {
      toast.error("Error approving hawker, try again")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleApprove} size="sm" disabled={isLoading}>
      {isLoading ? "Approving..." : "Approve"}
    </Button>
  )
}

export const ApprovalColumns: ColumnDef<Hawker>[] = [
  {
    accessorKey: "hawkerID",
    header: "ID",
  },
  {
    accessorKey: "user.name",
    header: "Name",
  },
  {
    accessorKey: "user.emailAddress",
    header: "Email",
  },
  {
    accessorKey: "license",
    header: "License",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "user.contactNumber",
    header: "Contact",
  },
  {
    accessorKey: "verifyStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.verifyStatus

      return (
        <Badge variant={status ? "default" : "secondary"} className="flex items-center gap-1">
          {status ? (
            <>
              <CheckCircle className="h-3 w-3" /> Verified
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3" /> Pending
            </>
          )}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value === row.getValue(id)
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const hawker = row.original

      // Only show approve button if not verified
      if (!hawker.verifyStatus) {
        return <ApproveButton hawkerID={hawker.hawkerID} />
      }

      return null
    },
  },
]
