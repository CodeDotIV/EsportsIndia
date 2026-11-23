import { requireSupabase } from './supabase';

const PROFILE_METADATA_FIELDS = [
  'name',
  'playerId',
  'phone',
  'gender',
  'location',
  'bio',
  'dateOfBirth',
  'avatar',
  'gamingUsername',
  'favoriteGame',
  'gamingPlatform',
  'skillLevel',
  'teamName',
  'yearsOfGaming',
  'preferredGameMode',
  'country',
  'timezone',
  'language',
  'instagram',
  'twitter',
  'discord',
  'youtube',
  'twitch',
  'profileCompleted',
];

export const mergeProfileWithAuthUser = (profile, authUser, cloudProfile = null) => {
  const mergedProfile = { ...profile };
  const metadata = authUser?.user_metadata || {};

  PROFILE_METADATA_FIELDS.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(metadata, field)) {
      mergedProfile[field] = metadata[field];
    }
    if (cloudProfile && Object.prototype.hasOwnProperty.call(cloudProfile, field)) {
      mergedProfile[field] = cloudProfile[field];
    }
  });

  if (authUser) {
    mergedProfile.id = authUser.id;
    mergedProfile.authCreatedAt = authUser.created_at || mergedProfile.authCreatedAt || '';
    mergedProfile.email = authUser.email || mergedProfile.email || '';
  }

  return mergedProfile;
};

export const loadProfileFromCloud = async (authUser) => {
  const client = requireSupabase();
  const { data, error } = await client
    .from('profiles')
    .select('profile')
    .eq('id', authUser.id)
    .maybeSingle();
  if (error) throw error;

  return data?.profile || null;
};

export const searchTeams = async (query) => {
  const searchQuery = String(query || '').trim();
  if (!searchQuery) return [];

  const client = requireSupabase();
  const { data, error } = await client.rpc('search_teams', {
    search_query: searchQuery,
  });
  if (error) throw error;

  return (data || []).map((team) => team.team_name);
};

export const listRegisteredPlayers = async (query = '') => {
  const searchQuery = String(query || '').trim();
  const client = requireSupabase();
  const { data, error } = await client.rpc('list_registered_players', {
    search_query: searchQuery || null,
  });
  if (error) throw error;

  return (data || []).map((player) => player.display_name);
};

export const syncProfileToCloud = async (profile) => {
  const client = requireSupabase();
  const { data, error } = await client.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('No signed-in user is available for profile sync.');

  const profileMetadata = Object.fromEntries(
    PROFILE_METADATA_FIELDS.map((field) => [field, profile[field]])
  );
  const { error: profileError } = await client.from('profiles').upsert(
    {
      id: data.user.id,
      profile: profileMetadata,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );
  if (profileError) throw profileError;

  const teamName = String(profile.teamName || '').trim();
  if (teamName) {
    const { error: teamError } = await client.from('team_directory').upsert(
      {
        owner_id: data.user.id,
        team_name: teamName,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'owner_id' }
    );
    if (teamError) throw teamError;
  } else {
    const { error: teamError } = await client
      .from('team_directory')
      .delete()
      .eq('owner_id', data.user.id);
    if (teamError) throw teamError;
  }

  const { error: updateError } = await client.auth.updateUser({
    data: {
      ...(data.user.user_metadata || {}),
      ...profileMetadata,
    },
  });
  if (updateError) throw updateError;
};
