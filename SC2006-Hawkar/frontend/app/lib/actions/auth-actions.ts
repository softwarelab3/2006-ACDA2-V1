"use server";

import { cookies } from "next/headers";
import { SignUpFormData, LoginFormData, UserType, GoogleUserData } from "@/app/types/auth";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

export async function signUp(formData: SignUpFormData) {
  const modifiedFormData = {
    userType: formData.role.toLowerCase(),
    data: {
      ...formData,
    },
  };

  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modifiedFormData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.detail || "Failed to create account");
    }
    return { success: true };
  } catch (error) {
    console.error("Sign up error:", error);
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occured during signup");
  }
}

export async function login(loginData: LoginFormData) {
  const cookieStore = await cookies();
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
      cache: "no-store",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Invalid email or password");
    }
    const userData = await response.json();
    cookieStore.set({
      name: "userId",
      value: userData.userID.toString(),
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60, // 60 mins 60 seconds
      sameSite: "lax",
    });
    cookieStore.set({
      name: "userData",
      value: JSON.stringify({
        name: userData.user.name,
        emailAddress: userData.user.emailAddress,
        profilePhoto: userData.user.profilePhoto,
        contactNumber: userData.user.contactNumber,
        role: userData.user.role,
        verifyStatus: userData.verifyStatus,
      }),
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60,
      sameSite: "lax",
    });
    // Redirect based on user role and verification status
    if (userData.role === UserType.Hawker && userData.verifyStatus === false) {
      return { success: true, redirectUrl: "/pending-approval" };
    } else if (userData.role === UserType.Consumer) {
      return { success: true, redirectUrl: "/" };
    } else if (userData.role === UserType.Hawker) {
      return { success: true, redirectUrl: "/hawker" };
    } else if (userData.role === UserType.Admin) {
      return { success: true, redirectUrl: "/admin" };
    }
    return { success: true };
  } catch (error) {
    console.error("Login error: ", error);
    throw error instanceof Error
      ? error
      : new Error("An unexpected login error occurred");
  }
}

export async function loginWithGoogle(googleUserData: GoogleUserData) {
  const cookieStore = await cookies();
  try {
    console.log("Attempting Google login with data:", {
      email: googleUserData.email,
      name: googleUserData.name,
      hasPicture: !!googleUserData.picture,
    });

    // Ensure we're sending the picture URL when available
    const dataToSend = {
      email: googleUserData.email,
      name: googleUserData.name,
      picture: googleUserData.picture || "",
    };

    const apiUrl = `${API_URL}/auth/login-google`;
    console.log("Sending request to:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      let errorMessage = "Failed to authenticate with Google";
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData?.detail || errorData?.message || errorMessage;
      } catch (e) {
        console.error("Error parsing error response:", e);
      }

      throw new Error(errorMessage);
    }

    const userData = await response.json();
    console.log("Successful Google authentication, user data:", {
      userID: userData.userID,
      role: userData.user?.role,
      isNew: userData.isNewUser,
    });

    cookieStore.set({
      name: "userId",
      value: userData.userID.toString(),
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60, // 60 mins 60 seconds
      sameSite: "lax",
    });

    cookieStore.set({
      name: "userData",
      value: JSON.stringify({
        name: userData.user.name,
        emailAddress: userData.user.emailAddress,
        profilePhoto: userData.user.profilePhoto,
        contactNumber: userData.user.contactNumber,
        role: userData.user.role,
        verifyStatus: userData.verifyStatus,
        isGoogleUser: true,
      }),
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60,
      sameSite: "lax",
    });

    // Redirect based on user role and verification status
    if (userData.role === UserType.Hawker && userData.verifyStatus === false) {
      return { success: true, redirectUrl: "/pending-approval" };
    } else if (userData.role === UserType.Consumer) {
      return { success: true, redirectUrl: "/" };
    } else if (userData.role === UserType.Hawker) {
      return { success: true, redirectUrl: "/hawker" };
    } else if (userData.role === UserType.Admin) {
      return { success: true, redirectUrl: "/admin" };
    }

    return { success: true };
  } catch (error) {
    console.error("Google login error: ", error);
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred during Google sign-in");
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  cookieStore.delete("userData");
  redirect("/login");
}

export async function getSession() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  const userDataCookie = cookieStore.get("userData")?.value;

  if (!userId || !userDataCookie) {
    return null;
  }
  try {
    const userData = JSON.parse(userDataCookie);
    return { userId, userData };
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
}

export async function getUserData() {
  const session = await getSession();
  if (!session) {
    return null;
  }
  try {
    const response = await fetch(`${API_URL}/user/${session.userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const userData = await response.json();
    console.log("User data retrieved:", userData); // Add logging to check the data
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return session.userData;
  }
}
