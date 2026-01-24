# EsportsIndia 🎮

A comprehensive mobile esports platform built with React Native and Expo, designed for gaming enthusiasts to participate in tournaments, track winners, and manage their esports journey.

## 📱 Overview

EsportsIndia is a comprehensive esports platform available on mobile and web, designed to connect gamers and facilitate esports tournaments for popular games like BGMI (Battlegrounds Mobile India), Free Fire, Call of Duty, and Valorant. The platform provides a seamless experience for tournament registration, game information, and user profile management across all devices.

## ✨ Features

### 🏠 Home Screen
- Personalized greeting based on time of day
- Gender-based profile icons
- Game showcase with interactive banners
- Featured games: BGMI, Free Fire, Call of Duty, Valorant
- View Details navigation to game information screens
- Quick Actions section
- Social media links
- Smooth animations and transitions

### 🎯 Esports
- Browse available esports games
- Detailed game information and features
- Multiple gaming modes (Solo, Duo, Squad)
- Game-specific tournament options
- Game details screens with rules and guidelines (BGMI, Free Fire, Call of Duty, Valorant)

### 🏆 Tournaments
- Tournament registration system
- Multiple game categories (BGMI, Free Fire, Call of Duty)
- Map-specific tournaments (Erangel, Livik, Nusa, Shanok)
- Mode-specific registrations (Solo, Duo, Squad)

### 🥇 Winners
- Track tournament winners
- Leaderboards and achievements
- Winner announcements

### 👤 Profile
- User profile management
- Edit personal information
- View account details
- Logout functionality

### 🌐 Web Landing Page
- **Production-ready responsive design** - Fully responsive across desktop, tablet, and mobile devices
- **Hero Section** - Eye-catching hero with gaming arena background, animated navbar, and call-to-action
- **Tournament Features** - Showcase of tournament types (Tournament Excellence, Quick Match, Multi-Mode, Strategic Team Play, Ranked Leagues, Championship Series)
- **Notice Board** - Tournament schedule information (Friday-Sunday tournaments, registration deadlines, prize distribution, team requirements)
- **How It Works** - Interactive timeline showing the tournament participation process
- **Why Choose Us** - Feature cards highlighting platform benefits (Tournaments, Community, Track Progress, Multiple Games)
- **Game Modes & Tournaments** - Detailed information about arena modes, classic tournaments, and game-specific features
- **Stats Section** - Animated counters showing platform statistics (Tournaments, Players, Games, Winners)
- **Smooth Animations** - Scroll-triggered animations, fade effects, and interactive transitions
- **SEO Optimized** - Comprehensive meta tags, Open Graph, and Twitter Card support
- **Smart Navigation** - Auto-hide/show navbar on scroll with highlight and zoom effects on navigation items
- **Modern Design** - Gaming-themed UI with neon gradients, bold typography, and professional styling

### 🔐 Authentication
- Email/Password authentication via custom backend API
- Sign up with OTP email verification
- Password reset via OTP
- Secure token-based session management
- OTP verification for email and password reset
- Forgot password flow with OTP code

## 🛠️ Tech Stack

### Core Technologies
- **React Native** `0.81.5` - Mobile framework
- **Expo** `^54.0.10` - Development platform
- **React** `19.1.0` - UI library
- **React Navigation** `^7.0.14` - Navigation library

### Key Libraries
- **Axios** `^1.10.0` - HTTP client for API calls
- **Expo Video** `~3.0.15` - Video playback
- **Expo Linear Gradient** `~15.0.7` - Gradient effects
- **React Native Vector Icons** `^10.2.0` - Icon library
- **@expo/vector-icons** `^15.0.2` - Icon library
- **AsyncStorage** `2.2.0` - Local data persistence
- **React Native Reanimated** `~4.1.0` - Animations
- **React Navigation** `^7.0.14` - Navigation library

