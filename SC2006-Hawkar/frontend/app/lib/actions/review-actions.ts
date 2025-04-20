'use server'

import { ReportPayload } from "@/components/stall-reviews"
import { revalidatePath } from "next/cache"
import { Review, ReviewFormData } from "@/app/types/review"

const API_URL = process.env.NEXT_PUBLIC_DEV_API_URL

export async function fetchReviewsByStallID(stallID: number): Promise<Review[]> {
    try {
        const response = await fetch(`${API_URL}/stall/${stallID}/reviews`)
        if (!response.ok) {
            throw new Error(`Failed to fetch reviews by ${stallID}`)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error(`Fetching reviews ${stallID}`)
        throw error instanceof Error
            ? error
            : new Error(`Error fetching reviews by ${stallID}`);
    }
}

export async function fetchReportedReviews() {
    try {
        const response = await fetch(`${API_URL}/admin/reported_reviews`)
        if (!response.ok) {
            throw new Error(`Failed to fetch reported reviews`)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error(`Fetching reported reviews`)
        throw error instanceof Error
            ? error
            : new Error(`Error fetching reported reviews`);
    }
}

export async function addReview(formData: ReviewFormData) {
    try {
        const response = await fetch(`${API_URL}/stall/${formData.stallID}/add-review`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.detail || "Failed to add review");
        }
        revalidatePath(`/stall/${formData.stallID}`)
        return { success: true };
    } catch (error) {
        console.error("Failed to add review error:", error);
        throw error instanceof Error
            ? error
            : new Error("Failed to add review");
    }
}

export async function editReview(reviewID: number, formData: ReviewFormData) {
    try {
        const response = await fetch(`${API_URL}/review/update/${reviewID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                reviewID: reviewID,
                ...formData
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.detail || `Failed to update review ${reviewID}`);
        }
        revalidatePath(`/stall/${formData.stallID}`)
        return { success: true };
    } catch (error) {
        console.error("Failed to update review error:", error);
        throw error instanceof Error
            ? error
            : new Error("Failed to update review");
    }
}

export async function deleteReview(reviewID: number, stallID: number) {
    try {
        const response = await fetch(`${API_URL}/review/delete/${reviewID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.detail || "Failed to delete review");
        }
        revalidatePath(`/stall/${stallID}`)
    } catch (error) {
        console.error("Failed to delete review error:", error);
        throw error instanceof Error
            ? error
            : new Error("Failed to delete review");
    }
}

export async function reportReview(reviewID: number, formData: ReportPayload) {
    try {
        const response = await fetch(`${API_URL}/review/${reviewID}/report`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                reviewID: reviewID,
                ...formData
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.detail || "Failed to report review");
        }
        revalidatePath(`/stall/${formData.stallID}`)
        return { success: true };
    } catch (error) {
        console.error("Failed to report review error:", error);
        throw error instanceof Error
            ? error
            : new Error("Failed to report review");
    }
}

export async function ignoreReportedReview(reviewID: number) {
    try {
        const response = await fetch(`${API_URL}/admin/reports/${reviewID}/ignore`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.detail || `Failed to ignore review ${reviewID}`);
        }
        revalidatePath(`/admin/reported-reviews`)
        return { success: true };
    } catch (error) {
        console.error("Failed to ignore review error:", error);
        throw error instanceof Error
            ? error
            : new Error("Failed to ignore review");
    }
}