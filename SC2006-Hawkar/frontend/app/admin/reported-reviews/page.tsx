import { getSession, getUserData } from "@/app/lib/actions/auth-actions"
import { fetchReportedReviews } from "@/app/lib/actions/review-actions"
import { Review } from "@/app/types/review"
import ReportedReviewIgnoreTable from "@/components/admin/review-ignore-data-table"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"

export default async function ReportedReviewPage() {
  const session = await getSession()
  const userData = await getUserData()
  const reportedReviews: Array<Review> = await fetchReportedReviews()

  if (!session) {
    redirect('/login')
  }

  if (userData?.role !== "Admin") {
    // If not an admin, redirect to appropriate page
    if (userData?.role === "Consumer") {
      redirect("/")
    } else if (userData?.role === "Hawker") {
      if (userData?.verifyStatus === false) {
        redirect("/pending-approval")
      }
      redirect("/hawker")
    } else {
      redirect("/login")
    }
  }
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar username={userData?.name || "Admin"} userData={userData}/>
      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Reported Reviews</h1>
            <p className="text-muted-foreground">Manage reviews that have been reported by hawkers</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>
        <Suspense fallback={<div>Loading review data...</div>}>
              <ReportedReviewIgnoreTable reportedReviews={reportedReviews} />
          </Suspense>
      </div>
    </main>
  )
}