import { getSession, getUserData } from "@/app/lib/actions/auth-actions"
import { fetchDishesByStallID } from "@/app/lib/actions/dish-actions"
import { fetchLikedStallsByUserID } from "@/app/lib/actions/like-actions"
import { fetchReviewsByStallID } from "@/app/lib/actions/review-actions"
import { fetchStallByStallID } from "@/app/lib/actions/stall-actions"
import { UserType } from "@/app/types/auth"
import StallDetails from "@/components/stall-details"
import { redirect } from "next/navigation"

export default async function StallDetailsPage(props: { params: Promise<{ id: string }> }) {
    // First await the params Promise, then destructure
    const params = await props.params;
    const { id } = params;
    
    const [session, userData, reviews, stall, dishes] = await Promise.all([
      getSession(),
      getUserData(),
      fetchReviewsByStallID(parseInt(id)),
      fetchStallByStallID(parseInt(id)),
      fetchDishesByStallID(parseInt(id))
    ]);
  
    if (!session) {
      redirect('/login');
    }

    const likedStalls = await fetchLikedStallsByUserID(session.userId)
    
      // Fetch all stall details in parallel
      const stallDetailsPromises = likedStalls.map((stall: { stallID: number}) => 
        fetchStallByStallID(stall.stallID)
      );
      
      const likedStallDetails = await Promise.all(stallDetailsPromises);
    // Redirect based on user role
    if (userData?.role === UserType.Hawker) {
      redirect("/hawker");
    } else if (userData?.role === UserType.Admin) {
      redirect("/admin");
    }
    return (
      <>
        <StallDetails likedStalls={likedStallDetails} userId={session.userId} userData={userData} reviews={reviews} stall={stall} dishes={dishes} />
      </>
    );
  }