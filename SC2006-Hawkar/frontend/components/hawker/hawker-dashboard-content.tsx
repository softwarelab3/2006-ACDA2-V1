"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Plus, Store, Edit, Trash2, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import AddStallDialog from "./add-stall-dialog"
import { toast } from "sonner"
import type { Stall, StallFormData } from "@/app/types/stall"
import { addStall, updateStall, deleteStall } from "@/app/lib/actions/stall-actions"
import type { HawkerCenter } from "@/app/types/hawker"

interface HawkerDashboardContentProps {
  stalls: Array<Stall>
  userId: string
  hawkerCenters: Array<HawkerCenter>
}

export default function HawkerDashboardContent({ userId, hawkerCenters, stalls }: HawkerDashboardContentProps) {
  const router = useRouter()
  const [isAddStallOpen, setIsAddStallOpen] = useState(false)
  const [editingStall, setEditingStall] = useState<Stall | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [stallToDelete, setStallToDelete] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddStall = async (newStall: StallFormData) => {
    try {
      setIsLoading(true)
      await addStall(newStall)
      toast.success("Stall added successfully!")
      router.refresh() // Refresh the page to get updated stalls
    } catch (error) {
      console.error("Error adding stall:", error)
      toast.error(error instanceof Error ? error.message : "An error occurred while adding the stall")
    } finally {
      setIsLoading(false)
      setIsAddStallOpen(false)
    }
  }

  const handleEditStall = async (updatedStall: StallFormData) => {
    if (!editingStall) return

    console.log("Editing Stall", editingStall)
    console.log("Updated Stall", updatedStall)
    try {
      setIsLoading(true)

      // Use server action to update stall
      await updateStall(editingStall.stallID, updatedStall)

      toast.success("Stall updated successfully!")
      router.refresh() // Add this line to refresh the page
    } catch (error) {
      console.error("Error updating stall:", error)
      toast.error(error instanceof Error ? error.message : "An error occurred while updating the stall")
    } finally {
      setIsLoading(false)
      setIsAddStallOpen(false)
      setEditingStall(null)
    }
  }

  const handleDeleteStall = async () => {
    if (!stallToDelete) return

    try {
      setIsLoading(true)

      // Use server action to delete stall
      await deleteStall(stallToDelete)

      toast.success("Stall deleted successfully!")
    } catch (error) {
      console.error("Error deleting stall:", error)
      toast.error(error instanceof Error ? error.message : "An error occurred while deleting the stall")
    } finally {
      setIsLoading(false)
      setIsDeleteDialogOpen(false)
      setStallToDelete(null)
    }
  }

  const openEditDialog = (stall: Stall) => {
    setEditingStall(stall)
    setIsAddStallOpen(true)
  }

  const openDeleteDialog = (stallID: number) => {
    setStallToDelete(stallID)
    setIsDeleteDialogOpen(true)
  }

  function getValidImageUrl(imageArray?: string[], fallback: string = "/placeholder.svg"): string {
    if (!imageArray || !imageArray.length || !imageArray[0]) {
      return fallback;
    }

    try {
      // Test if it's a valid URL - this will throw an error for invalid URLs
      new URL(imageArray[0]);
      return imageArray[0];
    } catch {
      // If it's a relative path, it's okay
      if (imageArray[0].startsWith('/')) {
        return imageArray[0];
      }
      return fallback;
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Hawker Stalls</h1>
          <p className="text-muted-foreground">Manage your stalls and dishes</p>
        </div>
        <Button onClick={() => setIsAddStallOpen(true)} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" /> Add New Stall
        </Button>
      </div>

      {stalls.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <Store className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">No Stalls Yet</h2>
          <p className="mt-2 text-muted-foreground">Add your first stall to start managing your hawker business</p>
          <Button onClick={() => setIsAddStallOpen(true)} className="mt-4" disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" /> Add New Stall
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stalls.map((stall) => (
            <div key={stall.stallID}>
              <Card className="overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={getValidImageUrl(stall.images)}
                    alt={stall.stallName || "Stall image"}
                    fill
                    className="object-cover absolute bottom-5"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg truncate">{stall.stallName}</h3>
                    <p className="text-white/80 text-sm">{stall.hawkerCenter.name}</p>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Operating Hours</p>
                      <p>
                        {stall.startTime} - {stall.endTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Price Range</p>
                      <p>{stall.priceRange}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-muted-foreground text-sm">Cuisine Types</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {stall.cuisineType.map((cuisine) => (
                        <span key={String(cuisine)} className="px-2 py-1 bg-muted text-xs rounded-md">
                          {cuisine}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-t p-4 flex justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => openEditDialog(stall)} disabled={isLoading}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openDeleteDialog(stall.stallID)}
                      className="text-destructive hover:text-destructive"
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="default"
                    onClick={() => router.push(`/hawker/stall/${stall.stallID}`)}
                    className="flex items-center"
                    disabled={isLoading}
                  >
                    Manage Dishes
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              {/* Delete Confirmation Dialog */}
              {isDeleteDialogOpen && stall.stallID === stallToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-background rounded-lg p-6 max-w-md w-full">
                    <h2 className="text-xl font-bold mb-4">Delete Stall</h2>
                    <p>Are you sure you want to delete this stall? This action cannot be undone.</p>
                    <div className="flex justify-end gap-2 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsDeleteDialogOpen(false)
                          setStallToDelete(null)
                        }}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDeleteStall} disabled={isLoading}>
                        {isLoading ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Add Stall Dialog - moved outside the map function */}
      <AddStallDialog
        isOpen={isAddStallOpen}
        onClose={() => {
          setIsAddStallOpen(false)
          setEditingStall(null)
        }}
        onSubmit={editingStall ? handleEditStall : handleAddStall}
        editingStall={editingStall}
        hawkerID={Number.parseInt(userId)}
        isLoading={isLoading}
        hawkerCenters={hawkerCenters}
      />
    </div>
  )
}
