import { z } from "zod";

const isImageUrl = (value: string) => {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const emailField = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .email("Enter a valid email address.");

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(60, "Name is too long."),
  email: emailField,
  // The role the user registers with. Admin is intentionally not offered —
  // it can only be granted server-side.
  role: z.enum(["customer", "owner"], {
    message: "Please choose an account type.",
  }),
  photoUrl: z
    .string()
    .trim()
    .refine(isImageUrl, "Enter a valid image link (http:// or https://)."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(64, "Password must be 64 characters or fewer.")
    .regex(/[A-Z]/, "Password must include an uppercase letter.")
    .regex(/[a-z]/, "Password must include a lowercase letter."),
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required."),
});

export type RegisterValues = z.infer<typeof registerSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
