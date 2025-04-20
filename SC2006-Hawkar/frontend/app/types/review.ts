import { Consumer } from "./auth";

export interface Review {
    reviewID: number;
    reviewText: string;
    rating: number;
    isReported: boolean;
    reportText?: string;
    reportType?: ReportType;
    consumerID: number;
    consumer: Consumer
}

export enum ReportType {
    spam = "Spam",
    irrelevant = "Irrelevant to food",
    offensive = "Offensive"
}

export interface ReviewFormData {
    reviewText: string;
    rating: number;
    consumerID: number;
    stallID: number
}

export interface ReportFormData {
    reportType: ReportType;
    reportText: string;
}