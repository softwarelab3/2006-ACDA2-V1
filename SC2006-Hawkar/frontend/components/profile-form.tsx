"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AmbulatoryStatus, CuisineType, DietaryPreference, SignUpFormData, UserType } from "@/app/types/auth"

interface ProfileFormProps {
    formData: SignUpFormData;  
    setFormData: React.Dispatch<React.SetStateAction<SignUpFormData>>; 
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    error: string | null;
}

export default function ProfileForm({ formData, setFormData, onSubmit, isLoading}: ProfileFormProps) {
    const [profileImage, setProfileImage] = useState<string | null>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSelectFieldChange = (fieldName: keyof SignUpFormData) => {
        return (value: string) => {
            setFormData(prev => ({ ...prev, [fieldName]: value }));
        };
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                if (event.target?.result) {
                    setProfileImage(event.target.result as string)
                    setFormData({ ...formData, profilePhoto: event.target.result as string })
                }
            }
            reader.readAsDataURL(file)
        }
    }
    return (
        <div className="grid md:grid-cols-2 gap-10">
            <div className="flex flex-col justify-center space-y-4 md:p-4">
                <h1 className="text-3xl font-bold">Complete Your Profile to Get Started!</h1>
                <p className="text-gray-600">
                    Just a few more details, and you&apos;ll be all set. Once completed, we&apos;ll take you to your home page!
                </p>
            </div>

            <div>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="flex flex-row items-center gap-4 mb-4">
                        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                            {profileImage ? (
                                <Image
                                    src={profileImage || "/placeholder.svg"}
                                    alt="Profile"
                                    width={96}
                                    height={96}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            id="profile-picture"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <label
                            htmlFor="profile-picture"
                            className="cursor-pointer text-xs text-gray-600 w-40 text-center"
                        >
                            Click on the profile picture to upload your photo
                        </label>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={formData.role} onValueChange={handleSelectFieldChange('role')} required>
                            <SelectTrigger className="bg-gray-200 border-0 w-full py-6">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    Object.values(UserType).map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </div>

                    {formData.role === "Hawker" && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="license">SFA licence number</Label>
                                <Input
                                    id="license"
                                    name="license"
                                    value={formData.license || ""}
                                    placeholder="SFA123456"
                                    onChange={handleInputChange}
                                    className="bg-gray-200 py-6"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    value={formData.address || ""}
                                    onChange={handleInputChange}
                                    className="bg-gray-200 py-6"
                                    placeholder="123, ABC Street, Singapore, Singapore, 123456"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactNumber">Contact Number</Label>
                                <Input
                                    id="contactNumber"
                                    name="contactNumber"
                                    value={formData.contactNumber || ""}
                                    onChange={handleInputChange}
                                    placeholder="8XXXXXXX or 9XXXXXXX"
                                    className={`bg-gray-200 py-6 ${formData.contactNumber && !/^[89]\d{7}$/.test(formData.contactNumber)
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                        }`}
                                    maxLength={8}
                                    pattern="[89][0-9]{7}"
                                    title="Phone number must be 8 digits and start with 8 or 9"
                                    required
                                />
                            </div>
                        </>
                    )}

                    {
                        formData.role === "Consumer" && (
                            (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            name="address"
                                            value={formData.address || ""}
                                            onChange={handleInputChange}
                                            placeholder="123, ABC Street, Singapore, Singapore, 123456"
                                            className="bg-gray-200 py-6"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contactNumber">Contact Number</Label>
                                        <Input
                                            id="contactNumber"
                                            name="contactNumber"
                                            value={formData.contactNumber || ""}
                                            onChange={handleInputChange}
                                            placeholder="8XXXXXXX or 9XXXXXXX"
                                            className={`bg-gray-200 py-6 ${formData.contactNumber && !/^[89]\d{7}$/.test(formData.contactNumber)
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                                }`}
                                            maxLength={8}
                                            pattern="[89][0-9]{7}"
                                            title="Phone number must be 8 digits and start with 8 or 9"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dietaryPreference">Dietary preference</Label>
                                        <Select value={formData.dietaryPreference} onValueChange={handleSelectFieldChange('dietaryPreference')} required>
                                            <SelectTrigger className="bg-gray-200 border-0 w-full py-6">
                                                <SelectValue placeholder="Select a dietary preference" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(DietaryPreference).map((p) => (
                                                    <SelectItem key={p} value={p}>
                                                        {p}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="preferredCuisine">Preferred cuisine</Label>
                                        <Select value={formData.preferredCuisine} onValueChange={handleSelectFieldChange('preferredCuisine')} required>
                                            <SelectTrigger className="bg-gray-200 border-0 w-full py-6">
                                                <SelectValue placeholder="Select preferred cuisines" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(CuisineType).map((cuisine) => (
                                                    <SelectItem key={cuisine} value={cuisine}>
                                                        {cuisine}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ambulatoryStatus">Ambulatory status</Label>
                                        <Select value={formData.ambulatoryStatus} onValueChange={handleSelectFieldChange('ambulatoryStatus')} required>
                                            <SelectTrigger className="bg-gray-200 border-0 w-full py-6">
                                                <SelectValue placeholder="Select ambulatory status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(AmbulatoryStatus).map((ambulatory) => (
                                                    <SelectItem key={ambulatory} value={ambulatory}>
                                                        {ambulatory}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            )
                        )
                    }
                    {
                        formData.role === "Admin" && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="adminUID">Admin Unique ID</Label>
                                    <Input
                                        id="adminUID"
                                        name="adminUID"
                                        value={formData.adminUID || ""}
                                        onChange={handleInputChange}
                                        placeholder="Admin123"
                                        className="bg-gray-200 py-6"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactNumber">Contact Number</Label>
                                    <Input
                                        id="contactNumber"
                                        name="contactNumber"
                                        value={formData.contactNumber || ""}
                                        onChange={handleInputChange}
                                        placeholder="8XXXXXXX or 9XXXXXXX"
                                        className={`bg-gray-200 py-6 ${formData.contactNumber && !/^[89]\d{7}$/.test(formData.contactNumber)
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                            }`}
                                        maxLength={8}
                                        pattern="[89][0-9]{7}"
                                        title="Phone number must be 8 digits and start with 8 or 9"
                                        required
                                    />
                                </div>
                            </>
                        )
                    }

                    <Button type="submit" className="w-full bg-primary hover:bg-black text-white py-6">
                        {isLoading ? "Creating an account..." : "Get Started"}
                    </Button>
                </form>
            </div>
        </div>
    )
}