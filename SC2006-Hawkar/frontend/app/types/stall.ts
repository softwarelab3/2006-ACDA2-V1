import { CuisineType } from "./auth";
import { Hawker, HawkerCenter } from "./hawker";

export interface Stall {
    stallID: number;
    hawkerID: number;
    hawkerCenterID: number;
    stallName: string;
    hawker: Hawker;
    hawkerCenter: HawkerCenter;
    images: Array<string>;
    startTime: string;
    endTime: string;
    unitNumber: string;
    hygieneRating: HygieneRating;
    cuisineType: Array<string>;
    estimatedWaitTime: number;
    priceRange: PriceRange;
}

export interface StallFormData {
    stallName: string;
    hawkerID : number;
    hawkerCenterID: number;
    images: Array<string>;
    unitNumber: string;
    startTime: string;
    endTime: string;
    hygieneRating: HygieneRating;
    cuisineType: Array<CuisineType>;
    estimatedWaitTime: number;
    priceRange: PriceRange;
}

export enum HygieneRating {
    A = "A",
    B = "B",
    C = "C"
}

export enum PriceRange {
    RANGE_3_TO_5 = "$3 - $5",
    RANGE_4_TO_6 = "$4 - $6",
    RANGE_5_TO_8 = "$5 - $8",
    RANGE_6_TO_10 = "$6 - $10",
    RANGE_8_TO_12 = "$8 - $12",
    RANGE_10_TO_15 = "$10 - $15",
    RANGE_12_TO_20 = "$12 - $20",
    RANGE_15_TO_20 = "$15 - $20",
    RANGE_20_PLUS = "$20+"
}