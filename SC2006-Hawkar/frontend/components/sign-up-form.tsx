"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import ProfileForm from "@/components/profile-form"
import { toast } from "sonner"
import { SignUpFormData, UserType } from "@/app/types/auth"
import { signUp } from "@/app/lib/actions/auth-actions"
import { useRouter } from "next/navigation"
import GoogleLoginButton from "./google-login-button"

export default function SignUpForm() {
    const [currentStep, setCurrentStep] = useState(1)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState<SignUpFormData>({
        name: "",
        emailAddress: "",
        password: "",
        role: UserType.Consumer,
    })
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentStep(2)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        try {
            await signUp(formData)
            toast.success("You're all signed up! Redirecting you to log in...", { duration: 3000})
            if (formData.role === "Hawker") {
                toast.success("Sign-in successful! Your account is pending approval. You'll be notified once approved.")
            }
            router.push("/login")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong, please try again")
            toast.error("Oops! Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <>
        <div className="w-full max-w-5xl p-8 lg:py-0 mx-auto">
            {currentStep === 1 ? (
                <div className="max-w-md mx-auto mt-10">
                    <h1 className="text-3xl font-bold text-center mb-2">Create an account</h1>
                    <p className="text-center mb-6">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary font-medium">
                            Login
                        </Link>
                    </p>

                    <form onSubmit={handleNextStep} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="bg-gray-200 py-6"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="emailAddress">Email Address</Label>
                            <Input
                                id="emailAddress"
                                name="emailAddress"
                                type="email"
                                placeholder="Email Address"
                                value={formData.emailAddress}
                                onChange={handleInputChange}
                                required
                                className="bg-gray-200 py-6"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className="bg-gray-200 py-6 pr-10"
                                    minLength={8}
                                    title="Password must be more than 8 characters"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-primary hover:bg-black py-6 text-white">
                            Next
                        </Button>

                        <div className="flex items-center gap-4 my-6">
                            <Separator className="flex-1" />
                            <span className="text-sm text-gray-500">Or register with</span>
                            <Separator className="flex-1" />
                        </div>

                        <GoogleLoginButton mode="signup" />
                    </form>
                </div>
            ) : (
                <ProfileForm
                  formData={formData}
                  isLoading={isLoading}
                  setFormData={setFormData}
                  error={error}
                  onSubmit={handleSubmit}
                />
            )}
        </div>
        </>

    )
}
