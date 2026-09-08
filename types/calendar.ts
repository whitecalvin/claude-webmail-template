// Shared shapes for the Calendar feature.
export type CalendarCategory =
  | "personal"
  | "team"
  | "executive"
  | "room"
  | "holiday";

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  startHour: number;
  endHour: number;
  title: string;
  meta: string;
  color: string;
  category: CalendarCategory;
}

export interface CalendarListEntry {
  key: CalendarCategory;
  name: string;
  color: string;
}

export interface MeetingRoom {
  name: string;
  capacity: number;
  amenity: string;
  status: "available" | "busy" | "reserved";
  statusLabel: string;
}
