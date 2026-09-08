// Shared shapes for the Contacts / Org Chart feature.
export type ContactGroup = "외부 파트너" | "구매 담당" | "자문" | "개인";

export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  title: string;
  phone: string;
  mobile: string;
  memo: string;
  group: ContactGroup;
  initials: string;
  bg: string;
  fg: string;
  starred: boolean;
}

export interface OrgNode {
  id: string;
  name: string;
  count: number;
  depth: number;
  parentId: string | null;
}

export interface OrgMember {
  id: string;
  teamId: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  mobile: string;
  joined: string;
  approvalLine: string;
  initials: string;
  bg: string;
  fg: string;
  presence: "working" | "away" | "offline";
}

export interface PersonMail {
  subject: string;
  date: string;
}
