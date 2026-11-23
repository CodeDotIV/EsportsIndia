create table if not exists public.team_directory (
  owner_id uuid primary key references auth.users (id) on delete cascade,
  team_name text not null check (length(btrim(team_name)) > 0),
  updated_at timestamptz not null default now()
);

alter table public.team_directory enable row level security;

drop policy if exists team_directory_select_own on public.team_directory;
create policy team_directory_select_own
  on public.team_directory
  for select
  to authenticated
  using ((select auth.uid()) = owner_id);

drop policy if exists team_directory_insert_own on public.team_directory;
create policy team_directory_insert_own
  on public.team_directory
  for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

drop policy if exists team_directory_update_own on public.team_directory;
create policy team_directory_update_own
  on public.team_directory
  for update
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

drop policy if exists team_directory_delete_own on public.team_directory;
create policy team_directory_delete_own
  on public.team_directory
  for delete
  to authenticated
  using ((select auth.uid()) = owner_id);

grant select, insert, update, delete on table public.team_directory to authenticated;

create or replace function public.search_teams(search_query text)
returns table (team_name text)
language sql
stable
security definer
set search_path = ''
as $$
  select distinct directory.team_name
  from public.team_directory as directory
  where auth.uid() is not null
    and nullif(btrim(search_query), '') is not null
    and position(lower(btrim(search_query)) in lower(directory.team_name)) > 0
  order by directory.team_name
  limit 50;
$$;

revoke all on function public.search_teams(text) from public, anon;
grant execute on function public.search_teams(text) to authenticated;

insert into public.team_directory (owner_id, team_name)
select profile.id, btrim(profile.profile ->> 'teamName')
from public.profiles as profile
where nullif(btrim(profile.profile ->> 'teamName'), '') is not null
on conflict (owner_id) do update
set team_name = excluded.team_name,
    updated_at = now();
