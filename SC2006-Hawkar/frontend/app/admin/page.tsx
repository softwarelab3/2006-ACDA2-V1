import React from 'react'
import { getSession, getUserData } from "../lib/actions/auth-actions"
import { redirect } from "next/navigation"
import Navbar from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { UserCheck, Flag } from "lucide-react"
import { fetchAllHawkers } from '../lib/actions/admin-actions'
import { Hawker } from '../types/hawker'
import { Review } from '../types/review'
import { fetchReportedReviews } from '../lib/actions/review-actions'

 const AdminDashboard = async () => {
  const session = await getSession()
  const userData = await getUserData()
  const hawkers: Array<Hawker> = await fetchAllHawkers()
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

  const pendingHawkers = hawkers.filter(r => r.verifyStatus == false)

  return (
    <main className="min-h-screen flex flex-col ">
      <Navbar username={userData?.name || "Admin"} userData={userData}/>
      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            Welcome to the admin dashboard. Manage users, review reports, and oversee the platform.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className='py-8'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hawker Approvals</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingHawkers.length}</div>
              <p className="text-xs text-muted-foreground">Pending approval requests</p>
              <Button asChild className="w-full mt-4">
                <Link href="/admin/hawker-approvals">Manage Approvals</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className='py-8'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reported Reviews</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportedReviews.length}</div>
              <p className="text-xs text-muted-foreground">Reviews flagged by hawkers</p>
              <Button asChild className="w-full mt-4">
                <Link href="/admin/reported-reviews">Manage Reports</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default AdminDashboard
