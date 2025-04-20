"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { X, ImageIcon } from "lucide-react"
import Image from "next/image"
import { Dish, DishFormData } from "@/app/types/dish"

interface AddDishDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dish: DishFormData) => void;
  editingDish: Dish | null;
  isLoading?: boolean; // Add this property with optional type
}

export default function AddDishDialog({ isOpen, onClose, onSubmit, editingDish, isLoading = false }: AddDishDialogProps) {
  const [formData, setFormData] = useState({
    dishName: "",
    price: "",
    photo: "",
    onPromotion: false,
    startDate: "",
    endDate: "",
    discountedPrice: "",
  })

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string>("")

  // Initialize form with editing data if available
  useEffect(() => {
    if (editingDish) {
      setFormData({
        dishName: editingDish.dishName,
        price: editingDish.price.toString(),
        photo: editingDish.photo,
        onPromotion: editingDish.onPromotion,
        startDate: editingDish.startDate || "",
        endDate: editingDish.endDate || "",
        discountedPrice: editingDish.discountedPrice?.toString() || "",
      })
      setPhotoPreviewUrl(editingDish.photo)
    } else {
      resetForm()
    }
  }, [editingDish, isOpen])

  const resetForm = () => {
    setFormData({
      dishName: "",
      price: "",
      photo: "",
      onPromotion: false,
      startDate: "",
      endDate: "",
      discountedPrice: "",
    })
    setPhotoFile(null)
    setPhotoPreviewUrl("")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    if (type === "number") {
      // Ensure only valid numbers are entered
      if (value === "" || (!isNaN(Number.parseFloat(value)) && Number.parseFloat(value) >= 0)) {
        setFormData({ ...formData, [name]: value })
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, onPromotion: checked })
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
  
    // Set the single file
    setPhotoFile(file)
  
    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setPhotoPreviewUrl(previewUrl)
  
    // Convert image to base64
    const base64String = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result as string)
      }
      reader.readAsDataURL(file)
    })

    setFormData({
      ...formData,
      photo: base64String
    })
  }
  

  const removePhoto = () => {
    if (photoFile) {
      setPhotoFile(null)
    }

    // Revoke the object URL to avoid memory leaks
    if (photoPreviewUrl && !photoPreviewUrl.startsWith("/")) {
      URL.revokeObjectURL(photoPreviewUrl)
    }

    setPhotoPreviewUrl("")
    setFormData({
      ...formData,
      photo: "",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.dishName || !formData.price || !formData.photo) {
      alert("Please fill in all required fields")
      return
    }

    // Validate promotion fields if promotion is enabled
    if (formData.onPromotion) {
      if (!formData.startDate || !formData.endDate || !formData.discountedPrice) {
        alert("Please fill in all promotion fields")
        return
      }

      // Validate that discounted price is less than regular price
      if (Number.parseFloat(formData.discountedPrice) >= Number.parseFloat(formData.price)) {
        alert("Discounted price must be less than regular price")
        return
      }

      // Validate that end date is after start date
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        alert("End date must be after start date")
        return
      }
    }

    // Submit form
    const submissionData = {
      ...formData,
      price: Number.parseFloat(formData.price),
      discountedPrice: formData.onPromotion ? Number.parseFloat(formData.discountedPrice) : undefined,
      startDate: formData.onPromotion ? formData.startDate : undefined,
      endDate: formData.onPromotion ? formData.endDate : undefined,
    }

    onSubmit(submissionData)
    // Reset form
    resetForm()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background z-10 flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">{editingDish ? "Edit Dish" : "Add New Dish"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isLoading}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="dishName">Dish Name *</Label>
              <Input
                id="dishName"
                name="dishName"
                value={formData.dishName}
                onChange={handleInputChange}
                placeholder="Enter dish name"
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.1"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter price"
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-3">
              <Label>Dish Photo *</Label>
              {photoPreviewUrl ? (
                <div className="relative aspect-video rounded-md overflow-hidden border">
                  <Image
                    src={photoPreviewUrl || "/placeholder.svg"}
                    alt="Dish photo preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={removePhoto}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="border border-dashed rounded-md flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-muted/50 aspect-video">
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={isLoading} />
                  <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <span className="text-sm text-muted-foreground text-center">
                    Click to upload a photo of your dish
                  </span>
                </label>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="onPromotion" checked={formData.onPromotion} onCheckedChange={handleSwitchChange} disabled={isLoading} />
              <Label htmlFor="onPromotion">This dish is on promotion</Label>
            </div>

            {formData.onPromotion && (
              <div className="border rounded-md p-4 grid gap-4">
                <h3 className="font-medium">Promotion Details</h3>

                <div className="grid gap-3">
                  <Label htmlFor="discountedPrice">Discounted Price ($) *</Label>
                  <Input
                    id="discountedPrice"
                    name="discountedPrice"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.discountedPrice}
                    onChange={handleInputChange}
                    placeholder="Enter discounted price"
                    required={formData.onPromotion}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required={formData.onPromotion}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required={formData.onPromotion}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (editingDish ? "Saving..." : "Adding...") : (editingDish ? "Save Changes" : "Add Dish")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}