import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Reste volontairement en middleware.ts (convention depreciee par
// Next.js 16 au profit de proxy.ts) : proxy.ts est fige en runtime
// Node.js et non configurable, or @opennextjs/cloudflare ne supporte
// pas encore le middleware Node.js sur Cloudflare Workers ("Node.js
// middleware is not currently supported"). middleware.ts reste seul a
// pouvoir tourner en edge runtime, requis ici. Ne pas renommer en
// proxy.ts sans avoir verifie que le support Node.js est arrive cote
// @opennextjs/cloudflare.

export default createMiddleware(routing);

export const config = {
  // Exclut /admin (interne, francais uniquement), /auth (callback OAuth
  // technique), /api, les assets Next.js et les fichiers statiques.
  matcher: ["/((?!api|admin|auth|_next|_vercel|.*\\..*).*)"],
};
