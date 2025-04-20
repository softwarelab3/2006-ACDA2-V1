"use client"

import { Clock, MapPin, Star, Tag, Award } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import StallDishes from "@/components/stall-dishes"
import StallReviews from "@/components/stall-reviews"
import PhotoGrid from "@/components/photo-grid"
import Navbar from "@/components/navbar"
import { Review } from "@/app/types/review"
import { UserData } from "@/app/types/auth"
import { Stall } from "@/app/types/stall"
import { Dish } from "@/app/types/dish"

interface StallDetailsProps {
    userId: string;
    userData: UserData;
    reviews: Array<Review>;
    stall: Stall;
    dishes: Array<Dish>;
    likedStalls: Array<Stall>;
}

export const getRatingStats = (reviews: Array<Review>): { averageRating: number; totalRatings: number } => {
    const validReviews = reviews.filter(r => !r.isReported);
    const count = validReviews.length;
  
    const total = validReviews.reduce((acc, curr) => acc + curr.rating, 0);
    const average = count === 0 ? 0 : total / count;
  
    return {
      averageRating: Number(average.toFixed(2)),
      totalRatings: count
    };
}; 

export default function StallDetails({userId, userData, reviews, stall, dishes, likedStalls}: StallDetailsProps) {
    const { averageRating, totalRatings } = getRatingStats(reviews)
         
    return (
        <main className="min-h-screen pb-16">
            <Navbar username={userData.name} stallName={stall.stallName} userData={userData} savedStalls={likedStalls} />
            {/* Stall details */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Photo grid */}
                <PhotoGrid photos={stall.images} stallName={stall.stallName} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                    <div className="lg:col-span-2">
                        <div className="flex flex-col gap-4">
                            <div>
                                <h1 className="text-2xl font-bold">{stall.stallName}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center">
                                        <Star size={16} className="fill-amber-400 text-amber-400" />
                                        <span className="ml-1 font-medium">{averageRating}</span>
                                        <span className="mx-1">·</span>
                                        <span className="text-muted-foreground">{ totalRatings } reviews</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-2 text-sm">
                                    <MapPin size={16} className="text-muted-foreground" />
                                    <span>{stall.hawkerCenter.name}</span>
                                    <span className="text-muted-foreground">|</span>
                                    <span>{stall.unitNumber}</span>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <Clock size={20} className="text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Operating Hours</p>
                                        <p className="text-sm text-muted-foreground">
                                            {stall.startTime} - {stall.endTime}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Award size={20} className="text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Hygiene Rating</p>
                                        <p className="text-sm text-muted-foreground">{stall.hygieneRating}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Tag size={20} className="text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Price Range</p>
                                        <p className="text-sm text-muted-foreground">{stall.priceRange}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock size={20} className="text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Estimated Wait Time</p>
                                        <p className="text-sm text-muted-foreground">{stall.estimatedWaitTime} minutes</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium mb-2">Cuisines</p>
                                <div className="flex flex-wrap gap-2">
                                    {stall.cuisineType.map((cuisine, index) => (
                                        <Badge key={index} variant="outline" className='p-3 rounded-md bg-slate-100'>
                                            {cuisine}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <Separator />
                            {/* Dishes section */}
                            <div>
                                <StallDishes dishes={dishes} stallName={stall.stallName} />
                            </div>

                            <Separator className="my-4" />

                            {/* Reviews section */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold">Ratings & Reviews</h2>
                                </div>
                                <StallReviews
                                    reviews={reviews}
                                    rating={averageRating}
                                    reviewCount={totalRatings}
                                    currentUserId={userId}
                                    stallID={stall.stallID}
                                    userData={userData}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}