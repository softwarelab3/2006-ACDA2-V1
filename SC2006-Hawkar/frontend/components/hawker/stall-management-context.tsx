"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ArrowLeft, Edit, Trash2, Tag } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import type { UserData } from "@/app/types/auth"
import AddDishDialog from "./add-dish-dialog"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dish, DishFormData } from "@/app/types/dish"
import { Stall } from "@/app/types/stall"
import { addDish, deleteDish, editDish } from "@/app/lib/actions/dish-actions"
import { Review } from "@/app/types/review"
import { getRatingStats } from "../stall-details"
import StallReviews from "../stall-reviews"


interface StallManagementContentProps {
  stall: Stall
  dishes: Array<Dish>
  userId: string
  reviews: Array<Review>
  userData: UserData
}

export default function StallManagementContent({ stall, dishes, reviews, userId, userData }: StallManagementContentProps) {
  const router = useRouter()
  const [isAddDishOpen, setIsAddDishOpen] = useState(false)
  const [editingDish, setEditingDish] = useState<Dish | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [dishToDelete, setDishToDelete] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("dishes")
  const [isLoading, setIsLoading] = useState(false)
  const { averageRating, totalRatings } = getRatingStats(reviews)

  const handleAddDish = async(newDish: DishFormData) => {
    try {
      setIsLoading(true)
      await addDish(stall.stallID, newDish)
      toast.success("Dish Added successfully")
      router.refresh()
    } catch (error) {
      console.error("Error adding dish: ", error)
      toast.error(error instanceof Error ? error.message : "An error occurred while adding the dish")
    } finally {
      setIsLoading(false)
      setIsAddDishOpen(false)
    }
  }

  const handleEditDish = async (updatedDish: DishFormData) => {
    if (!editingDish) return

    try {
      setIsLoading(true)
      await editDish(stall.stallID, editingDish.dishID, updatedDish)
      toast.success("Dish updated successfully")
      router.refresh()
    } catch (error) {
      console.error("Error updating stall:", error)
      toast.error(error instanceof Error ? error.message : "An error occurred while updating dish")
    } finally {
      setIsLoading(false)
      setIsAddDishOpen(false)
      setEditingDish(null)
    }
  }

  const handleDeleteDish = async () => {
    if (!dishToDelete) return

    try {
      await deleteDish(stall.stallID, dishToDelete)
    } catch (error) {
      console.error("Error deleting dish:", error)
      toast.error(error instanceof Error ? error.message : "An error occurred while deleting the dish")
    } finally {
      setIsLoading(false)
      setIsDeleteDialogOpen(false)
      setDishToDelete(null)
    }
  }

  const openEditDialog = (dish: Dish) => {
    setEditingDish(dish)
    setIsAddDishOpen(true)
  }

  const openDeleteDialog = (dishID: number) => {
    setDishToDelete(dishID)
    setIsDeleteDialogOpen(true)
  }

  if (!stall) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>Loading stall details...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.push("/hawker")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{stall.stallName}</h1>
          <p className="text-muted-foreground">{stall.hawkerCenter.name}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="dishes">Menu Items</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="dishes">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Menu Items</h2>
              <p className="text-muted-foreground">Manage your dishes and promotions</p>
            </div>
            <Button onClick={() => setIsAddDishOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Dish
            </Button>
          </div>

          {dishes.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-lg">
              <Tag className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">No Dishes Yet</h2>
              <p className="mt-2 text-muted-foreground">Add your first dish to start building your menu</p>
              <Button onClick={() => setIsAddDishOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Add New Dish
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {dishes.map((dish) => (
                <Card key={dish.dishID} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image src={dish.photo || "/placeholder.svg"} alt={dish.dishName} fill className="object-cover" />
                    {dish.onPromotion && <Badge className="absolute top-2 right-2 bg-red-500">Promotion</Badge>}
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{dish.dishName}</CardTitle>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <div className="flex justify-between items-center">
                      {dish.onPromotion ? (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground line-through">${dish.price.toFixed(2)}</span>
                          <span className="font-bold text-red-500">${dish.discountedPrice?.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="font-bold">${dish.price.toFixed(2)}</span>
                      )}
                    </div>

                    {dish.onPromotion && dish.startDate && dish.endDate && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Promotion valid: {new Date(dish.startDate).toLocaleDateString()} -{" "}
                        {new Date(dish.endDate).toLocaleDateString()}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="border-t p-4 flex justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(dish)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openDeleteDialog(dish.dishID)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge variant={dish.onPromotion ? "default" : "outline"}>
                      {dish.onPromotion ? "On Promotion" : "Regular Price"}
                    </Badge>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews">
          <StallReviews reviews={reviews} rating={averageRating} reviewCount={totalRatings} currentUserId={userId} userData={userData} stallID={stall.stallID} />
        </TabsContent>
      </Tabs>

      <AddDishDialog
        isOpen={isAddDishOpen}
        onClose={() => {
          setIsAddDishOpen(false)
          setEditingDish(null)
        }}
        onSubmit={editingDish ? handleEditDish : handleAddDish}
        editingDish={editingDish}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && dishToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Delete Dish</h2>
            <p>Are you sure you want to delete this dish? This action cannot be undone.</p>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false)
                  setDishToDelete(null)
                }}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteDish()}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}