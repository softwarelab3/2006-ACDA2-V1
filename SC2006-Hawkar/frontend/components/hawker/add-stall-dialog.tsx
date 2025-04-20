"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TimePicker } from "@/components/ui/time-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, ImageIcon } from "lucide-react"
import Image from "next/image"
import { type Stall, type StallFormData, HygieneRating, PriceRange } from "@/app/types/stall"
import { CuisineType } from "@/app/types/auth"
import { SelectGroup } from "@radix-ui/react-select"
import type { HawkerCenter } from "@/app/types/hawker"

// Cuisine types from enum
const cuisineTypes = Object.values(CuisineType)

// Price ranges from enum
const priceRanges = Object.values(PriceRange)

// Hygiene ratings from enum
const hygieneRatings = Object.values(HygieneRating)

interface AddStallDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (stall: StallFormData) => void
  editingStall: Stall | null
  hawkerID?: number
  isLoading?: boolean
  hawkerCenters: Array<HawkerCenter>
}

export default function AddStallDialog({
  isOpen,
  onClose,
  onSubmit,
  editingStall,
  hawkerID,
  isLoading = false,
  hawkerCenters,
}: AddStallDialogProps) {
  const [formData, setFormData] = useState<StallFormData>({
    stallName: "",
    hawkerID: hawkerID || 0,
    hawkerCenterID: 1,
    unitNumber: "",
    startTime: "10:00",
    endTime: "20:00",
    cuisineType: [] as CuisineType[],
    priceRange: PriceRange.RANGE_4_TO_6,
    hygieneRating: HygieneRating.A,
    estimatedWaitTime: 0,
    images: [] as string[],
  })

  const [selectedCuisines, setSelectedCuisines] = useState<CuisineType[]>([])
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([])

  // Format time from "HH:MM:SS" to "HH:MM"
  const formatTime = (time: string) => {
    if (!time) return ""
    // Handle case where time is already in HH:MM format
    if (time.length === 5) return time
    
    // Handle HH:MM:SS format
    return time.substring(0, 5)
  }

  // Map price range string to enum value
  const mapPriceRangeToEnum = (priceRange: string): PriceRange => {
    switch(priceRange) {
      case "$4 - $6": return PriceRange.RANGE_4_TO_6
      case "$5 - $8": return PriceRange.RANGE_5_TO_8
      case "$8 - $12": return PriceRange.RANGE_8_TO_12
      case "$12 - $20": return PriceRange.RANGE_12_TO_20
      case "$20+": return PriceRange.RANGE_20_PLUS
      default: 
        // If it's already an enum value, return it
        if (Object.values(PriceRange).includes(priceRange as PriceRange)) {
          return priceRange as PriceRange
        }
        return PriceRange.RANGE_4_TO_6
    }
  }

  const resetForm = useCallback(() => {
    setFormData({
      stallName: "",
      hawkerID: hawkerID || 0,
      hawkerCenterID: 1,
      unitNumber: "",
      startTime: "10:00",
      endTime: "20:00",
      cuisineType: [],
      priceRange: PriceRange.RANGE_4_TO_6,
      hygieneRating: HygieneRating.A,
      estimatedWaitTime: 0,
      images: [],
    })
    setSelectedCuisines([])
    setPhotoFiles([])
    setPhotoPreviewUrls([])
  }, [hawkerID])

  // Initialize form with editing data if available
  useEffect(() => {
    if (editingStall) {
      const mappedPriceRange = mapPriceRangeToEnum(editingStall.priceRange)

      console.log(editingStall)
      
      setFormData({
        stallName: editingStall.stallName,
        hawkerID: editingStall.hawkerID,
        hawkerCenterID: editingStall.hawkerCenterID,
        unitNumber: editingStall.unitNumber,
        startTime: formatTime(editingStall.startTime),
        endTime: formatTime(editingStall.endTime),
        cuisineType: editingStall.cuisineType as CuisineType[],
        priceRange: mappedPriceRange,
        hygieneRating: (editingStall.hygieneRating as HygieneRating) || HygieneRating.A,
        estimatedWaitTime: editingStall.estimatedWaitTime || 0,
        images: editingStall.images || [],
      })
      setSelectedCuisines(editingStall.cuisineType as CuisineType[])
      
      // When editing, make sure we keep the existing images in our preview
      if (editingStall.images && editingStall.images.length > 0) {
        setPhotoPreviewUrls(editingStall.images)
      } else {
        setPhotoPreviewUrls([])
      }
    } else {
      resetForm()
    }
  }, [editingStall, isOpen, hawkerID, resetForm])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleTimeChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSelectChange = (field: string, value: string | number | HygieneRating | PriceRange) => {
    setFormData({ ...formData, [field]: value })
  }

  const toggleCuisineSelection = (cuisine: CuisineType) => {
    if (selectedCuisines.includes(cuisine)) {
      const newSelection = selectedCuisines.filter((c) => c !== cuisine)
      setSelectedCuisines(newSelection)
      setFormData({ ...formData, cuisineType: newSelection })
    } else {
      const newSelection = [...selectedCuisines, cuisine]
      setSelectedCuisines(newSelection)
      setFormData({ ...formData, cuisineType: newSelection })
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setPhotoFiles([...photoFiles, ...newFiles])

      // Create preview URLs for display
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file))
      setPhotoPreviewUrls([...photoPreviewUrls, ...newPreviewUrls])

      // Convert images to base64 for API
      const base64Promises = newFiles.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            const base64String = reader.result as string
            resolve(base64String)
          }
          reader.readAsDataURL(file)
        })
      })

      const base64Images = await Promise.all(base64Promises)

      // Update the form data with the new images
      setFormData({
        ...formData,
        images: [...formData.images, ...base64Images],
      })
    }
  }

  const removePhoto = (index: number) => {
    const newPhotoFiles = [...photoFiles]
    newPhotoFiles.splice(index, 1)
    setPhotoFiles(newPhotoFiles)

    const newPreviewUrls = [...photoPreviewUrls]

    // Revoke the object URL to avoid memory leaks
    if (newPreviewUrls[index] && !newPreviewUrls[index].startsWith("http")) {
      URL.revokeObjectURL(newPreviewUrls[index])
    }

    newPreviewUrls.splice(index, 1)
    setPhotoPreviewUrls(newPreviewUrls)

    const newImages = [...formData.images]
    newImages.splice(index, 1)

    setFormData({
      ...formData,
      images: newImages,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.stallName || !formData.hawkerCenterID || formData.cuisineType.length === 0) {
      alert("Please fill in all required fields")
      return
    }

    // Make sure hawkerID is set
    const submitData: StallFormData = {
      ...formData,
      hawkerID: hawkerID || (editingStall ? editingStall.hawkerID : 0),
    }

    // When editing, preserve existing images if they weren't changed
    if (editingStall && editingStall.images && editingStall.images.length > 0) {
      // Check if we're keeping existing images without adding new ones
      if (photoPreviewUrls.every(url => editingStall.images.includes(url))) {
        submitData.images = editingStall.images
      }
    }

    // Submit form
    onSubmit(submitData)

    // Reset form
    resetForm()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background z-10 flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">{editingStall ? "Edit Stall" : "Add New Stall"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="stallName">Stall Name *</Label>
              <Input
                id="stallName"
                name="stallName"
                value={formData.stallName}
                onChange={handleInputChange}
                placeholder="Enter stall name"
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="hawkerCenterID">Hawker Center *</Label>
              <Select
                value={String(formData.hawkerCenterID)}
                onValueChange={(value) => handleSelectChange("hawkerCenterID", Number(value))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hawker center" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {hawkerCenters.map((center) => (
                      <SelectItem key={center.hawkerCenterID} value={String(center.hawkerCenterID)}>
                        {center.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="unitNumber">Unit Number</Label>
              <Input
                id="unitNumber"
                name="unitNumber"
                value={formData.unitNumber}
                onChange={handleInputChange}
                placeholder="e.g. 01-23"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="startTime">Opening Time *</Label>
                <TimePicker value={formData.startTime} onChange={(value) => handleTimeChange("startTime", value)} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="endTime">Closing Time *</Label>
                <TimePicker value={formData.endTime} onChange={(value) => handleTimeChange("endTime", value)} />
              </div>
            </div>

            <div className="grid gap-3">
              <Label>Cuisine Types *</Label>
              <div className="flex flex-wrap gap-2">
                {cuisineTypes.map((cuisine) => (
                  <Button
                    key={cuisine}
                    type="button"
                    variant={selectedCuisines.includes(cuisine as CuisineType) ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => toggleCuisineSelection(cuisine as CuisineType)}
                    disabled={isLoading}
                  >
                    {cuisine}
                  </Button>
                ))}
              </div>
              {selectedCuisines.length === 0 && (
                <p className="text-sm text-muted-foreground">Please select at least one cuisine type</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="priceRange">Price Range *</Label>
              <Select
                value={formData.priceRange}
                onValueChange={(value) => handleSelectChange("priceRange", value as PriceRange)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="hygieneRating">Hygiene Rating</Label>
              <Select
                value={formData.hygieneRating}
                onValueChange={(value) => handleSelectChange("hygieneRating", value as HygieneRating)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hygiene rating" />
                </SelectTrigger>
                <SelectContent>
                  {hygieneRatings.map((rating) => (
                    <SelectItem key={rating} value={rating}>
                      {rating}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label>Stall Photos</Label>
              <div className="grid grid-cols-3 gap-4">
                {photoPreviewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                    <Image
                      src={url || "/placeholder.svg"}
                      alt={`Stall photo ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full"
                      onClick={() => removePhoto(index)}
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <label
                  className={`border border-dashed rounded-md flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-muted/50 aspect-square ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={isLoading}
                  />
                  <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground text-center">Upload Photos</span>
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                Upload photos of your stall and dishes. You can upload multiple photos.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (editingStall ? "Saving..." : "Adding...") : editingStall ? "Save Changes" : "Add Stall"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}