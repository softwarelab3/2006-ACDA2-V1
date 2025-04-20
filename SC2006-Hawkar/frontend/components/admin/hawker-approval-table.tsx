"use client"

import { useOptimistic } from "react"
import { ApprovalColumns } from "@/components/admin/approval-columns"
import type { Hawker } from "@/app/types/hawker"
import { approveHawker } from "@/app/lib/actions/admin-actions"
import ApprovalDataTable from "./approval-data-table"

interface ApprovalTableProps {
  hawkers: Array<Hawker>
}

export default function HawkerApprovalTable({ hawkers }: ApprovalTableProps) {
  // Use optimistic UI to immediately update the UI when a hawker is approved
  const [optimisticHawkers, updateOptimisticHawkers] = useOptimistic(hawkers, (state, hawkerID: number) =>
    state.map((hawker) => (hawker.hawkerID === hawkerID ? { ...hawker, verifyStatus: true } : hawker)),
  )

  // Create a client-side wrapper for the server action
  const handleApproveHawker = async (hawkerID: number) => {
    // Update the UI optimistically
    updateOptimisticHawkers(hawkerID)
    // Call the server action
    try {
      await approveHawker(hawkerID.toString())
    } catch (error) {
      console.error("Error approving hawker:", error)
      // You might want to revert the optimistic update here
      // or show an error message to the user
    }
  }

  return (
    <div>
      <ApprovalDataTable columns={ApprovalColumns} data={optimisticHawkers} approveAction={handleApproveHawker} />
    </div>
  )
}
