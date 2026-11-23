# EsportsIndia

A React Native and Expo esports app for browsing games, tournaments, winners, and local profile settings.

## Run locally

Configure Supabase Google OAuth before starting the app:

1. Enable the Google provider in your Supabase project's Authentication settings.
2. Add the provider's Supabase callback URL to the Google OAuth client's authorized redirect URIs.
3. Set the Supabase Site URL to your deployed website URL, not `http://localhost:3000`, and add `myapp://auth/callback` to the allowed redirect URLs. For web development, also allow the local web origin.
4. Create a root `.env` file with your Supabase project URL and publishable key:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   ```

5. Apply [`supabase/migrations/20261123205000_create_profiles.sql`](./supabase/migrations/20261123205000_create_profiles.sql) in your Supabase project's SQL Editor. Profile data is stored in the `public.profiles` table, with row-level security restricting access to the signed-in user.
6. Apply [`supabase/migrations/20261123214500_create_team_directory.sql`](./supabase/migrations/20261123214500_create_team_directory.sql) to enable Explore team search. Team names are searchable by signed-in users; other profile fields remain private.
7. Apply [`supabase/migrations/20261123221000_list_registered_players.sql`](./supabase/migrations/20261123221000_list_registered_players.sql) to show other registered players by display name in Connect's For you tab. Email addresses and other profile fields are not exposed.

The Google button supports both account creation and sign-in. Supabase persists the session; the profile screen's **Sign out** action ends the session.

Google OAuth cannot return to an app running in Expo Go because Expo Go cannot register the app's custom URL scheme. Install dependencies and launch an Android development build instead (Android SDK required):

```bash
npm install
npx expo run:android
```

For later development sessions, start the bundler with:

```bash
npx expo start --dev-client
```

## Production Android and iOS builds

The `preview` and `production` EAS build profiles use the Expo project's **production** environment, so preview builds connect to production Supabase and use production data. Add `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to that environment. Keep the Supabase Site URL set to your deployed HTTPS website and allow `myapp://auth/callback` in the redirect URLs.

Install and sign in to EAS CLI, then create both store-ready builds:

```bash
npm install --global eas-cli
eas login
eas build --platform all --profile production
```

EAS produces an Android App Bundle (AAB) and an iOS App Store build. Apple Developer Program and Google Play Console accounts are required to submit them to their stores. Building does not publish the apps; submit the resulting builds for store review after verifying the signing credentials and store listings.

## Features

- Game and tournament information
- Tournament registration screens
- Winners and live sections
- Local profile storage
