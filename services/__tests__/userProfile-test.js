jest.mock('../supabase', () => ({ requireSupabase: jest.fn() }));

import { requireSupabase } from '../supabase';
import {
  listRegisteredPlayers,
  mergeProfileWithAuthUser,
  searchTeams,
  syncProfileToCloud,
} from '../userProfile';

test('cloud profile overrides local fields while preserving fields absent from cloud metadata', () => {
  const profile = mergeProfileWithAuthUser(
    { name: 'Local Name', gamingUsername: 'Local Gamer', country: 'India' },
    {
      id: 'auth-user-id',
      email: 'player@example.com',
      created_at: '2024-01-01T00:00:00Z',
      user_metadata: {
        name: 'Cloud Name',
        gamingUsername: 'Cloud Gamer',
        profileCompleted: true,
      },
    },
    { name: 'Table Name' }
  );

  expect(profile).toMatchObject({
    id: 'auth-user-id',
    email: 'player@example.com',
    authCreatedAt: '2024-01-01T00:00:00Z',
    name: 'Table Name',
    gamingUsername: 'Cloud Gamer',
    country: 'India',
    profileCompleted: true,
  });
});

test('sync writes profile data to the signed-in user row in Supabase', async () => {
  const upsert = jest.fn().mockResolvedValue({ error: null });
  const teamUpsert = jest.fn().mockResolvedValue({ error: null });
  const updateUser = jest.fn().mockResolvedValue({ error: null });
  const from = jest.fn((table) => ({
    upsert: table === 'profiles' ? upsert : teamUpsert,
  }));
  requireSupabase.mockReturnValue({
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: 'auth-user-id', user_metadata: {} } },
        error: null,
      }),
      updateUser,
    },
    from,
  });

  await syncProfileToCloud({ name: 'Saved Name', country: 'India', teamName: 'Alpha' });

  expect(from).toHaveBeenCalledWith('profiles');
  expect(upsert).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 'auth-user-id',
      profile: expect.objectContaining({ name: 'Saved Name', country: 'India' }),
    }),
    { onConflict: 'id' }
  );
  expect(from).toHaveBeenCalledWith('team_directory');
  expect(teamUpsert).toHaveBeenCalledWith(
    expect.objectContaining({ owner_id: 'auth-user-id', team_name: 'Alpha' }),
    { onConflict: 'owner_id' }
  );
  expect(updateUser).toHaveBeenCalled();
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

test('listRegisteredPlayers returns only display names and supports an empty query', async () => {
  const rpc = jest.fn().mockResolvedValue({
    data: [{ display_name: 'Alpha Player' }, { display_name: 'Bravo Player' }],
    error: null,
  });
  requireSupabase.mockReturnValue({ rpc });

  await expect(listRegisteredPlayers()).resolves.toEqual(['Alpha Player', 'Bravo Player']);
  expect(rpc).toHaveBeenCalledWith('list_registered_players', { search_query: null });
});

test('sync removes a user from the searchable directory when their team name is cleared', async () => {
  const upsert = jest.fn().mockResolvedValue({ error: null });
  const deleteEq = jest.fn().mockResolvedValue({ error: null });
  const updateUser = jest.fn().mockResolvedValue({ error: null });
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
      updateUser,
    },
    from,
  });

  await syncProfileToCloud({ teamName: '' });

  expect(deleteEq).toHaveBeenCalledWith('owner_id', 'auth-user-id');
});
