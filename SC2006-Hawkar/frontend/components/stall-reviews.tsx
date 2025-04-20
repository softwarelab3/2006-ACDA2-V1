"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Edit, Trash2, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ReportFormData, ReportType, Review, ReviewFormData } from "@/app/types/review"
import { addReview, deleteReview, editReview, reportReview } from "@/app/lib/actions/review-actions"
import { useRouter } from "next/navigation"
import { UserData } from "@/app/types/auth"

interface StallReviewsProps {
  reviews: Review[]
  rating: number
  reviewCount: number
  currentUserId: string
  stallID: number
  userData: UserData
}

export interface ReportPayload {
  stallID: number
  reportType: ReportType
  reportText: string
}

export default function StallReviews({ reviews, rating, reviewCount, currentUserId, stallID, userData }: StallReviewsProps) {
  const [sortBy, setSortBy] = useState("recent")
  const [showAddReviewDialog, setShowAddReviewDialog] = useState(false)
  const [showEditReviewDialog, setShowEditReviewDialog] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [newReviewRating, setNewReviewRating] = useState(5)
  const [newReviewContent, setNewReviewContent] = useState("")
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [reportingReview, setReportingReview] = useState<Review | null>(null)
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null)
  const [reportType, setReportType] = useState<string>("spam")
  const [reportReason, setReportReason] = useState("")
  const router = useRouter()

  const validReviews = reviews.filter(r => !r.isReported)

  const ratingCounts = [0, 0, 0, 0, 0];

  validReviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating - 1]++;
    }
  });


  const maxCount = Math.max(...ratingCounts)

  const handleAddReview = async () => {
    try {
      const formData: ReviewFormData = {
        reviewText: newReviewContent,
        rating: newReviewRating,
        consumerID: Number.parseInt(currentUserId),
        stallID: stallID,
      }

      await addReview(formData)
      toast("Your review has been successfully submitted!")
      setShowAddReviewDialog(false)
      setNewReviewRating(5)
      setNewReviewContent("")
      router.refresh()
    } catch (error) {
      toast.error("Failed to submit review. Please try again.")
      console.error(error)
    }
  }


  const handleEditReview = async () => {
    if (!editingReview) return

    try {
      const formData: ReviewFormData = {
        reviewText: newReviewContent,
        rating: newReviewRating,
        consumerID: editingReview.consumerID,
        stallID: stallID,
      }

      await editReview(editingReview.reviewID, formData)
      toast("Your review has been updated successfully")
      setShowEditReviewDialog(false)
      setEditingReview(null)
      setNewReviewRating(5)
      setNewReviewContent("")
      router.refresh() // Refresh the reviews
    } catch (error) {
      toast.error("Failed to update review. Please try again.")
      console.error(error)
    }
  }

  const handleDeleteReview = async () => {
    if (!deletingReviewId) return

    try {
      await deleteReview(deletingReviewId, stallID)
      toast("Your review has been deleted successfully")
      setShowDeleteDialog(false)
      setDeletingReviewId(null)
      router.refresh()// Refresh the reviews
    } catch (error) {
      toast.error("Failed to delete review. Please try again.")
      console.error(error)
    }
  }

  const handleReportReview = async () => {
    if (!reportingReview) return

    try {
      const reportData: ReportFormData = {
        reportType: reportType as ReportType,
        reportText: reportReason,
      }

      // Since your reportReview function expects ReviewFormData, we need to adapt
      const reportFormData: ReportPayload = {
        stallID: stallID,
        ...reportData,
      }

      await reportReview(reportingReview.reviewID, reportFormData)
      toast("Thank you for your feedback. We'll review this report.")
      setShowReportDialog(false)
      setReportingReview(null)
      setReportType("spam")
      setReportReason("")
      router.refresh() // Refresh the reviews
    } catch (error) {
      toast.error("Failed to submit report. Please try again.")
      console.error(error)
    }
  }

  const openEditDialog = (review: Review) => {
    setEditingReview(review)
    setNewReviewRating(review.rating)
    setNewReviewContent(review.reviewText)
    setShowEditReviewDialog(true)
  }

  const openReportDialog = (review: Review) => {
    setReportingReview(review)
    setShowReportDialog(true)
  }

  const openDeleteDialog = (reviewId: number) => {
    setDeletingReviewId(reviewId)
    setShowDeleteDialog(true)
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-muted/30 p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl font-bold">{rating.toFixed(1)}</span>
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
          </div>
          <p className="text-sm text-muted-foreground mb-4">{reviewCount} ratings</p>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm w-3">{star}</span>
                <div className="h-2 bg-muted flex-1 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{
                      width: `${maxCount > 0 ? (ratingCounts[star - 1] / maxCount) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-muted-foreground w-8">{ratingCounts[star - 1]}</span>
              </div>
            ))}
          </div>
        </div>
        {
          userData.role === "Consumer" && (
            <div className="flex flex-col justify-center items-center gap-4 p-6">
              <p className="text-center">Share your experience at this stall</p>
              <Button size="lg" className="w-full sm:w-auto" onClick={() => setShowAddReviewDialog(true)}>
                Add Review
              </Button>
            </div>
          )
        }

      </div>
      {
        validReviews.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Reviews</h3>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="highest">Highest Rating</SelectItem>
                <SelectItem value="lowest">Lowest Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )
      }


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {validReviews.map((review) => {
          const isCurrentUserReview = review.consumerID === parseInt(currentUserId)

          return (
            <Card key={review.reviewID} className="py-2">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={review.consumer.user.profilePhoto}
                      alt={review.consumer.user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{review.consumer.user.name}</p>
                        <div className="flex items-center gap-1 my-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={`${star <= review.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {isCurrentUserReview ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => openEditDialog(review)}
                            >
                              <Edit size={16} />
                              <span className="sr-only">Edit review</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => openDeleteDialog(review.reviewID)}
                            >
                              <Trash2 size={16} />
                              <span className="sr-only">Delete review</span>
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => openReportDialog(review)}
                          >
                            <Flag size={16} />
                            <span className="sr-only">Report review</span>
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm mt-2">{review.reviewText}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {reviews.length > 3 && (
        <div className="mt-6 text-center">
          <Button variant="outline">Show more reviews</Button>
        </div>
      )}

      {/* Add Review Dialog */}
      <Dialog open={showAddReviewDialog} onOpenChange={setShowAddReviewDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Review</DialogTitle>
            <DialogDescription>
              Share your experience with this stall. Your review will help others make better choices.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="rating">Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-5 w-5 ${star <= newReviewRating ? "text-amber-400" : "text-muted-foreground"}`}
                    onClick={() => setNewReviewRating(star)}
                  >
                    <Star className={star <= newReviewRating ? "fill-amber-400" : ""} />
                    <span className="sr-only">{star} stars</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="review">Review</Label>
              <Textarea
                id="review"
                placeholder="Write your review here..."
                value={newReviewContent}
                onChange={(e) => setNewReviewContent(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddReviewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddReview} disabled={!newReviewContent.trim()}>
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Review Dialog */}
      <Dialog open={showEditReviewDialog} onOpenChange={setShowEditReviewDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
            <DialogDescription>Update your review for this stall.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="rating">Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-5 w-5 ${star <= newReviewRating ? "text-amber-400" : "text-muted-foreground"}`}
                    onClick={() => setNewReviewRating(star)}
                  >
                    <Star className={star <= newReviewRating ? "fill-amber-400" : ""} />
                    <span className="sr-only">{star} stars</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="review">Review</Label>
              <Textarea
                id="review"
                placeholder="Write your review here..."
                value={newReviewContent}
                onChange={(e) => setNewReviewContent(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditReviewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditReview} disabled={!newReviewContent.trim()}>
              Update Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Review Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Report Review</DialogTitle>
            <DialogDescription>Please let us know why you&apos;re reporting this review.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-2">
            <div className="flex flex-col gap-3">
              <Label>Reason for reporting</Label>
              <RadioGroup value={reportType} onValueChange={setReportType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="spam" id="spam" />
                  <Label htmlFor="spam">Spam</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="irrelevant" id="irrelevant" />
                  <Label htmlFor="irrelevant">Irrelevant to food</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="offensive" id="offensive" />
                  <Label htmlFor="offensive">Offensive</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="reason">Why is it irrelevant?</Label>
              <Textarea
                id="reason"
                placeholder="Please provide additional details..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleReportReview}>Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Review Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your review. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReview}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}