// Formats a Date as a local YYYY-MM-DD key (not UTC), used to index calendar
// events by day and to back <input type="date"> values.
export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
