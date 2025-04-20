import { getSession, getUserData } from "@/app/lib/actions/auth-actions"
import { redirect } from "next/navigation"
import Navbar from "@/components/navbar"
import StallManagementContent from "@/components/hawker/stall-management-context"
import { fetchStallByStallID } from "@/app/lib/actions/stall-actions"
import { fetchDishesByStallID } from "@/app/lib/actions/dish-actions"
import { fetchReviewsByStallID } from "@/app/lib/actions/review-actions"

export default async function StallManagementPage(props: { params: Promise<{ id: string }> }) {
  // First await the params Promise, then destructure
  const params = await props.params;
  const { id } = params;
  
  const session = await getSession()
  const userData = await getUserData()
  const stall = await fetchStallByStallID(parseInt(id))
  const dishes = await fetchDishesByStallID(parseInt(id))
  const reviews = await fetchReviewsByStallID(parseInt(id))

  if (!session) {
    redirect("/login")
  }

  if (userData?.role !== "Hawker") {
    // If not a hawker, redirect to appropriate page
    if (userData?.role === "Consumer") {
      redirect("/")
    } else if (userData?.role === "Admin") {
      redirect("/admin")
    } else {
      redirect("/login")
    }
  }

  // Check verification status
  if (userData?.verifyStatus === false) {
    redirect("/pending-approval")
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar username={userData?.name || "Hawker"} userData={userData} />
      <StallManagementContent stall={stall} dishes={dishes} reviews={reviews} userId={session.userId} userData={userData} />
    </main>
  )
}