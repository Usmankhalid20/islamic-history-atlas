import { describe, it, expect } from "vitest";
import {
  encodeCursor,
  decodeCursor,
  paginateWithCursor,
  paginateWithOffset,
  cursorPaginationQuerySchema,
  offsetPaginationQuerySchema,
} from "@/lib/api/pagination";

describe("API Pagination Utilities", () => {
  describe("Cursor Encoding and Decoding", () => {
    it("encodes and decodes cursor round-trip accurately", () => {
      const payload = { id: "ev_battle_yarmouk_636", sortValue: 636 };
      const cursor = encodeCursor(payload);
      expect(typeof cursor).toBe("string");
      expect(cursor).not.toContain("+");
      expect(cursor).not.toContain("/");
      expect(cursor).not.toContain("=");

      const decoded = decodeCursor(cursor);
      expect(decoded).toEqual(payload);
    });

    it("handles cursor with only ID and no sortValue", () => {
      const payload = { id: "pol_rashidun" };
      const cursor = encodeCursor(payload);
      const decoded = decodeCursor(cursor);
      expect(decoded).toEqual({ id: "pol_rashidun", sortValue: undefined });
    });

    it("safely returns null for malformed or empty cursor tokens", () => {
      expect(decodeCursor("")).toBeNull();
      expect(decodeCursor("not-a-valid-base64-json@@@")).toBeNull();
      expect(decodeCursor("eyJub0lkIjogInRlc3QifQ")).toBeNull(); // JSON without "id"
    });
  });

  describe("paginateWithCursor", () => {
    const mockItems = Array.from({ length: 25 }, (_, i) => ({
      id: `item_${i + 1}`,
      name: `Entity ${i + 1}`,
      year: 600 + i * 10,
    }));

    it("returns first page with hasMore = true and valid nextCursor", () => {
      const result = paginateWithCursor(mockItems, { limit: 10 });
      expect(result.items.length).toBe(10);
      expect(result.items[0].id).toBe("item_1");
      expect(result.items[9].id).toBe("item_10");
      expect(result.pagination.hasMore).toBe(true);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.total).toBe(25);
      expect(result.pagination.nextCursor).toBeDefined();

      const decoded = decodeCursor(result.pagination.nextCursor!);
      expect(decoded?.id).toBe("item_10");
    });

    it("fetches second page using nextCursor from first page", () => {
      const page1 = paginateWithCursor(mockItems, { limit: 10 });
      const page2 = paginateWithCursor(mockItems, {
        limit: 10,
        cursor: page1.pagination.nextCursor!,
      });

      expect(page2.items.length).toBe(10);
      expect(page2.items[0].id).toBe("item_11");
      expect(page2.items[9].id).toBe("item_20");
      expect(page2.pagination.hasMore).toBe(true);

      const page3 = paginateWithCursor(mockItems, {
        limit: 10,
        cursor: page2.pagination.nextCursor!,
      });

      expect(page3.items.length).toBe(5);
      expect(page3.items[0].id).toBe("item_21");
      expect(page3.items[4].id).toBe("item_25");
      expect(page3.pagination.hasMore).toBe(false);
      expect(page3.pagination.nextCursor).toBeNull();
    });

    it("handles empty items array gracefully", () => {
      const result = paginateWithCursor([], { limit: 10 });
      expect(result.items).toEqual([]);
      expect(result.pagination.hasMore).toBe(false);
      expect(result.pagination.nextCursor).toBeNull();
      expect(result.pagination.total).toBe(0);
    });
  });

  describe("paginateWithOffset", () => {
    const mockCatalog = Array.from({ length: 35 }, (_, i) => ({
      id: `dynasty_${i + 1}`,
      name: `Dynasty ${i + 1}`,
    }));

    it("slices page 1 correctly with metadata", () => {
      const result = paginateWithOffset(mockCatalog, { page: 1, limit: 10 });
      expect(result.items.length).toBe(10);
      expect(result.items[0].id).toBe("dynasty_1");
      expect(result.items[9].id).toBe("dynasty_10");
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.totalItems).toBe(35);
      expect(result.pagination.totalPages).toBe(4);
      expect(result.pagination.hasMore).toBe(true);
    });

    it("slices terminal page with hasMore = false", () => {
      const result = paginateWithOffset(mockCatalog, { page: 4, limit: 10 });
      expect(result.items.length).toBe(5);
      expect(result.items[0].id).toBe("dynasty_31");
      expect(result.items[4].id).toBe("dynasty_35");
      expect(result.pagination.page).toBe(4);
      expect(result.pagination.hasMore).toBe(false);
    });

    it("handles out of range page gracefully", () => {
      const result = paginateWithOffset(mockCatalog, { page: 10, limit: 10 });
      expect(result.items).toEqual([]);
      expect(result.pagination.page).toBe(10);
      expect(result.pagination.hasMore).toBe(false);
    });
  });

  describe("Pagination Validation Schemas", () => {
    it("validates cursor pagination schema defaults and limits", () => {
      const empty = cursorPaginationQuerySchema.parse({});
      expect(empty.limit).toBe(20);
      expect(empty.cursor).toBeUndefined();

      const custom = cursorPaginationQuerySchema.parse({ limit: "50", cursor: "token123" });
      expect(custom.limit).toBe(50);
      expect(custom.cursor).toBe("token123");

      expect(() => cursorPaginationQuerySchema.parse({ limit: "200" })).toThrow();
    });

    it("validates offset pagination schema defaults and limits", () => {
      const empty = offsetPaginationQuerySchema.parse({});
      expect(empty.page).toBe(1);
      expect(empty.limit).toBe(20);

      const custom = offsetPaginationQuerySchema.parse({ page: "3", limit: "15" });
      expect(custom.page).toBe(3);
      expect(custom.limit).toBe(15);

      expect(() => offsetPaginationQuerySchema.parse({ page: "0" })).toThrow();
    });
  });
});
