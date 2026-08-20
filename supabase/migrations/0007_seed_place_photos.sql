-- Photos réelles (Wikimedia Commons, licences libres) pour les 4 lieux
-- et les 4 recettes de départ — fichiers hébergés dans le bucket public
-- content-photos sous places/<slug>.jpg et recipes/<slug>.jpg (voir
-- script d'upload, hors migration).

update public.places
set image_path = 'places/timgad.jpg',
    image_credit = 'Photo : PhR61 / Wikimedia Commons, CC BY 2.0'
where name = 'Timgad';

update public.places
set image_path = 'places/mansourah.jpg',
    image_credit = 'Photo : Koné Diakaridia 499 / Wikimedia Commons, CC BY-SA 4.0'
where name = 'Mansourah, Tlemcen';

update public.places
set image_path = 'places/casbah.jpg',
    image_credit = 'Photo : Nour Abdelatif / Wikimedia Commons, CC BY-SA 4.0'
where name = 'La Casbah d''Alger';

update public.places
set image_path = 'places/ghardaia.jpg',
    image_credit = 'Photo : Camille Gillet / Wikimedia Commons, CC BY-SA 4.0'
where name = 'Vallée du M''zab, Ghardaïa';

update public.recipes
set image_path = 'recipes/chorba.jpg',
    image_credit = 'Photo : Slothtysloth / Wikimedia Commons, CC BY-SA 4.0'
where title = 'Chorba frik (Constantine)';

update public.recipes
set image_path = 'recipes/karantika.jpg',
    image_credit = 'Photo : Plwnt / Wikimedia Commons, domaine public (CC0)'
where title = 'Karantika (Oran)';

update public.recipes
set image_path = 'recipes/rechta.jpg',
    image_credit = 'Photo : Slothtysloth / Wikimedia Commons, CC BY-SA 4.0'
where title = 'Rechta algéroise (Alger)';

update public.recipes
set image_path = 'recipes/taguella.jpg',
    image_credit = 'Photo : Johra Ferrah / Wikimedia Commons, CC BY-SA 4.0'
where title = 'Taguella (Hoggar, cuisine touareg)';
