import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { z } from "zod";

const client = new MongoClient(process.env.DB_URL as string);
const db = client.db("equipment-rental-platform");

export const auth = betterAuth({
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