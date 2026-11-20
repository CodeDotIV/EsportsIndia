import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';
import { requireSupabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

export const signInWithGoogle = async () => {
  if (
    Platform.OS !== 'web' &&
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient
  ) {
    throw new Error(
      'Google sign-in cannot return to Expo Go. Open the app in an Android development build instead (npx expo run:android).'
    );
  }

  const client = requireSupabase();
  const redirectTo =
    Platform.OS === 'web'
      ? window.location.origin
      : Linking.createURL('auth/callback', { scheme: 'myapp' });

  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
      queryParams: { prompt: 'select_account' },
    },
  });

  if (error) throw error;
  if (!data?.url) throw new Error('Supabase did not return a Google sign-in URL.');

  if (Platform.OS === 'web') {
    window.location.assign(data.url);
    return { redirecting: true };
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type === 'cancel' || result.type === 'dismiss') {
    return { cancelled: true };
  }
  if (result.type !== 'success' || !result.url) {
    throw new Error('Google sign-in did not complete successfully.');
  }

  const callback = new URL(result.url);
  const authError =
    callback.searchParams.get('error_description') ||
    callback.searchParams.get('error') ||
    new URLSearchParams(callback.hash.slice(1)).get('error_description');
  if (authError) throw new Error(authError);

  const code = callback.searchParams.get('code');
  if (!code) throw new Error('Supabase did not return an authentication code.');

  const { data: sessionData, error: sessionError } =
    await client.auth.exchangeCodeForSession(code);
  if (sessionError) throw sessionError;
  if (!sessionData.session) throw new Error('Supabase did not create an authenticated session.');

  return { session: sessionData.session };
};

export const signOut = async () => {
  const client = requireSupabase();
  const { error } = await client.auth.signOut();
  if (error) throw error;
};
