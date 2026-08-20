-- Données de départ (brief §5.1 et §6.1) : une recette et un lieu par
-- région, contenu admin (post_id null). Aucune photo réelle fournie —
-- ne pas scraper de résultats de recherche image (droits non garantis) ;
-- image_path reste vide jusqu'à ce qu'une vraie photo sourcée (Wikimedia
-- Commons pour le patrimoine, Unsplash/Pexels pour le générique, ou une
-- photo de blog approuvée) soit renseignée manuellement.

-- ---------------------------------------------------------------------
-- recipes
-- ---------------------------------------------------------------------

insert into public.recipes (region, title, is_dessert, ingredients, steps)
values (
  'est',
  'Chorba frik (Constantine)',
  false,
  $ing$400 g d'agneau en morceaux
4 hauts de cuisse de poulet
1 gros oignon
1 tomate fraîche mixée
2 c. à soupe de concentré de tomate
100 g de frik
Une poignée de pois chiches trempés la veille
1 botte de coriandre
1 branche de céleri
Sel, poivre, paprika doux
1 c. à café de cannelle$ing$,
  $steps$1. Faire revenir la viande et le poulet avec l'oignon émincé, saler, poivrer.
2. Ajouter la tomate mixée et le concentré, laisser mijoter.
3. Couvrir d'eau chaude (~2 L), ajouter les pois chiches, cuire 20 min.
4. Ajouter le frik rincé, la coriandre et le céleri ciselés, laisser mijoter jusqu'à ce que le frik soit tendre.
5. Servir chaud, avec citron et galette algérienne.$steps$
);

insert into public.recipes (region, title, is_dessert, ingredients, steps)
values (
  'ouest',
  'Karantika (Oran)',
  false,
  $ing$250 g de farine de pois chiches
750 ml d'eau
2 œufs
3 c. à soupe d'huile d'olive
1 c. à café de sel
Cumin (servi à part)$ing$,
  $steps$1. Fouetter la farine avec l'eau froide jusqu'à obtenir une pâte lisse.
2. Laisser reposer 30 min à température ambiante.
3. Ajouter les œufs battus, l'huile, le sel, bien mélanger.
4. Verser dans un plat huilé, cuire au four 200 °C, 40-45 min jusqu'à surface dorée et centre pris.
5. Servir chaud, saupoudré de cumin, avec pain et harissa.$steps$
);

insert into public.recipes (region, title, is_dessert, ingredients, steps)
values (
  'centre',
  'Rechta algéroise (Alger)',
  false,
  $ing$500 g de rechta (fraîche ou du commerce)
1 poulet en morceaux
2 oignons
500 g de navets
Une poignée de pois chiches trempés la veille
Smen ou beurre, huile
1 bâton de cannelle, cannelle moulue pour le service
Sel, poivre$ing$,
  $steps$1. Faire revenir le poulet avec l'oignon dans le smen et l'huile.
2. Saler, poivrer, ajouter le bâton de cannelle, couvrir d'eau tiède, laisser mijoter.
3. Ajouter les pois chiches à mi-cuisson, puis les navets en quartiers.
4. Cuire la rechta à la vapeur au-dessus de la sauce, en deux passages.
5. Dresser la rechta, disposer poulet/navets/pois chiches autour, arroser de sauce blanche, saupoudrer de cannelle.$steps$
);

insert into public.recipes (region, title, is_dessert, ingredients, steps)
values (
  'sud',
  'Taguella (Hoggar, cuisine touareg)',
  false,
  $ing$1 kg de semoule grossière (ou farine de blé entier)
1 c. à soupe de sel
~500 ml d'eau tiède$ing$,
  $steps$1. Mélanger semoule et sel, ajouter l'eau progressivement en pétrissant ~20 min jusqu'à une pâte souple.
2. Façonner une galette épaisse.
3. Sur un feu de braises et sol sableux propre, creuser un foyer et y déposer la galette.
4. Recouvrir de sable puis de braises, cuire ~20 min, retourner, répéter de l'autre côté.
5. Retirer, brosser pour enlever tout le sable, servir avec bouillon ou sauce de viande.
Note : recette nécessitant un feu de camp — plat culturel emblématique ; une version four adaptée peut être proposée en option.$steps$
);

-- ---------------------------------------------------------------------
-- places
-- ---------------------------------------------------------------------

insert into public.places (region, name, description, category)
values (
  'est',
  'Timgad',
  $desc$Cité romaine fondée vers 100 apr. J.-C., l'une des mieux conservées d'Afrique du Nord (arc de Trajan, théâtre, forum). Classée UNESCO.$desc$,
  'Site archéologique'
);

insert into public.places (region, name, description, category)
values (
  'ouest',
  'Mansourah, Tlemcen',
  $desc$Ancienne ville fortifiée almohade-mérinide avec son minaret monumental, témoin de l'âge d'or de Tlemcen.$desc$,
  'Site historique'
);

insert into public.places (region, name, description, category)
values (
  'centre',
  'La Casbah d''Alger',
  $desc$Cœur historique d'Alger, dédale de ruelles et de maisons ottomanes surplombant la baie. Classée UNESCO.$desc$,
  'Quartier historique'
);

insert into public.places (region, name, description, category)
values (
  'sud',
  'Vallée du M''zab, Ghardaïa',
  $desc$Ensemble de cinq ksour mozabites (dont Ghardaïa, Beni Isguen), architecture en terre remarquable, classé UNESCO.$desc$,
  'Site UNESCO'
);
