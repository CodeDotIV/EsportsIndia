# Install WebView for Inline Video Playback

To enable inline video playback in the Live screen, you need to install `react-native-webview`.

## Installation Steps:

1. **Install the package:**
   ```bash
   npm install react-native-webview
   ```

2. **For iOS (macOS only):**
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Rebuild the app:**
   - **iOS**: `npx expo run:ios`
   - **Android**: `npx expo run:android`

## After Installation:

Once `react-native-webview` is installed, the "Play" button will:
- Show an inline video player box above the stream card
- Play YouTube videos directly in that box
- Allow users to watch without leaving the app

## Current Behavior (without WebView):

- "Play" button shows a thumbnail with a play button
- Tapping opens the video in a full-screen in-app browser
- "Open" button redirects to YouTube app/browser
