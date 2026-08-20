# Dz.Voyage

Site touristique de l'Algérie — histoire, cuisine, lieux à visiter et
guides bénévoles, région par région.

**Démo en ligne : https://dz-voyage.hachemi-souici.workers.dev**

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) 4
- [Supabase](https://supabase.com) (Postgres, Auth, Storage)
- Déploiement [Cloudflare Workers](https://developers.cloudflare.com/workers/) via [OpenNext](https://opennext.js.org/cloudflare)
- `pnpm` comme gestionnaire de paquets

## Développement local

```bash
pnpm install
cp .env.example .env.local   # renseigner les clés Supabase
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

Les migrations SQL du schéma (tables, RLS, storage) sont dans
`supabase/migrations/`, à exécuter dans l'ordre via le SQL Editor du
projet Supabase.

## Déploiement (Cloudflare Workers)

```bash
pnpm exec wrangler login        # une seule fois
pnpm exec wrangler secret put NEXT_PUBLIC_SUPABASE_URL
pnpm exec wrangler secret put NEXT_PUBLIC_SUPABASE_ANON_KEY
pnpm exec wrangler secret put SUPABASE_SERVICE_ROLE_KEY
pnpm run deploy
```

## Scripts

| Commande | Description |
|---|---|
| `pnpm dev` | Serveur de développement |
| `pnpm build` | Build de production Next.js |
| `pnpm lint` | ESLint |
| `pnpm preview` | Build OpenNext + aperçu local sous Workers |
| `pnpm deploy` | Build OpenNext + déploiement Cloudflare Workers |
