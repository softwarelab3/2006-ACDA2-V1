export interface Dish {
    dishID: number,
    stallID: number,
    dishName: string,
    price: number,
    photo: string,
    onPromotion: boolean,
    startDate?: string,
    endDate?: string,
    discountedPrice?: number
}

export interface DishFormData {
    dishName: string,
    price: number,
    photo: string,
    onPromotion: boolean,
    startDate?: string,
    endDate?: string,
    discountedPrice?: number
}