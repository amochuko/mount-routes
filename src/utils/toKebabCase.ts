/**
 * It formats a string from PasCalCase or camelCase
 * to kebab-case
 * 
 * @param name The string to format
 * @returns 
 */
export function toKebabCase(name: string): string {
  // Remove "Router" suffix if present
  const base = name.replace(/Router$/i, "");

  // Insert hyphen before uppercase letters and lowercase all
  return base
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2") // camelCase → kebab
    .toLowerCase();
}
