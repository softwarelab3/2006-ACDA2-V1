export interface SignUpFormData {
  name: string;
  emailAddress: string;
  password: string;
  role: UserType;
  license?: string;
  adminUID?: string;
  profilePhoto?: string;
  address?: string;
  contactNumber?: string;
  sfaLicenseNumber?: string;
  dietaryPreference?: DietaryPreference;
  preferredCuisine?: CuisineType;
  ambulatoryStatus?: AmbulatoryStatus;
}

export enum UserType {
  Consumer = "Consumer",
  Hawker = "Hawker",
  Admin = "Admin",
}

export enum CuisineType {
  Chinese = "Chinese",
  Indian = "Indian",
  Malay = "Malay",
  Western = "Western",
  Japanese = "Japanese",
  Korean = "Korean",
  Thai = "Thai",
  Italian = "Italian",
  Indonesian = "Indonesian",
  Vietnamese = "Vietnamese",
}

export enum DietaryPreference {
  Vegetarian = "Vegetarian",
  Vegan = "Vegan",
  Halal = "Halal",
  GlutenFree = "Gluten-Free",
  DairyFree = "Dairy-Free",
}

export enum AmbulatoryStatus {
  Ambulatory = "Ambulatory",
  Whelchair = "Wheelchair",
}

export interface LoginFormData {
  emailAddress: string;
  password: string;
}

export interface GoogleUserData {
  email: string;
  name: string;
  picture?: string;
}

export interface UserData {
  name: string;
  emailAddress: string;
  profilePhoto?: string;
  contactNumber?: string;
  role: UserType;
  verifyStatus?: boolean;
  isGoogleUser?: boolean;
}

export interface Consumer {
  consumerID: number;
  address: string;
  dietaryPreference: DietaryPreference;
  preferredCuisine: CuisineType;
  ambulatoryStatus: string;
  favoriteStalls: number[];
  userID: number;
  user: User;
}

export interface User {
  name: string;
  emailAddress: string;
  userID: number;
  profilePhoto: string;
  contactNumber: number;
  role: UserType;
}