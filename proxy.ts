import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Exclut /admin (interne, francais uniquement), /auth (callback OAuth
  // technique), /api, les assets Next.js et les fichiers statiques.
  matcher: ["/((?!api|admin|auth|_next|_vercel|.*\\..*).*)"],
};
