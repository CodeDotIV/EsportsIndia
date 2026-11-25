alter table public.team_directory
  add column if not exists state text,
  add column if not exists zone text;

update public.team_directory as directory
set game = nullif(btrim(profile.profile ->> 'favoriteGame'), ''),
    game_mode = nullif(btrim(profile.profile ->> 'preferredGameMode'), ''),
    state = nullif(btrim(profile.profile ->> 'state'), ''),
    zone = nullif(btrim(profile.profile ->> 'zone'), '')
from public.profiles as profile
where profile.id = directory.owner_id;

drop function if exists public.filter_teams(text, text, text, text);
drop function if exists public.get_team_filter_options();

create or replace function public.filter_teams_by_profile(
  search_query text,
  game_filter text,
  mode_filter text,
  state_filter text,
  zone_filter text
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
      nullif(btrim(state_filter), '') is null
      or lower(btrim(directory.state)) = lower(btrim(state_filter))
    )
    and (
      nullif(btrim(zone_filter), '') is null
      or lower(btrim(directory.zone)) = lower(btrim(zone_filter))
    )
  order by directory.team_name
  limit 50;
$$;

revoke all on function public.filter_teams_by_profile(text, text, text, text, text) from public, anon;
grant execute on function public.filter_teams_by_profile(text, text, text, text, text) to authenticated;

create or replace function public.get_team_profile_filter_options()
returns table (games text[], states text[])
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
      array_agg(distinct directory.state order by directory.state)
        filter (where nullif(btrim(directory.state), '') is not null),
      array[]::text[]
    )
  from public.team_directory as directory
  where auth.uid() is not null;
$$;

revoke all on function public.get_team_profile_filter_options() from public, anon;
grant execute on function public.get_team_profile_filter_options() to authenticated;

drop function if exists public.list_registered_players(text);

create function public.list_registered_players(search_query text default null)
returns table (
  display_name text,
  game text,
  bio text,
  team_name text,
  state text,
  zone text,
  team_type text,
  looking_for_tournament_partners boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  with registered_players as (
    select
      coalesce(
        nullif(btrim(profile.profile ->> 'name'), ''),
        nullif(btrim(account.raw_user_meta_data ->> 'full_name'), ''),
        nullif(btrim(account.raw_user_meta_data ->> 'name'), ''),
        nullif(btrim(account.raw_user_meta_data ->> 'display_name'), '')
      ) as display_name,
      nullif(btrim(profile.profile ->> 'favoriteGame'), '') as game,
      nullif(btrim(profile.profile ->> 'bio'), '') as bio,
      nullif(btrim(profile.profile ->> 'teamName'), '') as team_name,
      nullif(btrim(profile.profile ->> 'state'), '') as state,
      nullif(btrim(profile.profile ->> 'zone'), '') as zone,
      nullif(btrim(profile.profile ->> 'preferredGameMode'), '') as team_type,
      coalesce(
        lower(btrim(profile.profile ->> 'lookingForTournamentPartners')) = 'true',
        false
      ) as looking_for_tournament_partners
    from auth.users as account
    left join public.profiles as profile on profile.id = account.id
    where account.id <> auth.uid()
      and auth.uid() is not null
  )
  select
    registered_players.display_name,
    registered_players.game,
    registered_players.bio,
    registered_players.team_name,
    registered_players.state,
    registered_players.zone,
    registered_players.team_type,
    registered_players.looking_for_tournament_partners
  from registered_players
  where nullif(btrim(registered_players.display_name), '') is not null
    and (
      nullif(btrim(search_query), '') is null
      or position(lower(btrim(search_query)) in lower(registered_players.display_name)) > 0
    )
  order by lower(registered_players.display_name);
$$;

revoke all on function public.list_registered_players(text) from public, anon;
grant execute on function public.list_registered_players(text) to authenticated;
