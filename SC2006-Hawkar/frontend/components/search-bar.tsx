"use client"

import { useCallback, useEffect, useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import FilterModal from "./filter-modal"
import { HawkerCenter } from "@/app/types/hawker"
import { CuisineType } from "@/app/types/auth"
import { Stall } from "@/app/types/stall"
import { countActiveFilters, filterStalls, hasActiveFilters } from "@/app/lib/utils/filter"

export interface FilterState {
  startTime: string
  endTime: string
  foodPreferences: CuisineType[]
  priceRange: string
  location: string
  hygieneRating: string
}

interface SearchBarProps {
  hawkerCenters: Array<HawkerCenter>
  stalls: Array<Stall>
  onFilteredStallsChange: (filteredStalls: Array<Stall>) => void
}

export default function SearchBar({ hawkerCenters, stalls, onFilteredStallsChange }: SearchBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [appliedFilters, setAppliedFilters] = useState<FilterState | null>(null)

  // Filter stalls whenever search query or filters change
  useEffect(() => {
    if (stalls.length > 0) {
      const filtered = filterStalls(stalls, searchQuery, appliedFilters)
      onFilteredStallsChange(filtered)
    }
  }, [searchQuery, appliedFilters, stalls, onFilteredStallsChange])

  // Stable handlers for event callbacks
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const handleOpenFilterModal = useCallback(() => {
    setIsFilterOpen(true)
  }, [])

  const handleCloseFilterModal = useCallback(() => {
    setIsFilterOpen(false)
  }, [])

  const handleApplyFilters = useCallback((filters: FilterState) => {
    setAppliedFilters(filters)
    setIsFilterOpen(false)
  }, [])

  const handleRemoveFilter = useCallback((filterType: keyof FilterState) => {
    if (!appliedFilters) return

    const newFilters = { ...appliedFilters }

    if (filterType === "foodPreferences") {
      newFilters[filterType] = []
    } else {
      newFilters[filterType] = ""
    }

    setAppliedFilters(newFilters)
  }, [appliedFilters])

  const handleRemoveFoodPreference = useCallback((food: CuisineType) => {
    if (!appliedFilters) return
    const newFoods = appliedFilters.foodPreferences.filter((f) => f !== food)
    setAppliedFilters({ ...appliedFilters, foodPreferences: newFoods })
  }, [appliedFilters])

  const handleClearAllFilters = useCallback(() => {
    setAppliedFilters(null)
    setSearchQuery("")
  }, [])

  return (
    <div className="w-full">
      <div className="flex w-full max-w-3xl mx-auto gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search stall name..."
            className="pl-9 py-6"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <Button variant="outline" onClick={handleOpenFilterModal} className="flex items-center gap-2 py-6">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {appliedFilters && 
            hasActiveFilters(appliedFilters) && 
            <Badge className="ml-2 bg-primary text-white">{countActiveFilters(appliedFilters)}</Badge>
          }
        </Button>
      </div>

      {/* Applied Filters */}
      {appliedFilters && hasActiveFilters(appliedFilters) && (
        <div className="mt-3 flex flex-wrap gap-2 max-w-3xl mx-auto">
          {appliedFilters.startTime && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Opens: {appliedFilters.startTime}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => handleRemoveFilter("startTime")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {appliedFilters.endTime && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Closes: {appliedFilters.endTime}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => handleRemoveFilter("endTime")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {appliedFilters.foodPreferences.map((food) => (
            <Badge key={food} variant="secondary" className="flex items-center gap-1">
              {food}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => handleRemoveFoodPreference(food)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          {appliedFilters.priceRange && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Price Range: {appliedFilters.priceRange}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => handleRemoveFilter("priceRange")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {appliedFilters.location && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Location: {appliedFilters.location}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => handleRemoveFilter("location")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {appliedFilters.hygieneRating && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Hygiene: {appliedFilters.hygieneRating}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => handleRemoveFilter("hygieneRating")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {hasActiveFilters(appliedFilters) && (
            <Button variant="ghost" size="sm" className="text-xs" onClick={handleClearAllFilters}>
              Clear All
            </Button>
          )}
        </div>
      )}

      {searchQuery && (
        <div className="mt-3 flex items-center max-w-3xl mx-auto">
          <Badge variant="secondary" className="flex items-center gap-1">
            Search: {searchQuery}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 ml-1"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      )}

      <FilterModal
        isOpen={isFilterOpen}
        onClose={handleCloseFilterModal}
        onApply={handleApplyFilters}
        initialFilters={appliedFilters}
        hawkerCenters={hawkerCenters}
      />
    </div>
  )
}