### Development Tools
- **TypeScript** `~5.9.2` - Type safety
- **Jest** `~29.7.0` - Testing framework
- **Babel** `^7.26.0` - JavaScript compiler

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g expo-cli`)
- **iOS Simulator** (for macOS users) or **Android Studio** (for Android development)
- **Expo Go** app on your physical device (optional, for testing)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install iOS dependencies** (macOS only)
   ```bash
   cd ios
   pod install
   cd ..
   ```

## ⚙️ Configuration

### Backend API Setup

The app uses a custom backend API deployed at `https://esportsindia-hh3x.onrender.com/api`

**For Production Builds:**
- The app automatically uses the deployed backend URL
- No configuration needed for production builds

**For Local Development:**

1. **Option 1: Use Deployed Backend (Recommended)**
   - No configuration needed - works out of the box
   - Default behavior for production and development

2. **Option 2: Use Local Backend**
   - Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_API_IP=192.168.1.100  # Your local machine IP
   ```
   - Or set explicit API URL:
   ```env
   EXPO_PUBLIC_API_URL=http://your-backend-url:5000/api
   ```

**To find your local IP:**
- **macOS/Linux**: `ifconfig | grep "inet " | grep -v 127.0.0.1`
- **Windows**: `ipconfig` (look for IPv4 Address)

### Environment Variables

Create a `.env` file in the root directory (optional, for local development):

```env
# For deployed backend (default - no config needed)
# EXPO_PUBLIC_API_URL=https://esportsindia-hh3x.onrender.com/api

# OR for local development
EXPO_PUBLIC_API_IP=192.168.1.100
```

**Note:** After changing `.env`, restart your Expo dev server.

## 🏃 Running the App

### Development Mode

1. **Start the Expo development server**
   ```bash
   npm start
   ```

2. **Run on iOS Simulator** (macOS only)
   ```bash
   npm run ios
   # or press 'i' in the Expo CLI
   ```

3. **Run on Android Emulator**
   ```bash
   npm run android
   # or press 'a' in the Expo CLI
   ```

4. **Run on Web**
   ```bash
   npm run web
   # or press 'w' in the Expo CLI
   ```
   
   **Web Landing Page Features:**
   - Fully responsive design (desktop, tablet, mobile)
   - SEO optimized with meta tags
   - Smooth scroll animations
   - Interactive navigation with highlight effects
   - Production-ready styling

5. **Run on Physical Device**
   - Install Expo Go from App Store (iOS) or Play Store (Android)
   - Scan the QR code displayed in the terminal

### Production Build

**Prerequisites:**
1. Install EAS CLI: `npm install -g eas-cli`
2. Login to Expo: `eas login`
3. Ensure backend is deployed and accessible

**Build Commands:**

1. **Build for iOS**
   ```bash
   eas build --platform ios --profile production
   ```
   - Requires Apple Developer Account ($99/year)
   - First time: Run `eas credentials` to configure Apple certificates

2. **Build for Android (APK - for testing)**
   ```bash
   eas build --platform android --profile production
   ```

3. **Build for Android (AAB - for Play Store)**
   ```bash
   eas build --platform android --profile production --type app-bundle
   ```

4. **Build for Both Platforms**
   ```bash
   eas build --platform all --profile production
   ```

**Build Configuration:**
- EAS configuration is in `eas.json`
- Project ID: `3d595d0e-f1cd-4953-aec1-d6db77214b68`
- Auto-increment version enabled for production builds

**Monitor Builds:**
- Check build status: `eas build:list`
- View build details: `eas build:view [build-id]`

## 📁 Project Structure

```
app/
├── assets/                 # Images, videos, fonts
│   ├── images/            # Game logos and UI images
│   │   ├── bgmi.png       # BGMI logo
│   │   ├── freefire.png   # Free Fire logo
│   │   ├── callofduty.png # Call of Duty logo
│   │   ├── valorant.png  # Valorant logo
│   │   └── applogo.png   # App logo
│   ├── vedios/           # Video assets
│   └── fonts/            # Custom fonts
├── components/            # Reusable components
├── constants/            # App constants
├── login/                # Authentication screens
│   ├── LoginScreen.js    # Login with email/password
│   ├── SignUpScreen.js   # User registration
│   ├── ForgotPasswordScreen.js  # Password reset initiation
│   ├── ResetPasswordScreen.js    # Password reset completion
│   └── VerifyOtpScreen.js        # OTP verification
├── screens/              # App screens
│   ├── bottonscreens/   # Bottom tab screens
│   │   ├── HomeScreen.js
│   │   ├── EsportsScreen.js
│   │   ├── TournamentsScreen.js
│   │   ├── WinnersScreen.js
│   │   ├── LiveScreen.js
│   │   └── ProfileScreen.js
│   ├── aboutbgmi.js      # BGMI game details
│   ├── aboutfreefire.js  # Free Fire game details
│   ├── aboutcallofduty.js # Call of Duty game details
│   ├── aboutvalorant.js  # Valorant game details
│   ├── esports/         # Game-specific screens
│   │   ├── bgmi.js
│   │   ├── freefire.js
│   │   └── callofduty.js
│   ├── esportsarena/    # Arena mode screens
│   └── web/             # Web-specific screens
│       └── WebLandingPage.js  # Production web landing page
├── services/            # API services
│   ├── authService.js   # Authentication API calls
│   └── otpService.js    # OTP API calls
├── utils/               # Utility functions
│   ├── api.js          # API configuration & base URL
│   ├── responsive.js   # Responsive utilities (wp, hp, rf, rs)
│   └── storageHelper.js # AsyncStorage helpers
├── backend/             # Backend server code
│   ├── routes/         # API routes
│   ├── models/         # Database models
│   └── server.js       # Express server
├── App.js              # Main app component & navigation
├── app.json            # Expo configuration
├── eas.json            # EAS Build configuration
├── package.json        # Dependencies
└── app/                # Expo Router app directory
    ├── +html.tsx       # Root HTML template (SEO meta tags)
    └── (tabs)/         # Tab-based navigation
