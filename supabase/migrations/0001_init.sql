-- Dz.Voyage — schéma initial (profils, blog modéré, contenu régional,
-- réactions, demandes de bénévolat).
-- Convention : toutes les tables métier ont RLS activé (règle CLAUDE.md §7.2).

create type public.post_type as enum ('nature', 'recette', 'lieu');
create type public.region as enum ('est', 'ouest', 'centre', 'sud');
create type public.post_status as enum (
  'en_attente',
  'approuvee',
  'rejetee',
  'revision_manuelle'
);
create type public.reaction_type as enum ('like', 'dislike');

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (char_length(username) between 3 and 30),
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_public"
  on public.profiles for select
  using (true);

create policy "profiles_update_self"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and is_admin = false);

-- Crée automatiquement un profil à l'inscription à partir du pseudo
-- fourni dans les métadonnées utilisateur (auth.signUp({ data: { username } })).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data ->> 'username');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- posts (blog : nature / recette / lieu)
-- ---------------------------------------------------------------------
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  type public.post_type not null,
  region public.region not null,
  title text not null check (char_length(title) between 3 and 120),
  body text not null check (char_length(body) between 10 and 5000),
  status public.post_status not null default 'en_attente',
  created_at timestamptz not null default now()
);

create index posts_status_idx on public.posts (status);
create index posts_type_idx on public.posts (type);

alter table public.posts enable row level security;

create policy "posts_select_approved_or_own"
  on public.posts for select
  using (status = 'approuvee' or author_id = auth.uid());

create policy "posts_insert_own"
  on public.posts for insert
  with check (author_id = auth.uid() and status = 'en_attente');

create policy "posts_delete_own"
  on public.posts for delete
  using (author_id = auth.uid());

-- Aucune policy update côté client : le changement de statut (modération)
-- passe uniquement par la route serveur avec la clé service_role.

-- ---------------------------------------------------------------------
-- post_photos
-- ---------------------------------------------------------------------
create table public.post_photos (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  storage_path text not null,
  position smallint not null default 0
);

alter table public.post_photos enable row level security;

create policy "post_photos_select_approved_or_own"
  on public.post_photos for select
  using (
    exists (
      select 1 from public.posts p
      where p.id = post_id and (p.status = 'approuvee' or p.author_id = auth.uid())
    )
  );

create policy "post_photos_insert_own"
  on public.post_photos for insert
  with check (
    exists (
      select 1 from public.posts p
      where p.id = post_id and p.author_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------
-- recipes (contenu public "cuisine" — admin-seedé ou matérialisé depuis
-- un post de type recette approuvé, écriture réservée au service role)
-- ---------------------------------------------------------------------
create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts (id) on delete set null,
  region public.region not null,
  title text not null,
  is_dessert boolean not null default false,
  ingredients text not null,
  steps text not null,
  image_path text,
  created_at timestamptz not null default now()
);

alter table public.recipes enable row level security;

create policy "recipes_select_public"
  on public.recipes for select
  using (true);

-- ---------------------------------------------------------------------
-- places (contenu public "à visiter" — même logique que recipes)
-- ---------------------------------------------------------------------
create table public.places (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts (id) on delete set null,
  region public.region not null,
  name text not null,
  description text not null,
  category text,
  image_path text,
  created_at timestamptz not null default now()
);

alter table public.places enable row level security;

create policy "places_select_public"
  on public.places for select
  using (true);

-- ---------------------------------------------------------------------
-- festivals (contenu curé uniquement, pas de flux utilisateur)
-- ---------------------------------------------------------------------
create table public.festivals (
  id uuid primary key default gen_random_uuid(),
  region public.region not null,
  name text not null,
  description text not null,
  period text,
  created_at timestamptz not null default now()
);

alter table public.festivals enable row level security;

create policy "festivals_select_public"
  on public.festivals for select
  using (true);

-- ---------------------------------------------------------------------
-- post_reactions (like/dislike, un seul par utilisateur et par post —
-- pas de commentaires, voir brief §3)
-- ---------------------------------------------------------------------
create table public.post_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  reaction public.reaction_type not null,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

alter table public.post_reactions enable row level security;

create policy "post_reactions_select_public"
  on public.post_reactions for select
  using (true);

create policy "post_reactions_upsert_own"
  on public.post_reactions for insert
  with check (user_id = auth.uid());

create policy "post_reactions_update_own"
  on public.post_reactions for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "post_reactions_delete_own"
  on public.post_reactions for delete
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- volunteer_requests (formulaire contact — écriture publique, lecture admin)
-- ---------------------------------------------------------------------
create table public.volunteer_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (position('@' in email) > 1),
  region public.region not null,
  message text,
  created_at timestamptz not null default now()
);

alter table public.volunteer_requests enable row level security;

create policy "volunteer_requests_insert_public"
  on public.volunteer_requests for insert
  with check (true);

create policy "volunteer_requests_select_admin"
  on public.volunteer_requests for select
  using (
    exists (
      select 1 from public.profiles pr
      where pr.id = auth.uid() and pr.is_admin = true
    )
  );

-- ---------------------------------------------------------------------
-- Storage : bucket "post-photos", chemin conventionnel
-- `${authorId}/${postId}/${fichier}`. Le bucket reste privé (pas de
-- lecture anonyme par défaut) ; l'accès est ouvert par policy à
-- l'auteur, aux admins, et à tout visiteur une fois le post
-- correspondant approuvé — ce qui couvre l'affichage public sur
-- /blog, /cuisine et /visiter sans jamais exposer une photo en attente.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('post-photos', 'post-photos', false)
on conflict (id) do nothing;

create policy "post_photos_storage_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'post-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "post_photos_storage_select_own_admin_or_approved"
  on storage.objects for select
  using (
    bucket_id = 'post-photos'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or exists (
        select 1 from public.profiles pr
        where pr.id = auth.uid() and pr.is_admin = true
      )
      or exists (
        select 1 from public.posts p
        where p.id::text = (storage.foldername(name))[2]
          and p.status = 'approuvee'
      )
    )
  );
