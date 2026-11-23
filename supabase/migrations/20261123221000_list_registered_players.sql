create or replace function public.list_registered_players(search_query text default null)
returns table (display_name text)
language sql
stable
security definer
set search_path = ''
as $$
  with registered_players as (
    select coalesce(
      nullif(btrim(profile.profile ->> 'name'), ''),
      nullif(btrim(account.raw_user_meta_data ->> 'full_name'), ''),
      nullif(btrim(account.raw_user_meta_data ->> 'name'), ''),
      nullif(btrim(account.raw_user_meta_data ->> 'display_name'), '')
    ) as display_name
    from auth.users as account
    left join public.profiles as profile on profile.id = account.id
    where account.id <> auth.uid()
      and auth.uid() is not null
  )
  select registered_players.display_name
  from registered_players
  where nullif(btrim(registered_players.display_name), '') is not null
    and (
      nullif(btrim(search_query), '') is null
      or position(
        lower(btrim(search_query)) in lower(registered_players.display_name)
      ) > 0
    )
  order by lower(registered_players.display_name);
$$;

revoke all on function public.list_registered_players(text) from public, anon;
grant execute on function public.list_registered_players(text) to authenticated;
