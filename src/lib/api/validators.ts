import { z } from "zod";

/**
 * Validation schema for GET /api/territories?year=...
 */
export const territoriesQuerySchema = z.object({
  year: z.coerce
    .number({
      invalid_type_error: "Year must be a valid number",
      required_error: "Year query parameter is required",
    })
    .int("Year must be an integer")
    .min(500, "Year must be greater than or equal to 500 CE")
    .max(2000, "Year must be less than or equal to 2000 CE"),
});

/**
 * Validation schema for GET /api/polities?activeYear=...
 */
export const politiesQuerySchema = z.object({
  activeYear: z.coerce
    .number()
    .int("Active year must be an integer")
    .min(500)
    .max(2000)
    .optional(),
  entityType: z.string().optional(),
});

/**
 * Validation schema for GET /api/events?year=...
 */
export const eventsQuerySchema = z.object({
  year: z.coerce
    .number()
    .int("Year must be an integer")
    .min(500)
    .max(2000)
    .optional(),
  eventType: z.string().optional(),
});

/**
 * Validation schema for POST /api/ai/inquire
 */
export const aiInquirySchema = z.object({
  query: z
    .string()
    .min(3, "Query must be at least 3 characters long")
    .max(500, "Query cannot exceed 500 characters"),
  year: z.number().int().min(500).max(2000).optional(),
  polities: z.array(z.string()).optional(),
  model: z.string().optional(),
});


