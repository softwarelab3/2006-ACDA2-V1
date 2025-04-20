import { UserType } from "./auth"

export interface Hawker {
    hawkerID: number,
    address: string,
    license: string,
    verifyStatus: boolean,
    userID: number,
    user: {
        name: string,
        emailAddress: string,
        userID: number,
        profilePhoto: string,
        contactNumber: string,
        role: UserType
    }
}

export interface HawkerCenter {
    hawkerCenterID: number,
    name: string,
    address: string,
    latitude: number,
    longitude: number
}