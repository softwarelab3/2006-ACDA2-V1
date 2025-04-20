"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TimePicker } from "@/components/ui/time-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FilterState } from "./search-bar"
import { HawkerCenter } from "@/app/types/hawker"
import { HygieneRating, PriceRange } from "@/app/types/stall"
import { CuisineType } from "@/app/types/auth"

interface FilterModalProps {
    isOpen: boolean
    onClose: () => void
    onApply: (filters: FilterState) => void
    initialFilters: FilterState | null
    hawkerCenters: Array<HawkerCenter>
}


const defaultFilters: FilterState = {
    startTime: "",
    endTime: "",
    foodPreferences: [],
    priceRange: "",
    location: "",
    hygieneRating: "",
}

export default function FilterModal({ isOpen, onClose, onApply, initialFilters, hawkerCenters }: FilterModalProps) {
    const [filters, setFilters] = useState<FilterState>(initialFilters || defaultFilters)

    useEffect(() => {
        if (initialFilters) {
            setFilters(initialFilters)
        } else {
            setFilters(defaultFilters)
        }
    }, [initialFilters, isOpen])

    if (!isOpen) return null

    const toggleSelection = (
        item: CuisineType,
        currentSelections: CuisineType[],
        field: keyof Pick<FilterState, "foodPreferences">,
    ) => {
        if (currentSelections.includes(item)) {
            setFilters({
                ...filters,
                [field]: currentSelections.filter((i) => i !== item),
            })
        } else {
            setFilters({
                ...filters,
                [field]: [...currentSelections, item],
            })
        }
    }

    const handleApplyFilters = () => {
        onApply(filters)
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-4 flex items-center justify-between border-b">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="p-4 space-y-6">
                    {/* Operating Hours */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label htmlFor="start-time" className="text-sm">
                                Starting Hours
                            </label>
                            <TimePicker
                                value={filters.startTime}
                                onChange={(value) => setFilters({ ...filters, startTime: value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="end-time" className="text-sm">
                                Closing Hours
                            </label>
                            <TimePicker value={filters.endTime} onChange={(value) => setFilters({ ...filters, endTime: value })} />
                        </div>
                    </div>

                    {/* Food Preferences */}
                    <div>
                        <h3 className="font-medium mb-2">Food Preferences</h3>
                        <div className="flex flex-wrap gap-3">
                            {Object.values(CuisineType).map((food) => (
                                <Button
                                    key={food}
                                    variant="outline"
                                    className={`bg-gray-200 hover:bg-gray-300 border-0 py-6 ${filters.foodPreferences.includes(food)
                                            ? "bg-primary text-white hover:bg-primary/90 hover:text-white"
                                            : ""
                                        }`}
                                    onClick={() => toggleSelection(food, filters.foodPreferences, "foodPreferences")}
                                >
                                    {food}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <h3 className="font-medium mb-2">Price Range</h3>
                        <Select value={filters.priceRange} onValueChange={(value) => setFilters({ ...filters, priceRange: value })}>
                            <SelectTrigger className="bg-gray-200 border-0 w-full py-6">
                                <SelectValue placeholder="Select Price Range" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(PriceRange).map((price) => (
                                    <SelectItem key={price} value={price}>
                                        {price}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Location */}
                    <div>
                        <h3 className="font-medium mb-2">Location</h3>
                        <Select value={filters.location} onValueChange={(value) => setFilters({ ...filters, location: value })}>
                            <SelectTrigger className="bg-gray-200 border-0 w-full py-6">
                                <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                                {hawkerCenters.map((location) => (
                                    <SelectItem key={location.hawkerCenterID} value={location.name}>
                                        {location.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Hygiene Ratings */}
                    <div>
                        <h3 className="font-medium mb-2">Hygiene Ratings</h3>
                        <Select
                            value={filters.hygieneRating}
                            onValueChange={(value) => setFilters({ ...filters, hygieneRating: value})}
                        >
                            <SelectTrigger className="bg-gray-200 border-0 w-full py-6">
                                <SelectValue placeholder="Select rating" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(HygieneRating).map(rating => (
                                    <SelectItem key={rating} value={rating}>{rating}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Apply Button */}
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white py-6 mt-2" onClick={handleApplyFilters}>
                        Apply Filters
                    </Button>
                </div>
            </div>
        </div>
    )
}