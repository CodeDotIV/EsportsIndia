# API Configuration Guide

## Quick Setup - Works Anywhere

### Option 1: Use a Deployed Backend (Recommended)

Deploy your backend to a cloud service (Heroku, Railway, Render, etc.) and set:

```bash
# In your .env file (create it in the root directory)
EXPO_PUBLIC_API_URL=https://your-backend.herokuapp.com/api
```

**Benefits:**
- ✅ Works on any device, anywhere
- ✅ No IP configuration needed
- ✅ Works in production
- ✅ No network restrictions

### Option 2: Local Development

For local development with physical devices:

1. **Find your computer's IP address:**
   - macOS/Linux: `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - Windows: `ipconfig` (look for IPv4 Address)
   - Or check Expo dev server terminal - it shows your IP

2. **Create a `.env` file in the root directory:**
   ```bash
   EXPO_PUBLIC_API_IP=192.168.1.100  # Replace with your actual IP
   ```

3. **Make sure:**
   - Your backend server is running on port 5000
   - Your phone and computer are on the same Wi-Fi network
   - Firewall allows connections on port 5000

### Option 3: Auto-Detection (Fallback)

If neither variable is set, the app will:
- Use `localhost` for web
- Use `10.0.2.2` for Android emulator
- Use `localhost` for iOS simulator
- Show a warning for physical devices

## Environment Variables

Create a `.env` file in the root directory:

```env
# For deployed backend (recommended)
EXPO_PUBLIC_API_URL=https://your-backend.herokuapp.com/api

# OR for local development
EXPO_PUBLIC_API_IP=192.168.1.100
```

**Note:** After changing `.env`, restart your Expo dev server.

## Troubleshooting

**Can't connect on physical device?**
1. Check that backend server is running
2. Verify IP address is correct
3. Ensure device and computer are on same network
4. Check firewall settings
5. Try using a deployed backend URL instead

**Still having issues?**
- Use Option 1 (deployed backend) - it's the most reliable solution
