
import { requireSupabase } from './supabase';

export const PROFILE_FIELDS = [
  'name',
  'phone',
  'gender',
  'dateOfBirth',
  'game',
  'bio',
  'teamName',
  'state',
  'zone',
  'teamType',
  'lookingFor',
  'tournamentPartners',
];

const getFirstProfileValue = (sources, ...keys) => {
  for (const source of sources) {
    for (const key of keys) {
      if (
        source &&
        Object.prototype.hasOwnProperty.call(source, key) &&
        source[key] !== null &&
        source[key] !== undefined
      ) {
        return source[key];
      }
    }
  }

  return undefined;
};

export const limitBioWords = (value, maxWords = 20) => {
  const text = String(value || '');
  const words = text.trim().split(/\s+/).filter(Boolean);

  return words.length > maxWords
    ? words.slice(0, maxWords).join(' ')
    : text;
};

export const mergeProfileWithAuthUser = (
  profile,
  authUser,
  cloudProfile = null
) => {
  const localProfile = profile || {};
  const metadata = authUser?.user_metadata || {};
  const cloud = cloudProfile || {};

  const sources = [cloud, metadata, localProfile];

  const tournamentPartners = getFirstProfileValue(
    sources,
    'tournamentPartners',
    'lookingForTournamentPartners'
  );

  const mergedProfile = {
    name:
      getFirstProfileValue(
        sources,
        'name',
        'full_name',
        'display_name'
      ) || '',

    phone: getFirstProfileValue(sources, 'phone') || '',
    gender: getFirstProfileValue(sources, 'gender') || '',
    dateOfBirth:
      getFirstProfileValue(sources, 'dateOfBirth') || '',

    game:
      getFirstProfileValue(
        sources,
        'game',
        'favoriteGame',
        'primary_game'
      ) || '',

    bio: getFirstProfileValue(sources, 'bio') || '',
    teamName: getFirstProfileValue(sources, 'teamName') || '',

    state:
      getFirstProfileValue(
        sources,
        'state',
        'location'
      ) || '',

    zone: getFirstProfileValue(sources, 'zone') || '',

    teamType:
      getFirstProfileValue(
        sources,
        'teamType',
        'preferredGameMode',
        'team_type'
      ) || '',

    lookingFor:
      getFirstProfileValue(sources, 'lookingFor') || '',

    tournamentPartners:
      tournamentPartners === true ||
      tournamentPartners === 'true',

    profileCompleted:
      localProfile.profileCompleted === true ||
      cloud.profileCompleted === true ||
      Boolean(cloud.name || cloud.full_name),
  };

  if (authUser) {
    mergedProfile.id = authUser.id;
    mergedProfile.authCreatedAt =
      authUser.created_at || localProfile.authCreatedAt || '';
    mergedProfile.email =
      authUser.email || localProfile.email || '';
    mergedProfile.playerId =
      metadata.playerId || localProfile.playerId || '';
  } else {
    mergedProfile.id = localProfile.id || '';
    mergedProfile.authCreatedAt =
      localProfile.authCreatedAt || '';
    mergedProfile.email = localProfile.email || '';
    mergedProfile.playerId = localProfile.playerId || '';
  }

  return mergedProfile;
};

// Load the signed-in user's private profile.
export const loadProfileFromCloud = async (authUser) => {
  if (!authUser?.id) {
    throw new Error(
      'A valid signed-in user is required to load a profile.'
    );
  }

  const client = requireSupabase();

  const { data, error } = await client
    .from('profiles')
    .select('profile')
    .eq('id', authUser.id)
    .maybeSingle();

  if (error) throw error;

  return data?.profile || null;
};

// Search teams using the existing database search function.
export const searchTeams = async (query, filters = {}) => {
  const client = requireSupabase();

  const searchQuery = String(query || '').trim();

  const { data, error } = await client.rpc(
    'filter_teams_by_profile',
    {
      search_query: searchQuery || null,
      game_filter: String(filters.game || '').trim() || null,
      team_type_filter:
        String(filters.teamType || '').trim() || null,
      state_filter:
        String(filters.state || '').trim() || null,
      zone_filter:
        String(filters.zone || '').trim() || null,
    }
  );

  if (error) throw error;

  return data || [];
};

// Get available filter values from team_directory.
export const getTeamFilterOptions = async () => {
  const client = requireSupabase();

  const { data, error } = await client
    .from('team_directory')
    .select('game, state, team_type, zone');

  if (error) throw error;

  const rows = data || [];

  const uniqueValues = (field) =>
    [...new Set(
      rows
        .map((row) => row[field])
        .filter(Boolean)
        .map((value) => String(value).trim())
    )].sort((a, b) => a.localeCompare(b));

  return {
    games: uniqueValues('game'),
    states: uniqueValues('state'),
    teamTypes: uniqueValues('team_type'),
    zones: uniqueValues('zone'),
  };
};

// Find registered players using public profile information.
export const listRegisteredPlayers = async (
  query = '',
  filters = {}
) => {
  const client = requireSupabase();

  const { data, error } = await client.rpc(
    'list_registered_players',
    {
      search_query: String(query || '').trim() || null,
      game_filter: String(filters.game || '').trim() || null,
      team_type_filter:
        String(filters.teamType || '').trim() || null,
      state_filter:
        String(filters.state || '').trim() || null,
      zone_filter:
        String(filters.zone || '').trim() || null,
    }
  );

  if (error) throw error;

  return data || [];
};

// Save the signed-in user's private profile to Supabase.
export const syncProfileToCloud = async (profile = {}) => {
  const client = requireSupabase();

  const { data: authData, error: authError } =
    await client.auth.getUser();

  if (authError) throw authError;

  const authUser = authData?.user;

  if (!authUser?.id) {
    throw new Error(
      'No signed-in user is available for profile sync.'
    );
  }

  const profileData = Object.fromEntries(
    PROFILE_FIELDS.map((field) => {
      const value = profile?.[field];

      if (field === 'tournamentPartners') {
        return [
          field,
          value === true || value === 'true',
        ];
      }

      return [
        field,
        value === null || value === undefined
          ? ''
          : String(value).trim(),
      ];
    })
  );

  if (!profileData.name) {
    throw new Error('Please enter your full name.');
  }

  profileData.bio = limitBioWords(
    profileData.bio,
    20
  ).trim();

  const now = new Date().toISOString();

  const { data: savedProfile, error: profileError } =
    await client
      .from('profiles')
      .upsert(
        {
          id: authUser.id,
          full_name: profileData.name,
          profile: profileData,
          updated_at: now,
        },
        {
          onConflict: 'id',
        }
      )
      .select('id')
      .single();

  if (profileError) {
    console.error(
      'Supabase profile save failed:',
      profileError
    );

    throw profileError;
  }

  if (!savedProfile?.id) {
    throw new Error(
      'Profile save could not be verified.'
    );
  }

  // Existing Supabase triggers synchronize public_profiles
  // and team_directory. Do not write to those tables again here.

  return {
    success: true,
    userId: savedProfile.id,
    profile: profileData,
  };
};
