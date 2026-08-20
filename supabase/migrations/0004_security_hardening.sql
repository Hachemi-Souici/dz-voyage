-- Durcissement suite à revue sécurité (revue-securite-web) :
--
-- 1. profiles : la policy d'update self ne protégeait pas correctement
--    is_admin (un admin ne pouvait même plus éditer son propre pseudo,
--    et la logique de contrôle sur la nouvelle ligne était fragile).
--    Remplacée par un trigger qui verrouille la colonne is_admin contre
--    toute écriture passant par un utilisateur authentifié (auth.uid()
--    non nul) ; une promotion reste possible via service_role ou SQL
--    Studio (auth.uid() y est nul).
-- 2. post_photos : l'auteur pouvait ajouter des photos à un post déjà
--    approuvé, contournant la validation manuelle obligatoire. Insertion
--    désormais limitée aux posts encore en_attente.
-- 3. post_reactions : réaction restreinte aux posts approuvés.
-- 4. storage.buckets : limite de taille et types MIME sur post-photos
--    (aucune limite n'était définie).

-- 1. Protection de profiles.is_admin
create or replace function public.protect_profile_privileged_columns()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() is not null and new.is_admin is distinct from old.is_admin then
    new.is_admin := old.is_admin;
  end if;
  return new;
end;
$$;

create trigger profiles_protect_is_admin
  before update on public.profiles
  for each row execute function public.protect_profile_privileged_columns();

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 2. post_photos : insertion uniquement tant que le post est en_attente
drop policy if exists "post_photos_insert_own" on public.post_photos;
create policy "post_photos_insert_own"
  on public.post_photos for insert
  with check (
    exists (
      select 1 from public.posts p
      where p.id = post_id and p.author_id = auth.uid() and p.status = 'en_attente'
    )
  );

-- 3. post_reactions : réservées aux posts approuvés
drop policy if exists "post_reactions_upsert_own" on public.post_reactions;
create policy "post_reactions_upsert_own"
  on public.post_reactions for insert
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.posts p where p.id = post_id and p.status = 'approuvee')
  );

drop policy if exists "post_reactions_update_own" on public.post_reactions;
create policy "post_reactions_update_own"
  on public.post_reactions for update
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.posts p where p.id = post_id and p.status = 'approuvee')
  );

-- 4. Limites sur le bucket post-photos (10 Mo, images uniquement)
update storage.buckets
set file_size_limit = 10485760,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/heic']
where id = 'post-photos';
