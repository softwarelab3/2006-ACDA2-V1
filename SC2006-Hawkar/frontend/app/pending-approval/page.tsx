import { getSession, getUserData, logout } from "../lib/actions/auth-actions"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { UserType } from "../types/auth"

export default async function PendingApprovalPage() {
  const session = await getSession()
  const userData = await getUserData()

  if (!session) {
    redirect("/login")
  }

  // If user is not a Hawker, redirect to appropriate page
  if (userData?.role !== UserType.Hawker) {
    if (userData?.role === UserType.Consumer) {
      redirect("/")
    } else if (userData?.role === UserType.Admin) {
      redirect("/admin")
    } else {
      redirect("/login")
    }
  }

  // If Hawker is already verified, redirect to hawker dashboard
  if (userData?.verifyStatus === true) {
    redirect("/hawker")
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Account Pending Approval</h1>
          <div className="mt-4 text-muted-foreground">
            <p>Thank you for registering as a Hawker on our platform!</p>
            <p className="mt-2">
              Your account is currently under review by our admin team. This process typically takes 1-2 business days.
            </p>
            <p className="mt-2">We&apos;ll notify you via email once your account has been approved.</p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <h3 className="font-medium text-amber-800">What happens next?</h3>
            <ul className="mt-2 text-sm text-amber-700 list-disc pl-5 space-y-1">
              <li>Our team will verify your SFA license number</li>
              <li>We&apos;ll review your provided information</li>
              <li>Once approved, you&apos;ll receive an email notification</li>
              <li>You can then log in and start setting up your stall profile</li>
            </ul>
          </div>

          <div className="pt-4 flex flex-col space-y-4">
            <Button asChild variant="outline">
              <Link href="mailto:support@hawkar.com">Contact Support</Link>
            </Button>
            <form action={logout}>
              <Button type="submit" className="w-full">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}