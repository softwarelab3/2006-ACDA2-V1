"use client"

import Image from "next/image"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Grid2X2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dish } from "@/app/types/dish"


interface StallDishesProps {
  dishes: Dish[]
  stallName: string
}

export default function StallDishes({ dishes, stallName }: StallDishesProps) {
  const [showFullMenu, setShowFullMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Group dishes by promotion status
  const promotionDishes = dishes.filter((dish) => dish.onPromotion)
  const regularDishes = dishes.filter((dish) => !dish.onPromotion)

  // Filter dishes based on search query
  const filteredDishes = dishes.filter((dish) => dish.dishName.toLowerCase().includes(searchQuery.toLowerCase()))

  // Get dishes based on active tab
  const getTabDishes = () => {
    if (activeTab === "promotions") return promotionDishes
    if (activeTab === "regular") return regularDishes
    return filteredDishes
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Menu</h2>
        <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => setShowFullMenu(true)}>
          <Grid2X2 size={16} />
          <span>View full menu</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {dishes.map((dish) => (
          <Card key={dish.dishID} className="overflow-hidden py-0 pb-6">
            <div className="relative h-48">
              <Image src={dish.photo || "/placeholder.svg"} alt={dish.dishName} fill className="object-cover" />
              {dish.onPromotion && <Badge className="absolute top-2 right-2 bg-red-500">Promotion</Badge>}
            </div>
            <CardContent className="px-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{dish.dishName}</h3>
                  {dish.onPromotion ? (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground line-through">${dish.price.toFixed(2)}</span>
                      <span className="font-medium text-red-500">${dish.discountedPrice?.toFixed(2)}</span>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">${dish.price.toFixed(2)}</p>
                  )}
                  {dish.onPromotion && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Promotion valid: {new Date(dish.startDate!).toLocaleDateString()} -{" "}
                      {new Date(dish.endDate!).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showFullMenu} onOpenChange={setShowFullMenu}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl">{stallName} - Full Menu</DialogTitle>
          </DialogHeader>

          <div className="relative mb-4">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search dishes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">All Dishes ({dishes.length})</TabsTrigger>
              <TabsTrigger value="promotions">Promotions ({promotionDishes.length})</TabsTrigger>
              <TabsTrigger value="regular">Regular Menu ({regularDishes.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getTabDishes().map((dish) => (
                    <Card key={dish.dishID} className="overflow-hidden py-0 pb-6">
                      <div className="relative h-40">
                        <Image src={dish.photo || "/placeholder.svg"} alt={dish.dishName} fill className="object-cover" />
                        {dish.onPromotion && <Badge className="absolute top-2 right-2 bg-red-500">Promotion</Badge>}
                      </div>
                      <CardContent className="px-3">
                        <h3 className="font-medium text-sm">{dish.dishName}</h3>
                        {dish.onPromotion ? (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground line-through">${dish.price.toFixed(2)}</span>
                            <span className="text-sm font-medium text-red-500">
                              ${dish.discountedPrice?.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-1">${dish.price.toFixed(2)}</p>
                        )}
                        {dish.onPromotion && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Until {new Date(dish.endDate!).toLocaleDateString()}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {getTabDishes().length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No dishes found matching your search.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="promotions" className="mt-0">
              <div className="overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getTabDishes().map((dish) => (
                    <Card key={dish.dishID} className="overflow-hidden">
                      <div className="relative h-40">
                        <Image src={dish.photo || "/placeholder.svg"} alt={dish.dishName} fill className="object-cover" />
                        <Badge className="absolute top-2 right-2 bg-red-500">Promotion</Badge>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm">{dish.dishName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground line-through">${dish.price.toFixed(2)}</span>
                          <span className="text-sm font-medium text-red-500">${dish.discountedPrice?.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Until {new Date(dish.endDate!).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {getTabDishes().length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No promotion dishes available.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="regular" className="mt-0">
              <div className="overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getTabDishes().map((dish) => (
                    <Card key={dish.dishID} className="overflow-hidden">
                      <div className="relative h-40">
                        <Image src={dish.photo || "/placeholder.svg"} alt={dish.dishName} fill className="object-cover" />
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm">{dish.dishName}</h3>
                        <p className="text-sm text-muted-foreground mt-1">${dish.price.toFixed(2)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {getTabDishes().length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No regular menu dishes found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}