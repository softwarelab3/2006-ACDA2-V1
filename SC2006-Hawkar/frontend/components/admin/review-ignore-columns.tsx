"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// Assuming you have your types in a separate file // Import your server action
import { useState } from "react"
import { Star, XCircle } from "lucide-react"
import { toast } from "sonner"
import { ignoreReportedReview } from "@/app/lib/actions/admin-actions"
import { Review } from "@/app/types/review"

const IgnoreButton = ({ reviewID }: { reviewID: number }) => {
    const [isLoading, setIsLoading] = useState(false)

    const handleIgnore = async () => {
        try {
            setIsLoading(true)
            await ignoreReportedReview(reviewID.toString())
            toast.success("Successfully ignored reported review")
        } catch {
            toast.error("Error ignoring review, try again")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button onClick={handleIgnore} size="sm" disabled={isLoading}>
            {isLoading ? "Ignoring..." : "Ignore"}
        </Button>
    )
}

export const ReviewIgnoreColumns: ColumnDef<Review>[] = [
    {
        accessorKey: "reviewID",
        header: "ID",
    },
    {
        accessorKey: "reviewText",
        header: "Review",
    },
    {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => {
            const rating = row.original.rating

            return (
                <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            size={18}
                            className={`${star <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
                                }`}
                        />
                    ))}
                </div>
            )
        }
    },
    {
        accessorKey: "reportType",
        header: "Report Type",
    },
    {
        accessorKey: "reportText",
        header: "Report",
    },
    {
        accessorKey: "consumer.user.name",
        header: "Reported By",
    },
    {
        accessorKey: "ReportStatus",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.isReported

            return (
                <Badge variant={status ? "destructive" : "secondary"} className="flex items-center gap-1">
                    {status && (
                        <>
                            <XCircle className="h-3 w-3" /> Reported
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
            const review = row.original

            // Only show approve button if not verified
            if (review.isReported) {
                return <IgnoreButton reviewID={review.reviewID} />
            }

            return null
        },
    }
]