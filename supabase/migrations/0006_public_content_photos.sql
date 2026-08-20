-- Bucket dédié au contenu éditorial (recipes/places admin-seedés, sans
-- post lié) : ces photos ne passent pas par la modération utilisateur,
-- elles peuvent donc être publiques sans policy RLS complexe — à
-- l'inverse de post-photos qui reste privé (contenu utilisateur non
-- modéré tant qu'il n'est pas approuvé, voir 0001/0004).
--
-- image_credit : attribution requise par les licences Wikimedia Commons
-- (CC-BY / CC-BY-SA) utilisées pour les photos de départ — affichée en
-- légende sous chaque image sur /cuisine et /visiter.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('content-photos', 'content-photos', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Aucune policy insert/update/delete côté client : ce bucket n'est
-- alimenté que par un admin (service role / dashboard), jamais par les
-- utilisateurs. La lecture publique passe par l'endpoint /object/public/
-- qui ne consulte pas les policies RLS.

alter table public.recipes add column if not exists image_credit text;
alter table public.places add column if not exists image_credit text;
