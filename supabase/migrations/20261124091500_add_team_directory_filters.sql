alter table public.team_directory
  add column if not exists game text,
  add column if not exists game_mode text,
  add column if not exists location text;

update public.team_directory as directory
set game = nullif(btrim(profile.profile ->> 'favoriteGame'), ''),
    game_mode = nullif(btrim(profile.profile ->> 'preferredGameMode'), ''),
    location = nullif(btrim(profile.profile ->> 'location'), '')
from public.profiles as profile
where profile.id = directory.owner_id;

create or replace function public.filter_teams(
  search_query text default null,
  game_filter text default null,
  mode_filter text default null,
  location_filter text default null
)
returns table (team_name text)
language sql
stable
security definer
set search_path = ''
as $$
  select distinct directory.team_name
  from public.team_directory as directory
  where auth.uid() is not null
    and (
      nullif(btrim(search_query), '') is null
      or position(lower(btrim(search_query)) in lower(directory.team_name)) > 0
    )
    and (
      nullif(btrim(game_filter), '') is null
      or lower(btrim(directory.game)) = lower(btrim(game_filter))
    )
    and (
      nullif(btrim(mode_filter), '') is null
      or regexp_replace(lower(btrim(directory.game_mode)), 's$', '') =
        regexp_replace(lower(btrim(mode_filter)), 's$', '')
    )
    and (
      nullif(btrim(location_filter), '') is null
      or lower(btrim(directory.location)) = lower(btrim(location_filter))
    )
  order by directory.team_name
  limit 50;
$$;

revoke all on function public.filter_teams(text, text, text, text) from public, anon;
grant execute on function public.filter_teams(text, text, text, text) to authenticated;

create or replace function public.get_team_filter_options()
returns table (games text[], locations text[])
language sql
stable
security definer
set search_path = ''
as $$
  select
    coalesce(
      array_agg(distinct directory.game order by directory.game)
        filter (where nullif(btrim(directory.game), '') is not null),
      array[]::text[]
    ),
    coalesce(
      array_agg(distinct directory.location order by directory.location)
        filter (where nullif(btrim(directory.location), '') is not null),
      array[]::text[]
    )
  from public.team_directory as directory
  where auth.uid() is not null;
$$;

revoke all on function public.get_team_filter_options() from public, anon;
grant execute on function public.get_team_filter_options() to authenticated;
