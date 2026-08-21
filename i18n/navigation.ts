import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Link/redirect/useRouter localises : prennent un chemin interne
// (ex. "/connexion") et generent l'URL traduite pour la langue courante.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
