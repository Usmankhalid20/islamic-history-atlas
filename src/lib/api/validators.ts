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
 * Validation schema for GET /api/polities?activeYear=...&page=...&limit=...
 */
export const politiesQuerySchema = z.object({
  activeYear: z.coerce
    .number()
    .int("Active year must be an integer")
    .min(500)
    .max(2000)
    .optional(),
  entityType: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

/**
 * Validation schema for GET /api/events?year=...&eventType=...&limit=...&cursor=...
 */
export const eventsQuerySchema = z.object({
  year: z.coerce
    .number()
    .int("Year must be an integer")
    .min(500)
    .max(2000)
    .optional(),
  eventType: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  cursor: z.string().optional(),
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

/**
 * Validation schema for GET /api/rulers?polityId=...&reignYear=...&page=...&limit=...
 */
export const rulersQuerySchema = z.object({
  polityId: z.string().optional(),
  reignYear: z.coerce
    .number()
    .int("Reign year must be an integer")
    .min(500)
    .max(2000)
    .optional(),
  name: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

/**
 * Validation schema for GET /api/routes?routeType=...&activeYear=...&page=...&limit=...
 */
export const routesQuerySchema = z.object({
  routeType: z.string().optional(),
  activeYear: z.coerce
    .number()
    .int("Active year must be an integer")
    .min(500)
    .max(2000)
    .optional(),
  name: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

/**
 * Validation schema for GET /api/monuments?monumentType=...&polityId=...&page=...&limit=...
 */
export const monumentsQuerySchema = z.object({
  monumentType: z.string().optional(),
  polityId: z.string().optional(),
  foundingYear: z.coerce
    .number()
    .int("Founding year must be an integer")
    .min(500)
    .max(2000)
    .optional(),
  cityName: z.string().optional(),
  name: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

/**
 * Validation schema for GET /api/scholars?fieldsOfStudy=...&patronizedByPolityId=...&page=...&limit=...
 */
export const scholarsQuerySchema = z.object({
  fieldsOfStudy: z.string().optional(),
  patronizedByPolityId: z.string().optional(),
  activeYear: z.coerce
    .number()
    .int("Active year must be an integer")
    .min(500)
    .max(2000)
    .optional(),
  primaryCity: z.string().optional(),
  name: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

/**
 * Validation schema for GET /api/campaigns?polityId=...&commander=...&page=...&limit=...
 */
export const campaignsQuerySchema = z.object({
  polityId: z.string().optional(),
  commander: z.string().optional(),
  activeYear: z.coerce
    .number()
    .int("Active year must be an integer")
    .min(500)
    .max(2000)
    .optional(),
  name: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});
