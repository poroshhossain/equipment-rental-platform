import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

// Use a harmless fallback at build time: Vercel evaluates this module while
// collecting page data, and a missing DB_URL must not crash the whole build.
// The driver connects lazily, so real requests still need a valid DB_URL.
const uri = process.env.DB_URL ?? "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const db = client.db("equipment-rental-platform");

export const auth = betterAuth({
    plugins: [
        jwt(),
    ],
    session: {
        cookieCache: {
            enabled: true,
            strategy: 'jwt',
            maxAge: 7 * 24 * 60 * 60
        }
    },
    database: mongodbAdapter(db, {
        client,
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    emailAndPassword: {
        enabled: true,
        // Matches the registration form rule: 6+ chars, 1 uppercase, 1 lowercase.
        minPasswordLength: 6,
        maxPasswordLength: 64,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "customer",
                input: false,
                required: false,
            },
        },
    },
});