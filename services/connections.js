
import { requireSupabase } from './supabase';

async function loadCurrentUserRequests() {
  const supabase = requireSupabase();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error('Please log in first');

  const { data, error } = await supabase
    .from('connection_requests')
    .select('*')
    .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return { user, requests: data || [] };
}

export async function sendConnectionRequest(targetUserId) {
  const supabase = requireSupabase();

  const { data, error } = await supabase.rpc(
    'send_connection_request',
    { target_user_id: targetUserId }
  );

  if (error) throw error;
  return data;
}

export async function withdrawConnectionRequest(targetUserId) {
  if (!targetUserId) throw new Error('Player ID is missing.');

  const supabase = requireSupabase();
  const { data, error } = await supabase.rpc(
    'withdraw_connection_request',
    { target_user_id: targetUserId }
  );

  if (error) throw error;
  if (data === false) {
    throw new Error('The pending request could not be found or withdrawn.');
  }

  return data;
}

export async function respondToConnectionRequest(requestId, accept) {
  const supabase = requireSupabase();

  const { data, error } = await supabase.rpc(
    'respond_connection_request',
    {
      request_id: requestId,
      accept_request: accept,
    }
  );

  if (error) throw error;
  return data;
}

export async function getConnectionRequests() {
  const { requests } = await loadCurrentUserRequests();
  return requests;
}

function buildConnectionStatuses(user, requests) {
  const statuses = {};

  requests.forEach((request) => {
    const otherUserId =
      request.requester_id === user.id
        ? request.receiver_id
        : request.requester_id;

    if (!otherUserId) return;

    let status;
    if (request.status === 'accepted') {
      status = 'accepted';
    } else if (request.status === 'pending') {
      status = request.requester_id === user.id ? 'pending' : 'incoming';
    } else {
      return;
    }

    if (statuses[otherUserId] !== 'accepted') {
      statuses[otherUserId] = status;
    }
  });

  return statuses;
}

export async function getConnectionOverview() {
  const { user, requests } = await loadCurrentUserRequests();
  const otherUserIds = [
    ...new Set(
      requests
        .flatMap((request) => [request.requester_id, request.receiver_id])
        .filter((userId) => userId && userId !== user.id)
    ),
  ];
  const profiles = await getConnectionProfiles(otherUserIds);

  return {
    currentUserId: user.id,
    requests,
    profiles,
    statuses: buildConnectionStatuses(user, requests),
  };
}

export async function getConnectionProfiles(userIds) {
  if (!userIds || userIds.length === 0) return [];

  const supabase = requireSupabase();

  const { data, error } = await supabase
    .from('public_profiles')
    .select('*')
    .in('user_id', userIds);

  if (error) throw error;

  return data || [];
}
