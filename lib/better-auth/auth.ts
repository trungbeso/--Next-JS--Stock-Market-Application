import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectionToDatabase } from "@/database/mongoose";
import { nextCookies } from "better-auth/next-js";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async () => {
    if (authInstance) return authInstance;

    const mongoose = await connectionToDatabase();
    const db = mongoose.connection.db;

    if (!db) throw new Error("MongoDB connection failed");

    authInstance = betterAuth({
    //     type of adapter
        database: mongodbAdapter(db as any),

        secret: process.env.BETTER_AUTH_SECRET,
        baseURL: process.env.BETTER_AUTH_URL,
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            minPasswordLength: 6,
            maxPasswordLength: 128,
            autoSignIn: true,
        },
        plugins: [nextCookies()],
    })

    return authInstance;
}

export const auth = await getAuth();