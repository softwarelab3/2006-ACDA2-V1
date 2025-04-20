"use client";

import HawkerStallList from "@/components/hawker-stall-list"
import Navbar from "@/components/navbar"
import SearchBar from "@/components/search-bar"
import ViewToggle from "@/components/view-toggle"
import { useState, useEffect, useCallback } from "react"
import dynamic from "next/dynamic";
import { HomeSectionProps } from "@/app/types/home-section";
import { Stall } from "@/app/types/stall";

// Import MapView dynamically with no SSR to avoid hydration issues
const MapView = dynamic(() => import("@/components/map-view"), {
    ssr: false,
    loading: () => (
        <div className="h-[calc(100vh-200px)] w-full rounded-lg bg-gray-100 flex items-center justify-center">
            <p>Loading map...</p>
        </div>
    ),
})

export default function HomePageSection({ stalls, userData, hawkerCenters, likedStallsDetails, userID }: HomeSectionProps) {
    const [currentView, setCurrentView] = useState<"list" | "map" | "both">("both")
    const [filteredStalls, setFilteredStalls] = useState<Array<Stall>>(stalls)
    const [mounted, setMounted] = useState(false)

    const handleViewToggle = (view: "list" | "map" | "both") => {
        setCurrentView(view)
    }

    const handleFilteredStallsChange = useCallback((newFilteredStalls: Array<Stall>) => {
        setFilteredStalls(newFilteredStalls)
    }, [])

    // Set mounted state to true after component mounts
    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <main className="min-h-screen flex flex-col">
            <Navbar username={userData?.name || "Consumer"} savedStalls={likedStallsDetails} userData={userData}/>
            <div className="flex flex-col items-center justify-center text-center p-8">
                <h1 className="text-3xl font-bold">Your Guide to the Best Hawker Eats!</h1>
                <p className="mt-4 text-muted-foreground max-w-2xl">
                    From legendary chicken rice to the crispiest prata, uncover Singapore&apos;s best hawker stalls. Browse reviews, discover top-rated dishes, and share your foodie finds!
                </p>
            </div>
            <div className="mb-8 px-6">
                <SearchBar 
                    hawkerCenters={hawkerCenters}
                    stalls={stalls}
                    onFilteredStallsChange={handleFilteredStallsChange}
                />
            </div>
            <div className="flex justify-center mb-6">
                <ViewToggle onToggle={handleViewToggle} currentView={currentView} />
            </div>

            {mounted && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative px-8">
                    {/* List View */}
                    {(currentView === "list" || currentView === "both") && (
                        <div className={`${currentView === "both" ? "lg:col-span-2" : "lg:col-span-3"}`}>
                            <HawkerStallList stalls={filteredStalls} userID={userID} likedStallDetails={likedStallsDetails}/>
                        </div>
                    )}

                    {/* Map View */}
                    {(currentView === "map" || currentView === "both") && (
                        <div
                            className={`
                      ${currentView === "map" ? "lg:col-span-3" : "lg:col-span-1"} 
                      h-[calc(100vh-200px)]
                    `}
                        >
                            <MapView stalls={filteredStalls} />
                        </div>
                    )}
                </div>
            )}
        </main>
    )
}