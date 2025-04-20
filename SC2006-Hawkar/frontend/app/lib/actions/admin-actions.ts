"use server";

import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_DEV_API_URL

export async function fetchAllHawkers() {
    try {
        const response = await fetch(`${API_URL}/hawkers`, {
            cache: 'no-store'
        })
        if (!response) {
            throw new Error(`Failed to fetch hawkers`)
        }
        const data = response.json()
        return data;
    } catch (error) {
        console.error(`Error fetching hawkers`)
        throw error instanceof Error
            ? error
            : new Error(`Error fetching hawkers`);
    }
}

export async function fetchReportedReviews() {
    try {
        const response = await fetch(`${API_URL}/admin/reported_reviews`, {
            cache: 'no-store'
        })
        if (!response) {
            throw new Error(`Failed to fetch reported reviews`)
        }
        const data = response.json()
        return data;
    } catch (error) {
        console.error(`Error fetching reported reviews`)
        throw error instanceof Error
            ? error
            : new Error(`Error fetching reported reviews`);
    }
}

export async function approveHawker(hawkerID: string) {
    try {
        const response = await fetch(`${API_URL}/admin/verify-hawker/${hawkerID}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"}
        })
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.detail || "Failed to approver hawker");
        }
        revalidatePath('/admin/hawker-approvals')
        return { success: true }
    } catch (error) {
        console.error(`Error approve hawker ${hawkerID}`)
        throw error instanceof Error
            ? error
            : new Error(`Error approve hawker ${hawkerID} `);
    }
}

export async function ignoreReportedReview(reviewID: string) {
    try {
        const response = await fetch(`${API_URL}/admin/reports/${reviewID}/ignore`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"}
        })
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.detail || "Failed to approver hawker");
        }
        revalidatePath('/admin/reported-reviews')
        return { success: true }
    } catch (error) {
        console.error(`Error: ignoring ${reviewID}`)
        throw error instanceof Error
            ? error
            : new Error(`Error: ignoring ${reviewID} `);
    }
}