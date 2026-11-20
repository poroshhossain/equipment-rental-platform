import { z } from "zod";

export const equipmentFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Equipment name must be at least 3 characters.")
    .max(80, "Equipment name is too long."),
  description: z
    .string()
    .trim()
    .min(20, "Describe the equipment in at least 20 characters.")
    .max(1200, "Description is too long."),
  category: z.string().min(1, "Select a category."),
  location: z.string().trim().min(2, "Enter a pickup location."),
  rentalPrice: z
    .string()
    .trim()
    .min(1, "Enter a rental price.")
    .refine(
      (value) => Number.isFinite(Number(value)) && Number(value) > 0,
      "Enter a price greater than 0.",
    ),
  rentalType: z.enum(["daily", "weekly", "monthly"]),
  availableQuantity: z
    .string()
    .trim()
    .min(1, "Enter available quantity.")
    .refine(
      (value) =>
        Number.isInteger(Number(value)) &&
        Number(value) > 0 &&
        Number(value) <= 999,
      "Enter a whole number between 1 and 999.",
    ),
  condition: z.enum(["new", "excellent", "good", "fair"]),
  brand: z.string().trim().min(1, "Enter the brand."),
  model: z.string().trim().min(1, "Enter the model."),
  image: z.string().trim().min(1, "Add at least one equipment image."),
  terms: z
    .string()
    .trim()
    .min(20, "Add rental terms of at least 20 characters.")
    .max(2000, "Terms are too long."),
});

export type EquipmentFormValues = z.infer<typeof equipmentFormSchema>;
