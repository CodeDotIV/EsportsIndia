drop function if exists public.list_registered_players(text, text, text, text, text);

create function public.list_registered_players(
  search_query text default null,
  game_filter text default null,
  team_type_filter text default null,
  state_filter text default null,
  zone_filter text default null
)
returns table (
  user_id uuid,
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
      account.id as user_id,
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
    registered_players.user_id,
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
    and (
      nullif(btrim(game_filter), '') is null
      or lower(btrim(registered_players.game)) = lower(btrim(game_filter))
    )
    and (
      nullif(btrim(team_type_filter), '') is null
      or regexp_replace(lower(btrim(registered_players.team_type)), 's$', '') =
        regexp_replace(lower(btrim(team_type_filter)), 's$', '')
    )
    and (
      nullif(btrim(state_filter), '') is null
      or lower(btrim(registered_players.state)) = lower(btrim(state_filter))
    )
    and (
      nullif(btrim(zone_filter), '') is null
      or lower(btrim(registered_players.zone)) = lower(btrim(zone_filter))
    )
  order by lower(registered_players.display_name);
$$;

revoke all on function public.list_registered_players(text, text, text, text, text) from public, anon;
grant execute on function public.list_registered_players(text, text, text, text, text) to authenticated;

create or replace function public.withdraw_connection_request(target_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  deleted_rows integer;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  delete from public.connection_requests as request
  where request.requester_id = auth.uid()
    and request.receiver_id = target_user_id
    and request.status = 'pending';

  get diagnostics deleted_rows = row_count;
  return deleted_rows > 0;
end;
$$;

revoke all on function public.withdraw_connection_request(uuid) from public, anon;
grant execute on function public.withdraw_connection_request(uuid) to authenticated;

notify pgrst, 'reload schema';
