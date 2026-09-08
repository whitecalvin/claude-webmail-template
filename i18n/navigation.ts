import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware drop-in replacements for next/link and next/navigation.
// Every in-app <Link>/router.push/usePathname should import from here
// instead, so the current locale prefix is preserved automatically.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
