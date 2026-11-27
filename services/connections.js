
import { requireSupabase } from './supabase';

// Load requests using an existing user ID when supplied.
// This avoids repeated auth.getUser() calls during Connect screen loading.
async function loadCurrentUserRequests(currentUserId = null) {
  const supabase = requireSupabase();
  let userId = currentUserId;
  let user = null;

  if (!userId) {
    const {
      data: { user: authUser },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!authUser) throw new Error('Please log in first');

    user = authUser;
    userId = authUser.id;
  }

  if (!userId) throw new Error('Please log in first');

  const { data, error } = await supabase
    .from('connection_requests')
    .select('*')
    .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return {
    user: user || { id: userId },
    requests: data || [],
  };
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
    throw new Error(
      'The pending request could not be found or withdrawn.'
    );
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

// Optional userId avoids another auth.getUser() call.
export async function getConnectionRequests(userId = null) {
  const { requests } = await loadCurrentUserRequests(userId);
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
      status =
        request.requester_id === user.id
          ? 'pending'
          : 'incoming';
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
        .flatMap((request) => [
          request.requester_id,
          request.receiver_id,
        ])
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
  if (!userIds?.length) return [];

  const supabase = requireSupabase();

  const { data, error } = await supabase
    .from('public_profiles')
    .select('*')
    .in('user_id', userIds);

  if (error) throw error;

  return data || [];
}

export async function removePlayerConnection(targetUserId) {
  if (!targetUserId) throw new Error('Player ID is missing.');

  const { data, error } = await requireSupabase().rpc(
    'remove_player_connection',
    { target_user_id: targetUserId }
  );

  if (error) throw error;

  if (!data) {
    throw new Error('Connection could not be removed.');
  }

  return data;
}

export async function blockPlayer(targetUserId) {
  if (!targetUserId) throw new Error('Player ID is missing.');

  const { data, error } = await requireSupabase().rpc(
    'block_player',
    { target_user_id: targetUserId }
  );

  if (error) throw error;
  return data;
}

export async function unblockPlayer(targetUserId) {
  if (!targetUserId) throw new Error('Player ID is missing.');

  const { data, error } = await requireSupabase().rpc(
    'unblock_player',
    { target_user_id: targetUserId }
  );

  if (error) throw error;
  return data;
}

export async function setPlayerFavourite(targetUserId, favourite) {
  if (!targetUserId) throw new Error('Player ID is missing.');

  const { data, error } = await requireSupabase().rpc(
    'set_player_favourite',
    {
      target_user_id: targetUserId,
      favourite,
    }
  );

  if (error) throw error;
  return data;
}

export async function setPlayerNotificationsMuted(targetUserId, muted) {
  if (!targetUserId) throw new Error('Player ID is missing.');

  const { data, error } = await requireSupabase().rpc(
    'set_player_notifications_muted',
    {
      target_user_id: targetUserId,
      muted,
    }
  );

  if (error) throw error;
  return data;
}

export async function reportPlayer(
  targetUserId,
  reason,
  details = null
) {
  if (!targetUserId) throw new Error('Player ID is missing.');
  if (!reason?.trim()) {
    throw new Error('Please select a report reason.');
  }

  const { data, error } = await requireSupabase().rpc(
    'report_player',
    {
      target_user_id: targetUserId,
      report_reason: reason.trim(),
      report_details: details?.trim() || null,
    }
  );

  if (error) throw error;
  return data;
}

// Optional currentUserId avoids another auth.getUser() call.
export async function getPlayerConnectionPreferences(
  userIds,
  currentUserId = null
) {
  if (!userIds?.length) return [];

  const supabase = requireSupabase();
  let userId = currentUserId;

  if (!userId) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error('Please log in first');

    userId = user.id;
  }

  const { data, error } = await supabase
    .from('player_connections')
    .select('connected_user_id, is_favourite, notifications_muted')
    .eq('user_id', userId)
    .in('connected_user_id', userIds);

  if (error) throw error;

  return data || [];
}
