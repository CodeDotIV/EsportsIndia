jest.mock('../supabase', () => ({ requireSupabase: jest.fn() }));

import { requireSupabase } from '../supabase';
import {
  getTeamFilterOptions,
  limitBioWords,
  listRegisteredPlayers,
  mergeProfileWithAuthUser,
  searchTeams,
  syncProfileToCloud,
} from '../userProfile';

test('profile merging returns only selected fields and migrates legacy names', () => {
  const profile = mergeProfileWithAuthUser(
    {
      name: 'Local Name',
      gamingUsername: 'Local Gamer',
      favoriteGame: 'Valorant',
      preferredGameMode: 'Duo',
      lookingForTournamentPartners: true,
    },
    {
      id: 'auth-user-id',
      email: 'player@example.com',
      created_at: '2024-01-01T00:00:00Z',
      user_metadata: {
        name: 'Cloud Name',
      },
    },
    { name: 'Table Name', game: 'BGMI', teamType: 'Squad', lookingFor: 'A team' }
  );

  expect(profile).toMatchObject({
    id: 'auth-user-id',
    email: 'player@example.com',
    authCreatedAt: '2024-01-01T00:00:00Z',
    name: 'Table Name',
    game: 'BGMI',
    teamType: 'Squad',
    lookingFor: 'A team',
    tournamentPartners: true,
  });
  expect(profile).not.toHaveProperty('gamingUsername');
  expect(profile).not.toHaveProperty('country');
});

test('limitBioWords preserves 20 words and truncates anything beyond the limit', () => {
  const twentyWords = Array.from({ length: 20 }, (_, index) => `word${index + 1}`).join(' ');

  expect(limitBioWords(twentyWords)).toBe(twentyWords);
  expect(limitBioWords(`${twentyWords} extra`)).toBe(twentyWords);
});

test('sync writes profile data to the signed-in user row in Supabase', async () => {
  const single = jest.fn().mockResolvedValue({
    data: { id: 'auth-user-id' },
    error: null,
  });
  const select = jest.fn(() => ({ single }));
  const upsert = jest.fn(() => ({ select }));
  const teamUpsert = jest.fn().mockResolvedValue({ error: null });
  const from = jest.fn((table) => (
    table === 'profiles' ? { upsert } : { upsert: teamUpsert }
  ));
  requireSupabase.mockReturnValue({
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: 'auth-user-id', user_metadata: {} } },
        error: null,
      }),
    },
    from,
  });

  await syncProfileToCloud({
    name: 'Saved Name',
    phone: '9876543210',
    gender: 'Other',
    dateOfBirth: '24-11-2000',
    game: 'BGMI',
    bio: 'Looking for teammates',
    teamName: 'Alpha',
    state: 'Maharashtra',
    zone: 'Zone 2',
    teamType: 'Squad',
    lookingFor: 'A tournament team',
    tournamentPartners: true,
    gamingUsername: 'must not be saved',
  });

  expect(from).toHaveBeenCalledWith('profiles');
  expect(upsert).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 'auth-user-id',
      profile: {
        name: 'Saved Name',
        phone: '9876543210',
        gender: 'Other',
        dateOfBirth: '24-11-2000',
        game: 'BGMI',
        bio: 'Looking for teammates',
        teamName: 'Alpha',
        state: 'Maharashtra',
        zone: 'Zone 2',
        teamType: 'Squad',
        lookingFor: 'A tournament team',
        tournamentPartners: true,
      },
    }),
    { onConflict: 'id' }
  );
  expect(from).toHaveBeenCalledWith('team_directory');
  expect(teamUpsert).toHaveBeenCalledWith(
    expect.objectContaining({
      owner_id: 'auth-user-id',
      team_name: 'Alpha',
      game: 'BGMI',
      team_type: 'Squad',
      state: 'Maharashtra',
      zone: 'Zone 2',
    }),
    { onConflict: 'owner_id' }
  );
});

test('searchTeams returns matching names from the Supabase search function', async () => {
  const rpc = jest.fn().mockResolvedValue({
    data: [{ team_name: 'Alpha Squad' }, { team_name: 'Bravo' }],
    error: null,
  });
  requireSupabase.mockReturnValue({ rpc });

  await expect(searchTeams(' Alpha ')).resolves.toEqual(['Alpha Squad', 'Bravo']);
  expect(rpc).toHaveBeenCalledWith('search_teams', { search_query: 'Alpha' });
});

