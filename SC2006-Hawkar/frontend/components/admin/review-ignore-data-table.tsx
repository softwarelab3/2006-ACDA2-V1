"use client"

import { ignoreReportedReview } from "@/app/lib/actions/review-actions";
import { Review } from "@/app/types/review";
import { useOptimistic } from "react";
import ReviewDataTable from "./review-data-table";
import { ReviewIgnoreColumns } from "./review-ignore-columns";

interface IgnoreTableProps {
    reportedReviews: Array<Review>
}

export default function ReportedReviewIgnoreTable({ reportedReviews }: IgnoreTableProps) {
    const [optimisticReportedReviews, updateReportedReviews] = useOptimistic(reportedReviews, (state, reviewID: number) =>
        state.map((reportedReview) => (reportedReview.reviewID === reviewID ? { ...reportedReview, isReported: false } : reportedReview)),
    )

    const handleIgnoreReview = async (reviewID: number) => {
        // Update the UI optimistically
        updateReportedReviews(reviewID)
        // Call the server action
        try {
          await ignoreReportedReview(reviewID)
        } catch (error) {
          console.error("Error ignoring review:", error)
          // You might want to revert the optimistic update here
          // or show an error message to the user
        }
      }
    
      return (
        <div>
          <ReviewDataTable columns={ReviewIgnoreColumns} data={optimisticReportedReviews} ignoreAction={handleIgnoreReview} />
        </div>
      )
    
}