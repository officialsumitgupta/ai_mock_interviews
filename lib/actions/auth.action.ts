"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    // Create session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: SESSION_DURATION * 1000, // milliseconds
    });

    // Set cookie in the browser
    cookieStore.set("session", sessionCookie, {
        maxAge: SESSION_DURATION,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
    });
}

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {

        // check if user exists in db
        const userRecord = await db.collection("users").doc(uid).get();
        if (userRecord.exists)
            return {
                success: false,
                message: "User already exists. Please sign in.",
            };

        // save user to db
        await db.collection("users").doc(uid).set({
            name,
            email,
            // profileURL,
            // resumeURL,
        });

        return {
            success: true,
            message: "Account created successfully. Please sign in.",
        };
    } catch (error: any) {
        console.error("Error creating user:", error);

        // Handle Firebase specific errors
        if (error.code === "auth/email-already-exists") {
            return {
                success: false,
                message: "This email is already in use",
            };
        }

        return {
            success: false,
            message: "Failed to create account. Please try again.",
        };
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        console.log("Sign in attempt for email:", email);
        
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            console.log("User not found in Firebase Auth:", email);
            return {
                success: false,
                message: "User does not exist. Create an account.",
            };
        }

        console.log("User found in Firebase Auth, checking Firestore record...");
        
        // Check if user exists in Firestore, if not create the record
        const userDoc = await db.collection("users").doc(userRecord.uid).get();
        if (!userDoc.exists) {
            console.log("User not found in Firestore, creating record...");
            await db.collection("users").doc(userRecord.uid).set({
                name: userRecord.displayName || email.split('@')[0],
                email: email,
                createdAt: new Date().toISOString(),
            });
            console.log("User record created in Firestore");
        }

        console.log("Setting session cookie...");
        await setSessionCookie(idToken);
        console.log("Session cookie set successfully");
        
        return {
            success: true,
            message: "Signed in successfully.",
        };
    } catch (error: any) {
        console.log("Sign in error:", error);

        return {
            success: false,
            message: "Failed to log into account. Please try again.",
        };
    }
}

// Sign out user by clearing the session cookie
export async function signOut() {
    const cookieStore = await cookies();

    cookieStore.delete("session");
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get("session")?.value;
    console.log("Session cookie exists:", !!sessionCookie);
    
    if (!sessionCookie) {
        console.log("No session cookie found");
        return null;
    }

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        console.log("Session verified for user:", decodedClaims.uid);

        // get user info from db
        const userRecord = await db
            .collection("users")
            .doc(decodedClaims.uid)
            .get();
            
        if (!userRecord.exists) {
            console.log("User record not found in database for uid:", decodedClaims.uid);
            return null;
        }

        const userData = {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
        
        console.log("User data retrieved:", { id: userData.id, email: userData.email });
        return userData;
    } catch (error) {
        console.log("Session verification failed:", error);

        // Invalid or expired session
        return null;
    }
}

// Check if user is authenticated
export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}