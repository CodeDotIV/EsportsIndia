update public.profiles
set profile = jsonb_strip_nulls(jsonb_build_object(
  'name', profile -> 'name',
  'phone', profile -> 'phone',
  'gender', profile -> 'gender',
  'dateOfBirth', profile -> 'dateOfBirth',
  'game', coalesce(nullif(profile -> 'game', 'null'::jsonb), profile -> 'favoriteGame'),
  'bio', profile -> 'bio',
  'teamName', profile -> 'teamName',
  'state', coalesce(nullif(profile -> 'state', 'null'::jsonb), profile -> 'location'),
  'zone', profile -> 'zone',
  'teamType', coalesce(nullif(profile -> 'teamType', 'null'::jsonb), profile -> 'preferredGameMode'),
  'lookingFor', profile -> 'lookingFor',
  'tournamentPartners',
    coalesce(nullif(profile -> 'tournamentPartners', 'null'::jsonb), profile -> 'lookingForTournamentPartners')
));

update auth.users
set raw_user_meta_data =
  (raw_user_meta_data - array[
    'location',
    'avatar',
    'gamingUsername',
    'favoriteGame',
    'gamingPlatform',
    'skillLevel',
    'yearsOfGaming',
    'preferredGameMode',
    'lookingForTournamentPartners',
    'country',
    'timezone',
    'language',
    'instagram',
    'twitter',
    'discord',
    'youtube',
    'twitch',
    'profileCompleted'
  ]) || jsonb_strip_nulls(jsonb_build_object(
    'game', coalesce(
      nullif(raw_user_meta_data -> 'game', 'null'::jsonb),
      raw_user_meta_data -> 'favoriteGame'
    ),
    'state', coalesce(
      nullif(raw_user_meta_data -> 'state', 'null'::jsonb),
      raw_user_meta_data -> 'location'
    ),
    'teamType', coalesce(
      nullif(raw_user_meta_data -> 'teamType', 'null'::jsonb),
      raw_user_meta_data -> 'preferredGameMode'
    ),
    'tournamentPartners', coalesce(
      nullif(raw_user_meta_data -> 'tournamentPartners', 'null'::jsonb),
      raw_user_meta_data -> 'lookingForTournamentPartners'
    )
  ))
where raw_user_meta_data ?| array[
  'location',
  'avatar',
  'gamingUsername',
  'favoriteGame',
  'gamingPlatform',
  'skillLevel',
  'yearsOfGaming',
  'preferredGameMode',
  'lookingForTournamentPartners',
  'country',
  'timezone',
  'language',
  'instagram',
  'twitter',
  'discord',
  'youtube',
  'twitch',
  'profileCompleted'
];

alter table public.team_directory
  rename column game_mode to team_type;

alter table public.team_directory
  drop column location;

update public.team_directory as directory
set team_name = btrim(profile.profile ->> 'teamName'),
    game = nullif(btrim(profile.profile ->> 'game'), ''),
    team_type = nullif(btrim(profile.profile ->> 'teamType'), ''),
    state = nullif(btrim(profile.profile ->> 'state'), ''),
    zone = nullif(btrim(profile.profile ->> 'zone'), ''),
    updated_at = now()
from public.profiles as profile
where profile.id = directory.owner_id
  and nullif(btrim(profile.profile ->> 'teamName'), '') is not null;

delete from public.team_directory as directory
where not exists (
  select 1
  from public.profiles as profile
  where profile.id = directory.owner_id
    and nullif(btrim(profile.profile ->> 'teamName'), '') is not null
);

drop function if exists public.filter_teams_by_profile(text, text, text, text, text);

create function public.filter_teams_by_profile(
  search_query text,
  game_filter text,
  team_type_filter text,
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
      nullif(btrim(team_type_filter), '') is null
      or regexp_replace(lower(btrim(directory.team_type)), 's$', '') =
        regexp_replace(lower(btrim(team_type_filter)), 's$', '')
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
  looking_for text,
  tournament_partners boolean
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
      nullif(btrim(profile.profile ->> 'game'), '') as game,
      nullif(btrim(profile.profile ->> 'bio'), '') as bio,
      nullif(btrim(profile.profile ->> 'teamName'), '') as team_name,
      nullif(btrim(profile.profile ->> 'state'), '') as state,
      nullif(btrim(profile.profile ->> 'zone'), '') as zone,
      nullif(btrim(profile.profile ->> 'teamType'), '') as team_type,
      nullif(btrim(profile.profile ->> 'lookingFor'), '') as looking_for,
      coalesce(
        lower(btrim(profile.profile ->> 'tournamentPartners')) = 'true',
        false
      ) as tournament_partners
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
    registered_players.looking_for,
    registered_players.tournament_partners
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
