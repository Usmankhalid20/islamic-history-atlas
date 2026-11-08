/**
 * Pagination Utilities: Keyset (Cursor-Based) and Offset-Based Pagination
 * Conforms to ADR-007 and docs/API_DESIGN.md
 */

import { z } from "zod";

export interface CursorPayload {
  id: string;
  sortValue?: string | number;
}

export interface CursorPaginationResult<T> {
  items: T[];
  pagination: {
    limit: number;
    hasMore: boolean;
    nextCursor: string | null;
    total: number;
  };
}

export interface OffsetPaginationResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export const cursorPaginationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

export const offsetPaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * Encodes an ID and optional sort key into a URL-safe Base64 opaque cursor string
 */
export function encodeCursor(payload: CursorPayload): string {
  const json = JSON.stringify(payload);
  if (typeof Buffer !== "undefined") {
    return Buffer.from(json, "utf-8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
  return btoa(json)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Decodes a URL-safe Base64 cursor string back into its ID and sort key
 */
export function decodeCursor(cursor: string): CursorPayload | null {
  if (!cursor || typeof cursor !== "string") return null;

  try {
    let base64 = cursor.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }

    let json: string;
    if (typeof Buffer !== "undefined") {
      json = Buffer.from(base64, "base64").toString("utf-8");
    } else {
      json = atob(base64);
    }

    const parsed = JSON.parse(json);
    if (parsed && typeof parsed.id === "string") {
      return {
        id: parsed.id,
        sortValue: parsed.sortValue,
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Paginates an array of items using keyset cursor pagination
 */
export function paginateWithCursor<T extends { id: string }>(
  items: T[],
  options: {
    limit?: number;
    cursor?: string;
    getSortValue?: (item: T) => string | number;
  } = {}
): CursorPaginationResult<T> {
  const limit = Math.min(100, Math.max(1, options.limit ?? 20));
  const total = items.length;

  let startIndex = 0;
  if (options.cursor) {
    const decoded = decodeCursor(options.cursor);
    if (decoded) {
      const foundIdx = items.findIndex((item) => item.id === decoded.id);
      if (foundIdx !== -1) {
        startIndex = foundIdx + 1;
      }
    }
  }

  const sliced = items.slice(startIndex, startIndex + limit + 1);
  const hasMore = sliced.length > limit;
  const pageItems = hasMore ? sliced.slice(0, limit) : sliced;

  let nextCursor: string | null = null;
  if (hasMore && pageItems.length > 0) {
    const lastItem = pageItems[pageItems.length - 1];
    nextCursor = encodeCursor({
      id: lastItem.id,
      sortValue: options.getSortValue ? options.getSortValue(lastItem) : undefined,
    });
  }

  return {
    items: pageItems,
    pagination: {
      limit,
      hasMore,
      nextCursor,
      total,
    },
  };
}

/**
 * Paginates an array of items using offset/limit pagination
 */
export function paginateWithOffset<T>(
  items: T[],
  options: {
    page?: number;
    limit?: number;
  } = {}
): OffsetPaginationResult<T> {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(100, Math.max(1, options.limit ?? 20));
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const startIndex = (page - 1) * limit;
  const pageItems = items.slice(startIndex, startIndex + limit);
  const hasMore = page < totalPages;

  return {
    items: pageItems,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasMore,
    },
  };
}
