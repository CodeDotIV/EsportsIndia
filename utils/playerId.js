import { getItem, setItem } from './storageHelper';

const padTwoDigits = (value) => String(value).padStart(2, '0');
const getTimestampPrefix = (value) =>
  typeof value === 'string' && /^\d{12}/.test(value) ? value.slice(0, 12) : '';

export const createPlayerId = (authUserId, createdAt) => {
  if (!authUserId) {
    throw new Error('Cannot create a player ID without an authenticated user ID.');
  }

  const date = createdAt ? new Date(createdAt) : new Date();
  if (Number.isNaN(date.getTime())) {
    throw new Error('Cannot create a player ID from an invalid account creation date.');
  }

  const timestamp = [
    padTwoDigits(date.getUTCMinutes()),
    padTwoDigits(date.getUTCHours()),
    padTwoDigits(date.getUTCDate()),
    padTwoDigits(date.getUTCMonth() + 1),
    date.getUTCFullYear(),
  ].join('');

  return timestamp;
};

export const getOrCreatePlayerId = async (authUserId, existingPlayerId, createdAt) => {
  if (!authUserId) {
    throw new Error('Cannot load a player ID without an authenticated user ID.');
  }

  const storageKey = `player-id:${authUserId}`;
  const storedPlayerId = await getItem(storageKey);
  const playerId =
    getTimestampPrefix(storedPlayerId) ||
    getTimestampPrefix(existingPlayerId) ||
    createPlayerId(authUserId, createdAt);

  if (storedPlayerId !== playerId) {
    await setItem(storageKey, playerId);
  }
  return playerId;
};
