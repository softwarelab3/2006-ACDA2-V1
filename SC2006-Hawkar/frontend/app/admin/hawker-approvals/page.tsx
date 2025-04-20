import { fetchAllHawkers } from "@/app/lib/actions/admin-actions";
import { getSession, getUserData } from "@/app/lib/actions/auth-actions";
import HawkerApprovalTable from "@/components/admin/hawker-approval-table";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function HawkerApprovalsPage() {
  const session = await getSession()
  const userData = await getUserData()
  const hawkers = await fetchAllHawkers()

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
      <Navbar username={userData?.name || "Admin"} userData={userData} />
      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Hawker Approval Requests</h1>
            <p className="text-muted-foreground">Review and manage hawker registration requests</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>
        <Suspense fallback={<div>Loading hawker data...</div>}>
          <HawkerApprovalTable hawkers={hawkers} />
        </Suspense>
      </div>
    </main>
  )
}
