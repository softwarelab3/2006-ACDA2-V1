import { getSession, getUserData } from "../lib/actions/auth-actions"
import { redirect } from "next/navigation"
import Navbar from "@/components/navbar"
import HawkerDashboardContent from "@/components/hawker/hawker-dashboard-content"
import { fetchHawkerCenters, fetchStallsByHawkerID } from "../lib/actions/stall-actions"

export default async function HawkerDashboard() {

  const [session, userData, stalls, hawkerCenters] = await Promise.all([
    getSession(),
    getUserData(),
    fetchStallsByHawkerID(),
    fetchHawkerCenters()
  ]);

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
      <Navbar username={userData?.name || "Hawker"} userData={userData}/>
      <HawkerDashboardContent stalls={stalls} hawkerCenters={hawkerCenters} userId={session.userId} />
    </main>
  )
}