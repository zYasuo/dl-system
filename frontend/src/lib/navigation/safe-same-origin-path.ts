export function safeSameOriginPath(
  raw: string | null | undefined,
  options?: { fallback?: string; origin?: string },
): string {
  const fallback = options?.fallback ?? "/dashboard";
  const baseOrigin =
    options?.origin ??
    (typeof window !== "undefined" ? window.location.origin : "");

  if (!raw?.trim() || !baseOrigin) {
    return fallback;
  }

  try {
    const resolved = new URL(raw, baseOrigin);
    if (resolved.origin !== baseOrigin) {
      return fallback;
    }
    return `${resolved.pathname}${resolved.search}${resolved.hash}`;
  } catch {
    return fallback;
  }
}