```

## 🔑 Key Features Explained

### Navigation Flow
1. **Entry Screen** → Checks authentication status
2. **Login/SignUp** → User authentication with OTP verification
3. **Main (Bottom Tabs)** → Home, Esports, Tournaments, Winners, Profile
4. **Game Details** → View rules and guidelines for each game

### Authentication Flow
1. **Sign Up** → Enter details → OTP sent to email → Verify OTP → Account created
2. **Login** → Email/Password → If email not verified, option to resend OTP
3. **Forgot Password** → Enter email → OTP sent → Verify OTP → Reset password

### Tournament Registration
- Select game (BGMI, Free Fire, Call of Duty)
- Choose map (Erangel, Livik, Nusa, Shanok)
- Select mode (Solo, Duo, Squad)
- Fill player details (Name, Game ID, Mobile, Email, Aadhaar)
- Submit registration

### Game Details Screens
- **BGMI** → Rules, Guidelines, and Notes
- **Free Fire** → Rules, Guidelines, and Notes
- **Call of Duty** → Rules, Guidelines, and Notes
- **Valorant** → Rules, Guidelines, and Notes
- All screens follow consistent styling with dark theme (#141E30 background)

### Data Persistence
- User data stored in AsyncStorage
- Token-based session management
- Backend API for authentication and data storage

## 🐛 Troubleshooting

### Common Issues

1. **App not opening/rendering**
   - Check console logs for errors
   - Verify backend API is accessible
   - Clear cache: `expo start -c`

2. **API connection errors**
   - Verify backend server is running (https://esportsindia-hh3x.onrender.com)
   - Check API base URL in `services/authService.js` and `services/otpService.js`
   - For local development, set `EXPO_PUBLIC_API_IP` in `.env`
   - Check network connectivity
   - Backend may take 20-60 seconds to wake up (free tier)

3. **Authentication errors**
   - Verify backend API is accessible
   - Check email service configuration in backend
   - Ensure OTP service is working
   - Check network connectivity

4. **OTP not received**
   - Check email service configuration in backend
   - Verify email address is correct
   - Check spam folder
   - Ensure backend email service is properly configured

5. **Navigation issues**
   - Check screen names match exactly in `App.js`
   - Verify navigation stack configuration
   - Clear AsyncStorage if stuck on entry screen: `AsyncStorage.clear()`

6. **Production build issues**
   - Ensure `otpService.js` uses deployed backend URL (already configured)
   - Verify all environment variables are set correctly
   - Check EAS build logs for specific errors
   - Run `eas build:configure` to validate configuration

### Debug Commands

```bash
# Clear Expo cache
expo start -c

