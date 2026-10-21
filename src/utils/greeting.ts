export function getFirstName(name?: string) {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];

  return parts[1] ?? parts[0] ?? '';
}
