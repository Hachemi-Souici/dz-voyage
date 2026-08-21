-- Notifications : ajoute le type "post_pending" (nouvelle publication a
-- moderer), envoye a chaque admin depuis /api/moderate au moment de la
-- creation d'une publication (jusque-la, seul "post_approved" existait).
alter table public.notifications drop constraint notifications_type_check;
alter table public.notifications
  add constraint notifications_type_check check (type in ('post_approved', 'post_pending'));
