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

## Features

- Game and tournament information
- Tournament registration screens
- Winners and live sections
- Local profile storage
