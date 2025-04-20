"use server";

const API_URL = process.env.NEXT_PUBLIC_DEV_API_URL

export async function likeStall(userID: string, stallID: number) {
    try {
        const response = await fetch(`${API_URL}/stall/${userID}/like/${stallID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.detail || `Failed to like the stall ${userID}:${stallID}`);
          }
        return response.json()
    } catch (error) {
        console.error("Like stall error:", error);
        throw error instanceof Error
            ? error
            : new Error("An unexpected error occured during like stalls");
    }
}

export async function unlikeStall(userID: string, stallID: number) {
    try {
        const response = await fetch(`${API_URL}/stall/${userID}/unlike/${stallID}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.detail || `Failed to unlike the stall ${userID}:${stallID}`);
          }
        return response.json()
    } catch (error) {
        console.error("Unlike stall error:", error);
        throw error instanceof Error
            ? error
            : new Error("An unexpected error occured during unliking stalls");
    }
}

export async function fetchLikedStallsByUserID(userID: string) {
    try {
        const response = await fetch(`${API_URL}/stall/${userID}/liked`, {
            cache: 'no-store'
        })
        if (response.status === 404) {
            const errorData = await response.json();
            if (errorData?.detail === "No liked stalls found") {
                return [];
            }
            // If it's a 404 for some other reason, still throw an error
            throw new Error('Failed to fetch liked stalls');
        }
        if (!response.ok) throw new Error('Failed to fetch liked stalls');
        return response.json();
    } catch (error) {
        console.error("fetch liked stalls error:", error);
        throw error instanceof Error
            ? error
            : new Error("An unexpected error occured during fetching liked stalls");
    }
}