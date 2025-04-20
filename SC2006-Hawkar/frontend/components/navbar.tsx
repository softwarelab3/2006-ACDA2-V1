"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Bell, Globe, User, ArrowLeft, Heart, Bookmark } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { logout } from "@/app/lib/actions/auth-actions"
import { Stall } from "@/app/types/stall"
import { UserData } from "@/app/types/auth"

interface NavbarProps {
  username?: string
  stallName?: string
  savedStalls?: Array<Stall>
  userData: UserData
}

// Mock data for notifications
const notifications = [
  {
    id: "1",
    type: "review",
    message: "Michael Wong replied to your review on Tian Tian Chicken Rice",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "promotion",
    message: "New promotion at Liao Fan Hawker Chan: 20% off on weekdays",
    time: "1 day ago",
    read: true,
  },
  {
    id: "3",
    type: "system",
    message: "Welcome to Hawkar! Discover the best hawker stalls in Singapore.",
    time: "3 days ago",
    read: true,
  },
]

export default function Navbar({ username = "User", stallName, savedStalls, userData }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showSavedStalls, setShowSavedStalls] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  // Update the profileData state to remove bio and rename phone to contactNumber
  const [profileData, setProfileData] = useState({
    name: userData.name,
    email: userData.emailAddress,
    contactNumber: userData.contactNumber,
    profilePhoto: userData.profilePhoto,
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [notificationCount, setNotificationCount] = useState(notifications.filter((n) => !n.read).length)

  const pathname = usePathname()
  const router = useRouter()
  const isStallDetailPage = pathname.startsWith("/stall/")

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push("/")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)

      // Create a preview URL for the selected image
      const fileUrl = URL.createObjectURL(file)
      setPreviewUrl(fileUrl)
    }
  }

  const handleProfilePictureUpdate = () => {
    // Trigger the hidden file input
    document.getElementById("profile-picture-input")?.click()
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would upload the file to your server
    // and get back a URL to the uploaded image
    if (selectedFile) {
      console.log("Uploading file:", selectedFile)
      // After successful upload, you would update the profileData
      // setProfileData({ ...profileData, profilePicture: uploadedFileUrl })
    }

    // Update other profile data
    console.log("Updating profile:", profileData)

    // Clean up the preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }

    setSelectedFile(null)
    setShowEditProfile(false)
  }

  const markAllNotificationsAsRead = () => {
    // In a real app, you would update this in your database
    setNotificationCount(0)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          {isStallDetailPage ? (
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="hidden md:block font-medium truncate max-w-[200px]">{stallName}</div>
            </div>
          ) : (
            <Link href="/" className="font-bold text-xl">
              Hawkar
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" aria-label="Change language">
            <Globe className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            onClick={() => setShowNotifications(true)}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </Button>

          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  {
                    <Avatar className="h-8 w-8">
                      {profileData.profilePhoto && (
                        <AvatarImage
                          src={profileData.profilePhoto}
                          alt={profileData.name}
                          className="object-cover"
                        />
                      )}
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        {getInitials(profileData.name)}
                      </AvatarFallback>
                    </Avatar>
      } 
                </div>
                <span className="hidden sm:inline-block">Hi, {username}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm font-medium">Hi, {username}</div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowEditProfile(true)}>
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </DropdownMenuItem>
              {
                userData.role === "Consumer" && (
                  <DropdownMenuItem onClick={() => setShowSavedStalls(true)}>
                    <Bookmark className="h-4 w-4 mr-2" />
                    Saved Stalls
                  </DropdownMenuItem>
                )
              }
              <DropdownMenuItem onClick={() => logout()}>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your profile information below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleProfileUpdate}>
            <div className="flex flex-col items-center gap-2 mb-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={previewUrl || profileData.profilePhoto} alt={profileData.name} className="object-cover" />
                <AvatarFallback>{getInitials(profileData.name)}</AvatarFallback>
              </Avatar>
              <Button type="button" size="sm" variant="ghost" onClick={handleProfilePictureUpdate}>
                <span>Change profile picture</span>
              </Button>
              <input
                id="profile-picture-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {selectedFile && <p className="text-xs text-muted-foreground mt-1">{selectedFile.name}</p>}
            </div>
            <div className="flex flex-col gap-4">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="py-6"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <div className="col-span-3">
                  <Input id="password" type="password" placeholder="••••••••" className="mb-2 py-6" />
                  <Input id="confirmPassword" type="password" placeholder="Confirm password" className="py-6" />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="contactNumber" className="text-right">
                  Contact Number
                </Label>
                <Input
                  id="contactNumber"
                  value={profileData.contactNumber}
                  onChange={(e) => setProfileData({ ...profileData, contactNumber: e.target.value })}
                  className="py-6"
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setShowEditProfile(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Saved Stalls Dialog */}
      <Dialog open={showSavedStalls} onOpenChange={setShowSavedStalls}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Saved Stalls</DialogTitle>
            <DialogDescription>Your favorite hawker stalls in one place.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {savedStalls && savedStalls.length > 0 ? (
              savedStalls.map((stall) => (
                <Card
                  key={stall.stallID}
                  className="cursor-pointer hover:bg-muted/50 py-2"
                  onClick={() => {
                    router.push(`/stall/${stall.stallID}`)
                    setShowSavedStalls(false)
                  }}
                >
                  <CardContent className="p-3 flex gap-4">
                    <div className="relative h-16 w-24 flex-shrink-0">
                      <Image
                        src={stall.images[0] || "/placeholder.svg"}
                        alt={stall.stallName}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{stall.stallName}</h3>
                      <p className="text-sm text-muted-foreground">{stall.hawkerCenter.name}</p>
                      <span className="text-sm text-muted-foreground">{stall.priceRange}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 self-start"
                      disabled={true}
                    >
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">You haven&apos;t saved any stalls yet.</p>
                <Button
                  className="mt-4"
                  onClick={() => {
                    router.push("/")
                    setShowSavedStalls(false)
                  }}
                >
                  Explore Stalls
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Sheet */}
      <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
        <SheetContent side="right" className="w-full sm:max-w-md p-4">
          <SheetHeader className="mb-2">
            <SheetTitle className="flex justify-between items-center mt-4">
              <span>Notifications</span>
              {notificationCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllNotificationsAsRead}>
                  Mark all as read
                </Button>
              )}
            </SheetTitle>
          </SheetHeader>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4 space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border rounded-lg ${!notification.read ? "bg-muted/50" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`mt-1 h-2 w-2 rounded-full ${!notification.read ? "bg-blue-500" : "bg-transparent"}`}
                      />
                      <div className="flex-1">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No notifications yet.</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="unread" className="mt-4 space-y-4">
              {notifications.filter((n) => !n.read).length > 0 ? (
                notifications
                  .filter((n) => !n.read)
                  .map((notification) => (
                    <div key={notification.id} className="p-3 border rounded-lg bg-muted/50">
                      <div className="flex items-start gap-2">
                        <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                        <div className="flex-1">
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No unread notifications.</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="read" className="mt-4 space-y-4">
              {notifications.filter((n) => n.read).length > 0 ? (
                notifications
                  .filter((n) => n.read)
                  .map((notification) => (
                    <div key={notification.id} className="p-3 border rounded-lg">
                      <div className="flex items-start gap-2">
                        <div className="mt-1 h-2 w-2 rounded-full bg-transparent" />
                        <div className="flex-1">
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No read notifications.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </header>
  )
}