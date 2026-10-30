const pad = (n: number) => String(n).padStart(2, '0');

/** ISO string -> `YYYY-MM-DD` in the user's local timezone (for <input type="date">). */
export function toDateInputValue(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** `YYYY-MM-DD` -> ISO string at the end of that local day, so "due today" is not overdue until tomorrow. */
export function fromDateInputValue(value: string): string | null {
  if (!value) return null;
  return new Date(`${value}T23:59:59.999`).toISOString();
}

export const formatShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
