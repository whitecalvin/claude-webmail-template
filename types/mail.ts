// Shared shapes for the mail feature (inbox, compose, meeting invites).
export type FolderId =
  | "inbox"
  | "starred"
  | "drafts"
  | "sent"
  | "archive"
  | "spam"
  | "trash";

export interface Folder {
  id: FolderId;
  label: string;
}

export type RsvpChoice = "accept" | "tentative" | "decline";

export interface MeetingInvite {
  dateLabel: { month: string; day: string; weekday: string };
  when: string;
  where: string;
  organizer: string;
  recurrence?: string;
  conflict?: string;
  attendees: {
    name: string;
    team: string;
    state: "참석" | "미정" | "불참" | "응답 없음";
    isHost?: boolean;
  }[];
}

export interface Email {
  id: string;
  folder: FolderId;
  from: { name: string; email: string };
  to: string[];
  cc?: string[];
  subject: string;
  preview: string;
  body: string[];
  receivedAt: string;
  unread: boolean;
  starred: boolean;
  invite?: MeetingInvite;
}

export interface ComposeDraft {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
}
