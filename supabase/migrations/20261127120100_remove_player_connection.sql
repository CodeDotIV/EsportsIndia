drop function if exists public.remove_player_connection(uuid);

create function public.remove_player_connection(target_user_id uuid)
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

  if target_user_id is null or target_user_id = auth.uid() then
    raise exception 'Invalid player ID';
  end if;

  delete from public.connection_requests as request
  where request.status = 'accepted'
    and (
      (
        request.requester_id = auth.uid()
        and request.receiver_id = target_user_id
      )
      or (
        request.receiver_id = auth.uid()
        and request.requester_id = target_user_id
      )
    );

  get diagnostics deleted_rows = row_count;

  if deleted_rows = 0 then
    return false;
  end if;

  delete from public.player_connections as preference
  where (
    preference.user_id = auth.uid()
    and preference.connected_user_id = target_user_id
  )
  or (
    preference.user_id = target_user_id
    and preference.connected_user_id = auth.uid()
  );

  return true;
end;
$$;

revoke all on function public.remove_player_connection(uuid) from public, anon;
grant execute on function public.remove_player_connection(uuid) to authenticated;

notify pgrst, 'reload schema';
