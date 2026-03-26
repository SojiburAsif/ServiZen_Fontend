import z from "zod";

const trimOptional = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, message)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value?.length ? value : undefined));

const optionalUrlField = z
  .string()
  .trim()
  .url("Provide a valid image URL")
  .optional()
  .or(z.literal(""))
  .transform((value) => (value?.length ? value : undefined));

const specialtyIdField = z
  .string()
  .trim()
  .uuid("Select a valid specialty")
  .optional()
  .or(z.literal(""))
  .or(z.literal("auto"))
  .transform((value) => (value && value !== "auto" ? value : undefined));

const baseCreateServiceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Service title must be at least 2 characters")
    .max(100, "Service title can be at most 100 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description should be at least 10 characters")
    .max(1500, "Description is too long"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  duration: trimOptional(100, "Duration must be under 100 characters"),
  specialtyId: specialtyIdField,
  imageUrl: optionalUrlField,
});

const updateServiceSchema = baseCreateServiceSchema
  .extend({
    providerId: z
      .string()
      .trim()
      .uuid("Invalid provider reference")
      .optional(),
    isActive: z.boolean().optional(),
  })
  .partial()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Provide at least one field to update",
    path: ["name"],
  });

const searchField = z
  .string()
  .trim()
  .min(1, "Search term must be at least 1 character")
  .max(100, "Search term is too long");

const serviceFiltersSchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    specialtyId: specialtyIdField.optional(),
    minPrice: z.number().min(0).optional(),
    maxPrice: z.number().min(0).optional(),
    searchTerm: searchField.optional(),
    category: z
      .string()
      .trim()
      .min(1, "Category must be at least 1 character")
      .max(100, "Category is too long")
      .optional(),
    priceSort: z.enum(["asc", "desc"]).optional(),
  })
  .refine(
    (data) =>
      data.minPrice === undefined ||
      data.maxPrice === undefined ||
      data.minPrice <= data.maxPrice,
    {
      message: "Min price cannot exceed max price",
      path: ["maxPrice"],
    },
  );

export const ServicesValidation = {
  createServiceSchema: baseCreateServiceSchema,
  updateServiceSchema,
  serviceFiltersSchema,
};

export type CreateServiceFormValues = z.infer<typeof ServicesValidation.createServiceSchema>;
export type CreateServiceFormInput = z.input<typeof ServicesValidation.createServiceSchema>;
export type UpdateServiceFormValues = z.infer<typeof ServicesValidation.updateServiceSchema>;
export type UpdateServiceFormInput = z.input<typeof ServicesValidation.updateServiceSchema>;
export type ServiceFiltersValues = z.infer<typeof ServicesValidation.serviceFiltersSchema>;
