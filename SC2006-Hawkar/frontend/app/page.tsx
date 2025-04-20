import HomePageSection from "@/components/home-page-section";
import { getSession, getUserData } from "./lib/actions/auth-actions";
import { redirect } from "next/navigation";
import { UserType } from "./types/auth";
import { fetchHawkerCenters, fetchStallByStallID, fetchStalls } from "./lib/actions/stall-actions";
import { fetchLikedStallsByUserID } from "./lib/actions/like-actions";

export default async function Home() {

  const [session, userData, stalls, hawkerCenters ] = await Promise.all([
    getSession(), getUserData(), fetchStalls(), fetchHawkerCenters()
  ])

  if (!session) {
    redirect('/login') 
  }

  const likedStalls = await fetchLikedStallsByUserID(session.userId)

  // Fetch all stall details in parallel
  const stallDetailsPromises = likedStalls.map((stall: { stallID: number}) => 
    fetchStallByStallID(stall.stallID)
  );
  
  const likedStallDetails = await Promise.all(stallDetailsPromises);
  
  // Redirect based on user role
  if (userData?.role === UserType.Hawker) {
    redirect("/hawker")
  } else if (userData?.role === UserType.Admin) {
    redirect("/admin")
  }
  return (
    <HomePageSection userID={session.userId} stalls={stalls} userData={userData} hawkerCenters={hawkerCenters} likedStallsDetails={likedStallDetails}/>
  )
}