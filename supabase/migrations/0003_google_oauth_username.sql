-- Connexion Google : aucune métadonnée "username" fournie par le
-- provider OAuth (contrairement à l'inscription email/mot de passe qui
-- la passe explicitement). handle_new_user() doit donc déduire un pseudo
-- de secours à partir de l'email, avec retry en cas de collision
-- d'unicité — sinon la création du compte Google échoue silencieusement
-- (le trigger annule l'insertion dans auth.users).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  candidate_username text;
begin
  base_username := coalesce(
    nullif(new.raw_user_meta_data ->> 'username', ''),
    regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9_-]', '', 'g')
  );

  if base_username is null or char_length(base_username) < 3 then
    base_username := 'voyageur';
  end if;

  candidate_username := left(base_username, 30);

  loop
    begin
      insert into public.profiles (id, username)
      values (new.id, candidate_username);
      exit;
    exception when unique_violation then
      candidate_username := left(base_username, 24) || '-' ||
        substr(replace(gen_random_uuid()::text, '-', ''), 1, 4);
    end;
  end loop;

  return new;
end;
$$;
