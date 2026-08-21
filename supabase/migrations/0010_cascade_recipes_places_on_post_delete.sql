-- Bug rapporte : supprimer une publication (recette/lieu) la retirait
-- bien de blog et "Mes publications", mais la fiche materialisee dans
-- recipes/places restait affichee sur /cuisine et /visiter — sans
-- photo (le fichier storage est supprime avec le post, mais post_id
-- devenait simplement NULL au lieu de supprimer la ligne, et le code
-- de recuperation de l'image bascule alors vers le mauvais bucket
-- "content-photos").
--
-- on delete set null etait pense pour du contenu materialise devenu
-- "independant" du post d'origine ; en pratique cela cree une fiche
-- fantome des que le post est supprime. Passe en cascade : supprimer
-- le post supprime aussi la recette/le lieu qui en est issu.

alter table public.recipes drop constraint recipes_post_id_fkey;
alter table public.recipes
  add constraint recipes_post_id_fkey
  foreign key (post_id) references public.posts (id) on delete cascade;

alter table public.places drop constraint places_post_id_fkey;
alter table public.places
  add constraint places_post_id_fkey
  foreign key (post_id) references public.posts (id) on delete cascade;
