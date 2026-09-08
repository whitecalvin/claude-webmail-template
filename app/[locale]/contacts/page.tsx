"use client";

import { useState } from "react";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { OrgTreeSidebar } from "@/components/contacts/OrgTreeSidebar";
import { MyContactsView } from "@/components/contacts/MyContactsView";
import { OrgTeamView } from "@/components/contacts/OrgTeamView";
import { ContactsMobileView } from "@/components/contacts/ContactsMobileView";

// Contacts hub: switches the right pane between "my contacts" and the org
// chart drill-down based on what's selected in OrgTreeSidebar.
type ContactMode = "my" | "org";

export default function ContactsPage() {
  const [mode, setMode] = useState<ContactMode>("my");
  const [selectedTeamId, setSelectedTeamId] = useState("org-strategy");

  return (
    <WorkspaceLayout title="주소록" showGlobalSearch={false} className="flex flex-col lg:flex-row">
      <div className="min-h-0 flex-1 lg:hidden">
        <ContactsMobileView />
      </div>
      <div className="hidden lg:block">
        <OrgTreeSidebar
          mode={mode}
          selectedTeamId={selectedTeamId}
          onSelectTeam={(teamId) => {
            setSelectedTeamId(teamId);
            setMode("org");
          }}
          onSelectMy={() => setMode("my")}
        />
      </div>
      <div className="hidden min-w-0 flex-1 lg:flex">
        {mode === "my" ? (
          <MyContactsView />
        ) : (
          <OrgTeamView teamId={selectedTeamId} />
        )}
      </div>
    </WorkspaceLayout>
  );
}