test('searchTeams applies saved game, team type, state, and zone filters', async () => {
  const rpc = jest.fn().mockResolvedValue({
    data: [{ team_name: 'Alpha Squad' }],
    error: null,
  });
  requireSupabase.mockReturnValue({ rpc });

  await expect(searchTeams('', {
    game: 'BGMI',
    teamType: 'Squad',
    state: 'Maharashtra',
    zone: 'Zone 2',
  })).resolves.toEqual(['Alpha Squad']);
  expect(rpc).toHaveBeenCalledWith('filter_teams_by_profile', {
    search_query: null,
    game_filter: 'BGMI',
    team_type_filter: 'Squad',
    state_filter: 'Maharashtra',
    zone_filter: 'Zone 2',
  });
});

test('getTeamFilterOptions returns distinct game and state options', async () => {
  const rpc = jest.fn().mockResolvedValue({
    data: [{
      games: ['BGMI'],
      states: ['Maharashtra'],
      team_types: ['Squad'],
      zones: ['Zone 2'],
    }],
    error: null,
  });
  requireSupabase.mockReturnValue({ rpc });

  await expect(getTeamFilterOptions()).resolves.toEqual({
    games: ['BGMI'],
    states: ['Maharashtra'],
    teamTypes: ['Squad'],
    zones: ['Zone 2'],
  });
  expect(rpc).toHaveBeenCalledWith('get_team_profile_filter_options');
});

test('listRegisteredPlayers returns public profile fields and supports an empty query', async () => {
  const rpc = jest.fn().mockResolvedValue({
    data: [
      {
        display_name: 'Alpha Player',
        game: 'BGMI',
        bio: 'Looking for teammates',
        team_name: 'Alpha',
        state: 'Maharashtra',
        zone: 'Zone 2',
        team_type: 'Squad',
        looking_for: 'A tournament team',
        tournament_partners: true,
      },
    ],
    error: null,
  });
  requireSupabase.mockReturnValue({ rpc });

  await expect(listRegisteredPlayers()).resolves.toEqual([
    expect.objectContaining({
      display_name: 'Alpha Player',
      team_name: 'Alpha',
      looking_for: 'A tournament team',
      tournament_partners: true,
    }),
  ]);
  expect(rpc).toHaveBeenCalledWith('list_registered_players', {
    search_query: null,
    game_filter: null,
    team_type_filter: null,
    state_filter: null,
    zone_filter: null,
  });
});

test('listRegisteredPlayers applies the Explore public-profile filters', async () => {
  const rpc = jest.fn().mockResolvedValue({ data: [], error: null });
  requireSupabase.mockReturnValue({ rpc });

  await expect(listRegisteredPlayers('  Player ', {
    game: 'BGMI',
    teamType: 'Squad',
    state: 'Maharashtra',
    zone: 'Zone 2',
  })).resolves.toEqual([]);

  expect(rpc).toHaveBeenCalledWith('list_registered_players', {
    search_query: 'Player',
    game_filter: 'BGMI',
    team_type_filter: 'Squad',
    state_filter: 'Maharashtra',
    zone_filter: 'Zone 2',
  });
});

test('sync removes a user from the searchable directory when their team name is cleared', async () => {
  const single = jest.fn().mockResolvedValue({
    data: { id: 'auth-user-id' },
    error: null,
  });
  const select = jest.fn(() => ({ single }));
  const upsert = jest.fn(() => ({ select }));
  const deleteEq = jest.fn().mockResolvedValue({ error: null });
  const from = jest.fn((table) => (
    table === 'profiles'
      ? { upsert }
      : { delete: () => ({ eq: deleteEq }) }
  ));
  requireSupabase.mockReturnValue({
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: 'auth-user-id', user_metadata: {} } },
        error: null,
      }),
    },
    from,
  });

  await syncProfileToCloud({ name: 'Saved Name', teamName: '' });

  expect(deleteEq).toHaveBeenCalledWith('owner_id', 'auth-user-id');
});
