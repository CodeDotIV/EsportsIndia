# EsportsIndia

A React Native and Expo esports app for browsing games, tournaments, winners, and local profile settings.

## Run locally

Configure Supabase Google OAuth before starting the app:

1. Enable the Google provider in your Supabase project's Authentication settings.
2. Add the provider's Supabase callback URL to the Google OAuth client's authorized redirect URIs.
3. Add `myapp://auth/callback` to the Supabase project's allowed redirect URLs for native builds. For web, also allow the app's origin.
4. Create a root `.env` file with your Supabase project URL and publishable key:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   ```

The Google button supports both account creation and sign-in. Supabase persists the session; the profile screen's **Sign out** action ends the session.

Then run:

```bash
npm install
npx expo start
```

## Features

- Game and tournament information
- Tournament registration screens
- Winners and live sections
- Local profile storage
