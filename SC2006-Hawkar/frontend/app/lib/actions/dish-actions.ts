"use server"

import { DishFormData } from "@/app/types/dish"
import { revalidatePath } from "next/cache"

const API_URL = process.env.NEXT_PUBLIC_DEV_API_URL

export async function fetchDishesByStallID(stallID: number) {
    try {
        const response = await fetch(`${API_URL}/stall/${stallID}/dishes`)
        if (!response) {
            throw new Error(`Failed to fetch dishes by ${stallID}`)
        }
        const data = response.json()
        return data;
    } catch (error) {
        console.error(`Error fetching dishes by ${stallID}`)
        throw error instanceof Error
            ? error
            : new Error(`Error fetching dishes by ${stallID}`);
    }
}

export async function addDish(stallID: number, formData: DishFormData) {
    try {
        const response = await fetch(`${API_URL}/stall/${stallID}/add-dish`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                stallID: stallID,
                ...formData}),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.detail || "Failed to add dish");
        }
        revalidatePath(`/hawker/stall/${stallID}`)
        return { success: true };
    } catch (error) {
        console.error("Failed to add dish error:", error);
        throw error instanceof Error
            ? error
            : new Error("Failed to add dish");
    }
}

export async function editDish(stallID: number, dishID: number, formData: DishFormData) {
    try {
        const response = await fetch(`${API_URL}/dish/update/${dishID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                stallID: stallID,
                dishID: dishID,
                ...formData
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.detail || `Failed to update dish ${dishID}`);
        }
        revalidatePath(`/hawker/stall/${stallID}`)
        return { success: true };
    } catch (error) {
        console.error("Failed to update dish error:", error);
        throw error instanceof Error
            ? error
            : new Error("Failed to update dish");
    }
}

export async function deleteDish(stallID: number, dishID: number) {
    try {
        const response = await fetch(`${API_URL}/dish/delete/${dishID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.detail || "Failed to delete dish");
        }
        revalidatePath(`/hawker/stall/${stallID}`)
    } catch (error) {
        console.error("Failed to delete dish error:", error);
        throw error instanceof Error
            ? error
            : new Error("Failed to delete dish");
    }
}