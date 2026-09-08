import { ChevronRight } from "lucide-react";

export function SettingsHeaderTitle({ title }: { title: string }) {
  return (
    <nav aria-label="설정 위치" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1.5">
        <li className="shrink-0 font-medium text-(--text-muted)">설정</li>
        <li aria-hidden="true" className="shrink-0 text-(--text-muted)">
          <ChevronRight size={14} />
        </li>
        <li aria-current="page" className="min-w-0 truncate font-bold">
          {title}
        </li>
      </ol>
    </nav>
  );
}
