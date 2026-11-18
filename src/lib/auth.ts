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
                // Clients may pick their role at sign-up, but only customer or
                // owner — admin can only be granted server-side (direct DB write).
                validator: {
                    input: z.enum(["customer", "owner"]),
                },
            },
        },
    },
});