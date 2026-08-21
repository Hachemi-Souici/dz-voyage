-- Notifications in-app simples (pas d'email/push pour l'instant) :
-- un enregistrement par evenement, affiche via une cloche dans le
-- header. Pour l'instant, seul l'evenement "post_approved" est cree,
-- depuis la route de moderation (service role) au moment de
-- l'approbation d'une publication.

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  post_id uuid references public.posts (id) on delete cascade,
  type text not null default 'post_approved' check (type in ('post_approved')),
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_id_idx on public.notifications (user_id);

alter table public.notifications enable row level security;

create policy "notifications_select_own"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "notifications_update_own"
  on public.notifications for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Aucune policy insert cote client : creees uniquement par la route de
-- moderation via le service role (voir app/api/posts/[id]/moderation).
