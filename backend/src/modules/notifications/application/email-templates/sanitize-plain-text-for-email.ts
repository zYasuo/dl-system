const LINE_SEPARATORS = /\r\n|\r|\n|\u2028|\u2029|\v|\f/g;
const C0_C1_CONTROLS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\u0080-\u009F]/g;

export function sanitizePlainTextEmailDisplay(value: string): string {
  return value
    .replace(LINE_SEPARATORS, ' ')
    .replace(C0_C1_CONTROLS, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function sanitizePlainTextEmailOpaque(value: string): string {
  return value.replace(LINE_SEPARATORS, '').replace(C0_C1_CONTROLS, '').trim();
}
