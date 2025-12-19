/**
 * Identifies the color family based on HSL color values.
 *
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns The color family name
 *
 *
 */
import { COLOR_FAMILY } from "../color-enums";

export function identifyColorFamily(h: number, s: number, l: number): COLOR_FAMILY {
  // Check for achromatic colors first (low saturation or extreme lightness)
  if (l >= 95) {
    return COLOR_FAMILY.WHITE;
  }

  if (l <= 8) {
    return COLOR_FAMILY.BLACK;
  }

  if (s <= 10) {
    return COLOR_FAMILY.GREY;
  }

  // Check for brown (low-medium saturation, warm hues, low-medium lightness)
  if (s <= 50 && l <= 45 && ((h >= 0 && h <= 45) || h >= 350)) {
    return COLOR_FAMILY.BROWN;
  }

  // Determine color family by hue
  if (h >= 345 || h < 10) {
    return COLOR_FAMILY.RED;
  }

  if (h >= 10 && h < 45) {
    // Distinguish between orange and brown
    if (s <= 40 && l <= 50) {
      return COLOR_FAMILY.BROWN;
    }
    return COLOR_FAMILY.ORANGE;
  }

  if (h >= 45 && h < 65) {
    return COLOR_FAMILY.YELLOW;
  }

  if (h >= 65 && h < 165) {
    return COLOR_FAMILY.GREEN;
  }

  if (h >= 165 && h < 255) {
    return COLOR_FAMILY.BLUE;
  }

  if (h >= 255 && h < 290) {
    return COLOR_FAMILY.PURPLE;
  }

  if (h >= 290 && h < 345) {
    return COLOR_FAMILY.PINK;
  }

  return COLOR_FAMILY.OTHER;
}