# Clear Metro bundler cache
npx react-native start --reset-cache

# Clear node modules and reinstall
rm -rf node_modules
npm install

# iOS: Clear pods
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

## 📱 Supported Platforms

- ✅ iOS (13.0+)
- ✅ Android (API 21+)
- ✅ Web (Full support with production-ready landing page)
  - Responsive design (Desktop ≥1024px, Tablet 768-1023px, Mobile <768px)
  - SEO optimized
  - Modern animations and interactions
  - Cross-browser compatible

## 🔒 Security

- Custom backend API with JWT token authentication
- Token-based session management
- Secure API communication (HTTPS in production)
- Input validation on forms
- Password hashing via bcrypt on backend
- OTP-based email verification
- OTP-based password reset
- Secure token storage in AsyncStorage

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📝 Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run on web browser
- `npm test` - Run test suite

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **EsportsIndia Team**

## 🙏 Acknowledgments

- Expo team for the amazing development platform
- React Native community for excellent libraries and support
- Render for backend hosting
- MongoDB Atlas for database services

## 📞 Support

For support, email support@esportsindia.com or create an issue in the repository.

## 🎨 Design & Styling

### Color Scheme
- **Background**: `#141E30` (Dark blue)
- **Accent**: `#FFD700` (Gold)
- **Cards**: `#1A1F2E` (Dark card background)
- **Borders**: `#2A3441` (Subtle borders)
- **Text**: `#FFFFFF` (White)
- **Web Neon Theme**: `#0A0A1A`, `#1A0A2A`, `#2A0A3A` (Dark gradients)
- **Web Accents**: `#FF00FF` (Magenta), `#00FFFF` (Cyan)

### Consistent Styling
- All screens follow WinnersScreen header pattern
- Standardized header with back button and gold line
- Responsive design using `wp`, `hp`, `rf`, `rs` utilities
- Dark theme throughout the app

### Web Landing Page Design
- **Gaming Arcade Theme** - Bold typography, vibrant neon colors
- **Responsive Breakpoints**:
  - Desktop: ≥1024px (full navigation, multi-column layouts)
  - Tablet: 768-1023px (adapted layouts, optimized spacing)
  - Mobile: <768px (hamburger menu, single column, touch-optimized)
- **Animations**: Scroll-triggered animations, fade effects, smooth transitions
- **Interactive Elements**: Hover effects, zoom animations, highlight states
- **SEO**: Comprehensive meta tags, Open Graph, Twitter Cards

## 🔄 Version History

- **v1.1.0** - Current version
  - **Web Landing Page** - Production-ready responsive web landing page
    - Hero section with gaming arena background
    - Tournament features showcase
    - Notice board with tournament information
    - How It Works & Why Choose Us combined section
    - Game Modes & Tournaments timeline
    - Stats section with animated counters
    - SEO optimization (meta tags, Open Graph, Twitter Cards)
    - Smart navigation (auto-hide/show on scroll, highlight effects)
    - Fully responsive (desktop, tablet, mobile)
    - Smooth animations and transitions
  - Enhanced responsive design across all platforms
  - Improved mobile navigation experience

- **v1.0.0**
  - OTP-based authentication system
  - Email verification via OTP
  - Password reset via OTP
  - Game details screens (BGMI, Free Fire, Call of Duty, Valorant)
  - Tournament registration
  - Profile management with gender-based icons
  - Standardized dark theme styling
  - Production-ready build configuration
  - Deployed backend API integration

---

**Made with ❤️ for the EsportsIndia community**
