// version1
// author Yxff
export function getInitials(firstName?: string, lastName?: string): string {
  if (!firstName && !lastName) return "U"
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U"
} 