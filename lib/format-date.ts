// Formats an ISO timestamp the way a mail list typically does: a bare time
// for today, "어제" (yesterday) for the previous day, otherwise a short date.
export function formatMailTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();

  if (sameDay) {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "어제";
  }

  return date.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
}
