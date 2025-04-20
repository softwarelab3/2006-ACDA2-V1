"use server";

import { StallFormData } from "@/app/types/stall";
import { revalidatePath } from "next/cache";
import { getSession } from "./auth-actions";

const API_URL = process.env.NEXT_PUBLIC_DEV_API_URL

export async function fetchStalls() {
    try {
        const response = await fetch(`${API_URL}/stalls`)
        if (!response.ok) {
            throw new Error('Failed to fetch stalls')
        }
        const data = response.json()
        return data;
    } catch (error) {
        console.error("Error fetching stalls data")
        throw error instanceof Error
            ? error
            : new Error("Error fetching stalls data");
    }
}

export async function fetchStallByStallID(stallID: number) {
    try {
        const response = await fetch(`${API_URL}/stall/${stallID}`)
        if (!response.ok) {
            throw new Error(`Failed to fetch stalls ${stallID}`)
        }
        const data = response.json()
        return data;
    } catch (error) {
        console.error(`Error fetching stall data ${stallID}`)
        throw error instanceof Error
            ? error
            : new Error(`Error fetching stall data ${stallID}`);
    }
}

export async function fetchStallsByHawkerID() {
    const session = await getSession()
    try {
        const response = await fetch(`${API_URL}/stall/hawkerid/${session?.userId}`)
        if (!response.ok) {
            throw new Error(`Failed to fetch stalls by ${session?.userId}`)
        }
        const data = response.json()
        return data;
    } catch (error) {
        console.error(`Error fetching stall data ${session?.userId}`)
        throw error instanceof Error
            ? error
            : new Error(`Error fetching stall data ${session?.userId}`);
    }
}

export async function addStall(formData: StallFormData) {
    try {
        const response = await fetch(`${API_URL}/stall/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.detail || "Failed to add stall");
        }
        revalidatePath('/hawker')
        return { success: true };
    } catch (error) {
        console.error("Failed to add stall error:", error);
        throw error instanceof Error
            ? error
            : new Error("Failed to add stall");
    }
}

export async function updateStall(stallID: number, formData: StallFormData) {
    try {
        const requestBody = {
            stallID: stallID,
            ...formData
        };
        console.log('Request payload:', JSON.stringify(requestBody, null, 2));
        const response = await fetch(`${API_URL}/stall/update/${stallID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                stallID: stallID,
                ...formData
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.detail || "Failed to update stall");
        }
        revalidatePath('/hawker')
        revalidatePath(`/hawker/stall/${stallID}`)
        return { success: true };
    } catch (error) {
        console.error("Failed to update stall error:", error);
        throw error instanceof Error
            ? error
            : new Error("Failed to update stall");
    }
}

export async function deleteStall(stallID: number) {
    try {
        const response = await fetch(`${API_URL}/stall/delete/${stallID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.detail || "Failed to delete stall");
        }
        revalidatePath('/hawker')
        return { success: true}
    } catch (error) {
        console.error("Failed to delete stall error:", error);
        throw error instanceof Error
            ? error
            : new Error("Failed to delete stall"); 
    }
}

export async function fetchHawkerCenters(){
    try {
        const response = await fetch(`${API_URL}/hawker-centers`)
        if (!response) {
            throw new Error('Failed to fetch hawker centers')
        }
        const data = response.json()
        return data;
    } catch (error) {
        console.error("Error fetching hawker center data")
        throw error instanceof Error
            ? error
            : new Error("Error fetching hawker centers data");
    }
}