/**
 * GeoJSON Geometry Validation Module (RFC 7946 Compliant)
 *
 * Provides strict validation and normalization for cartographic geometries
 * including Points, LineStrings, Polygons, and MultiPolygons.
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates a single coordinate position [longitude, latitude].
 * RFC 7946 specifies coordinates in [lng, lat] order:
 * - Longitude must be within [-180, 180]
 * - Latitude must be within [-90, 90]
 */
export function validatePosition(pos: unknown): ValidationResult {
  if (!Array.isArray(pos)) {
    return { isValid: false, error: "Position must be an array of numbers [longitude, latitude]." };
  }
  if (pos.length < 2) {
    return { isValid: false, error: "Position must have at least 2 components [longitude, latitude]." };
  }

  const [lng, lat] = pos;
  if (typeof lng !== "number" || typeof lat !== "number" || isNaN(lng) || isNaN(lat)) {
    return { isValid: false, error: "Coordinates must be finite numbers." };
  }

  if (lng < -180 || lng > 180) {
    return { isValid: false, error: `Longitude ${lng} is out of bounds [-180, 180].` };
  }

  if (lat < -90 || lat > 90) {
    return { isValid: false, error: `Latitude ${lat} is out of bounds [-90, 90].` };
  }

  return { isValid: true };
}

/**
 * Checks if the first and last coordinates of a ring match within a small epsilon.
 */
export function isClosedLinearRing(ring: [number, number][]): boolean {
  if (!Array.isArray(ring) || ring.length < 4) return false;
  const first = ring[0];
  const last = ring[ring.length - 1];
  const EPSILON = 1e-6;
  return (
    Math.abs(first[0] - last[0]) < EPSILON &&
    Math.abs(first[1] - last[1]) < EPSILON
  );
}

/**
 * Ensures a linear ring is closed by appending the first position to the end if not closed.
 */
export function ensureClosedRing(ring: [number, number][]): [number, number][] {
  if (!Array.isArray(ring) || ring.length === 0) return ring;
  if (isClosedLinearRing(ring)) return [...ring];
  return [...ring, [ring[0][0], ring[0][1]]];
}

/**
 * Validates a GeoJSON LinearRing:
 * - Must be an array of at least 4 positions
 * - First and last position must be identical
 * - All positions must be valid [lng, lat]
 */
export function validateLinearRing(ring: unknown): ValidationResult {
  if (!Array.isArray(ring)) {
    return { isValid: false, error: "LinearRing must be an array of coordinate positions." };
  }

  if (ring.length < 4) {
    return {
      isValid: false,
      error: `LinearRing must contain at least 4 positions (found ${ring.length}).`,
    };
  }

  for (let i = 0; i < ring.length; i++) {
    const posRes = validatePosition(ring[i]);
    if (!posRes.isValid) {
      return { isValid: false, error: `Invalid position at index ${i}: ${posRes.error}` };
    }
  }

  const first = ring[0] as [number, number];
  const last = ring[ring.length - 1] as [number, number];
  const EPSILON = 1e-6;
  if (Math.abs(first[0] - last[0]) >= EPSILON || Math.abs(first[1] - last[1]) >= EPSILON) {
    return {
      isValid: false,
      error: `LinearRing is not closed: first [${first[0]}, ${first[1]}] !== last [${last[0]}, ${last[1]}].`,
    };
  }

  return { isValid: true };
}

/**
 * Validates a Polygon coordinates structure (array of LinearRings).
 */
export function validatePolygonCoordinates(coords: unknown): ValidationResult {
  if (!Array.isArray(coords) || coords.length === 0) {
    return { isValid: false, error: "Polygon coordinates must be a non-empty array of LinearRings." };
  }

  for (let i = 0; i < coords.length; i++) {
    const ringRes = validateLinearRing(coords[i]);
    if (!ringRes.isValid) {
      return { isValid: false, error: `Invalid LinearRing at ring ${i}: ${ringRes.error}` };
    }
  }

  return { isValid: true };
}

/**
 * Validates a MultiPolygon coordinates structure (array of Polygon coordinate arrays).
 */
export function validateMultiPolygonCoordinates(coords: unknown): ValidationResult {
  if (!Array.isArray(coords) || coords.length === 0) {
    return { isValid: false, error: "MultiPolygon coordinates must be a non-empty array of Polygon coordinates." };
  }

  for (let i = 0; i < coords.length; i++) {
    const polyRes = validatePolygonCoordinates(coords[i]);
    if (!polyRes.isValid) {
      return { isValid: false, error: `Invalid Polygon at polygon ${i}: ${polyRes.error}` };
    }
  }

  return { isValid: true };
}

/**
 * Validates a LineString coordinates structure (array of 2+ positions).
 */
export function validateLineStringCoordinates(coords: unknown): ValidationResult {
  if (!Array.isArray(coords) || coords.length < 2) {
    return { isValid: false, error: "LineString coordinates must contain at least 2 positions." };
  }

  for (let i = 0; i < coords.length; i++) {
    const posRes = validatePosition(coords[i]);
    if (!posRes.isValid) {
      return { isValid: false, error: `Invalid position at index ${i}: ${posRes.error}` };
    }
  }

  return { isValid: true };
}

/**
 * Validates any GeoJSON Geometry object against RFC 7946 specifications.
 */
export function validateGeoJsonGeometry(geometry: unknown): ValidationResult {
  if (!geometry || typeof geometry !== "object") {
    return { isValid: false, error: "Geometry must be a non-null object." };
  }

  const geom = geometry as Record<string, unknown>;
  const type = geom.type;

  if (typeof type !== "string") {
    return { isValid: false, error: "Geometry is missing a valid 'type' string property." };
  }

  switch (type) {
    case "Point": {
      return validatePosition(geom.coordinates);
    }
    case "MultiPoint": {
      if (!Array.isArray(geom.coordinates) || geom.coordinates.length === 0) {
        return { isValid: false, error: "MultiPoint coordinates must be a non-empty array of positions." };
      }
      for (let i = 0; i < geom.coordinates.length; i++) {
        const res = validatePosition(geom.coordinates[i]);
        if (!res.isValid) return { isValid: false, error: `Invalid position at index ${i}: ${res.error}` };
      }
      return { isValid: true };
    }
    case "LineString": {
      return validateLineStringCoordinates(geom.coordinates);
    }
    case "MultiLineString": {
      if (!Array.isArray(geom.coordinates) || geom.coordinates.length === 0) {
        return { isValid: false, error: "MultiLineString coordinates must be a non-empty array of LineString positions." };
      }
      for (let i = 0; i < geom.coordinates.length; i++) {
        const res = validateLineStringCoordinates(geom.coordinates[i]);
        if (!res.isValid) return { isValid: false, error: `Invalid LineString at index ${i}: ${res.error}` };
      }
      return { isValid: true };
    }
    case "Polygon": {
      return validatePolygonCoordinates(geom.coordinates);
    }
    case "MultiPolygon": {
      return validateMultiPolygonCoordinates(geom.coordinates);
    }
    case "GeometryCollection": {
      if (!Array.isArray(geom.geometries)) {
        return { isValid: false, error: "GeometryCollection must contain a 'geometries' array." };
      }
      for (let i = 0; i < geom.geometries.length; i++) {
        const res = validateGeoJsonGeometry(geom.geometries[i]);
        if (!res.isValid) return { isValid: false, error: `Invalid subgeometry at index ${i}: ${res.error}` };
      }
      return { isValid: true };
    }
    default: {
      return { isValid: false, error: `Unsupported GeoJSON geometry type: '${type}'.` };
    }
  }
}
