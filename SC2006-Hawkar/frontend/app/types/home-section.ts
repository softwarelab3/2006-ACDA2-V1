import { UserData } from "./auth";
import { HawkerCenter } from "./hawker";
import { Stall } from "./stall";

export interface HomeSectionProps {
    stalls: Array<Stall>
    userData: UserData
    hawkerCenters: Array<HawkerCenter>
    likedStallsDetails: Array<Stall>
    userID: string
}