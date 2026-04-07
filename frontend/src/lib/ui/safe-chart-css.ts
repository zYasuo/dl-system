const SERIES_KEY_RE = /^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/;

export function sanitizeChartSeriesKey(key: string): string | null {
  return SERIES_KEY_RE.test(key) ? key : null;
}

export function sanitizeChartCssColor(value: string): string | null {
  const v = value.trim();
  if (!v || v.length > 200) return null;
  if (/[;{}\\<]/.test(v)) return null;
  if (/url\s*\(/i.test(v) || /@import/i.test(v)) return null;
  if (/^var\(\s*--[-a-zA-Z0-9]+\s*\)$/.test(v)) return v;
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(v)) return v;
  if (/^(rgb|rgba|hsl|hsla)\([\d\s.,%/]+\)$/i.test(v)) return v;
  return null;
}

export function sanitizeChartDomId(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 128);
  return cleaned.length > 0 ? cleaned : "chart";
}
