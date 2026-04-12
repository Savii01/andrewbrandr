/**
 * Generates an SVG avatar with initials for users without profile images.
 * @param name The name of the user to generate initials from.
 * @returns A base64 data URL of the SVG avatar.
 */
export function generateAvatar(name: string): string {
  if (!name) return "";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const bgColor = "#F23F03";
  const textColor = "#FFFFFF";

  // Create a simple SVG avatar as a string (minified to avoid encoding issues)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="${bgColor}"/><text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" fill="${textColor}" font-size="42" font-family="Arial, sans-serif" font-weight="bold">${initials}</text></svg>`;

  // Encode SVG to Base64
  const base64Svg = typeof window !== "undefined" 
    ? window.btoa(unescape(encodeURIComponent(svg))) 
    : Buffer.from(svg).toString("base64");

  return `data:image/svg+xml;base64,${base64Svg}`;
}
