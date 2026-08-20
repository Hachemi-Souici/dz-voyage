import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Cache incrémental par défaut (pas de R2 pour l'instant — le site est
// majoritairement rendu dynamiquement, ISR peu utilisé ici). À
// reconsidérer avec r2IncrementalCache si des pages statiques/ISR
// coûteuses apparaissent.
export default defineCloudflareConfig();
