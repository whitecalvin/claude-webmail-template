import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match every route except Next.js internals and files with an extension
  // (e.g. favicon.ico), so the locale prefix doesn't leak onto static assets.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
