-- Champs conditionnels par type de post (recette : ingrédients/étapes/
-- dessert ; lieu : nom/catégorie). Stockés ici tant que le post n'est
-- pas approuvé, puis matérialisés vers recipes/places par la route de
-- modération (service role) au moment de l'approbation.

alter table public.posts
  add column details jsonb not null default '{}'::jsonb;
