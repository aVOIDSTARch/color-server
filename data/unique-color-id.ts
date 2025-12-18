/**
 * Generates a unique numeric ID from a hex color code.
 * This will always produce the same ID for the same hex code.
 *
 * @param hex - The hex color code (with or without # prefix)
 * @returns A unique numeric ID
 *
 * @example
 * getUniqueColorId("1B248D")   // returns 1778829
 * getUniqueColorId("#1B248D")  // returns 1778829
 */
export function getUniqueColorId(hex: string): number {
  const cleanHex = hex.replace(/^#/, "").toUpperCase();
  return parseInt(cleanHex, 16);
}
