# EsportsIndia 🎮

A comprehensive mobile esports platform built with React Native and Expo, designed for gaming enthusiasts to participate in tournaments, track winners, and manage their esports journey.

## 📱 Overview

EsportsIndia is a feature-rich mobile application that connects gamers and facilitates esports tournaments for popular games like BGMI (Battlegrounds Mobile India), Free Fire, Call of Duty, and Valorant. The app provides a seamless experience for tournament registration, game information, and user profile management.

## ✨ Features

### 🏠 Home Screen
- Personalized greeting based on time of day
- Game showcase with interactive banners
- Featured games: BGMI, Free Fire, Call of Duty, Valorant
- Smooth animations and transitions

### 🎯 Esports
- Browse available esports games
- Detailed game information and features
- Multiple gaming modes (Solo, Duo, Squad)
- Game-specific tournament options

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

### 🔐 Authentication
- Email/Password authentication via Firebase
- Sign up with email verification
- Password reset functionality
- Secure token-based session management
- OTP verification support

## 🛠️ Tech Stack

### Core Technologies
- **React Native** `0.81.5` - Mobile framework
- **Expo** `^54.0.10` - Development platform
- **React** `19.1.0` - UI library
- **React Navigation** `^7.0.14` - Navigation library

### Key Libraries
- **Firebase** `^11.10.0` - Authentication and backend services
- **Axios** `^1.10.0` - HTTP client for API calls
- **Expo AV** `~16.0.7` - Video playback
- **Expo Linear Gradient** `~15.0.7` - Gradient effects
- **React Native Vector Icons** `^10.2.0` - Icon library
- **AsyncStorage** `2.2.0` - Local data persistence
- **React Native Reanimated** `~4.1.0` - Animations

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

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Update `firebaseConfig.js` with your Firebase credentials:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
     measurementId: "YOUR_MEASUREMENT_ID"
   };
   ```

### API Configuration

Update the API base URL in `utils/api.js`:

```javascript
// For iOS Simulator
return 'http://localhost:5000/api';

// For Android Emulator (use your machine's IP)
return 'http://YOUR_LOCAL_IP:5000/api';

// For Android Emulator alternative
return 'http://10.0.2.2:5000/api';
```

**To find your local IP:**
- **macOS/Linux**: `ifconfig | grep "inet "`
- **Windows**: `ipconfig`

### Environment Variables

Create a `.env` file (if needed) for sensitive configuration:
```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
API_BASE_URL=http://your-api-url:5000/api
```

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

5. **Run on Physical Device**
   - Install Expo Go from App Store (iOS) or Play Store (Android)
   - Scan the QR code displayed in the terminal

### Production Build

1. **Build for iOS**
   ```bash
   eas build --platform ios
   ```

2. **Build for Android**
   ```bash
   eas build --platform android
   ```

## 📁 Project Structure

```
app/
├── assets/                 # Images, videos, fonts
│   ├── images/            # Game logos and UI images
│   ├── vedios/           # Video assets
│   └── fonts/            # Custom fonts
├── components/            # Reusable components
├── constants/            # App constants
├── login/                # Authentication screens
│   ├── LoginScreen.js
│   ├── SignUpScreen.js
│   ├── ForgotPasswordScreen.js
│   ├── ResetPasswordScreen.js
│   └── VerifyOtpScreen.js
├── screens/              # App screens
│   ├── bottonscreens/   # Bottom tab screens
│   │   ├── HomeScreen.js
│   │   ├── EsportsScreen.js
│   │   ├── TournamentsScreen.js
│   │   ├── WinnersScreen.js
│   │   └── ProfileScreen.js
│   ├── esports/         # Game-specific screens
│   │   ├── bgmi.js
│   │   ├── freefire.js
│   │   └── callofduty.js
│   └── esportsarena/    # Arena mode screens
├── services/            # API services
│   ├── authService.js
│   └── otpService.js
├── utils/               # Utility functions
│   ├── api.js          # API configuration
│   ├── responsive.js   # Responsive utilities
│   └── storageHelper.js # AsyncStorage helpers
├── backend/             # Backend functions
├── App.js              # Main app component
├── firebaseConfig.js   # Firebase configuration
├── app.json            # Expo configuration
└── package.json        # Dependencies
```

## 🔑 Key Features Explained

### Navigation Flow
1. **Entry Screen** → Checks authentication status
2. **Login/SignUp** → User authentication
3. **Main (Bottom Tabs)** → Home, Esports, Tournaments, Winners, Profile

### Tournament Registration
- Select game (BGMI, Free Fire, Call of Duty)
- Choose map (Erangel, Livik, Nusa, Shanok)
- Select mode (Solo, Duo, Squad)
- Fill player details
- Submit registration

### Data Persistence
- User data stored in AsyncStorage
- Firebase Authentication for secure login
- Token-based session management

## 🐛 Troubleshooting

### Common Issues

1. **App not opening/rendering**
   - Check console logs for errors
   - Verify Firebase configuration
   - Ensure video assets exist at `assets/vedios/intro.mp4`
   - Clear cache: `expo start -c`

2. **API connection errors**
   - Verify backend server is running
   - Check API base URL in `utils/api.js`
   - Ensure correct IP address for Android emulator
   - Check network connectivity

3. **Firebase authentication errors**
   - Verify Firebase credentials in `firebaseConfig.js`
   - Ensure Email/Password authentication is enabled in Firebase Console
   - Check Firebase project settings

4. **Video not loading**
   - Verify video file exists and is in correct format
   - Check file path: `assets/vedios/intro.mp4`
   - Ensure video file size is reasonable

5. **Navigation issues**
   - Check screen names match exactly in `App.js`
   - Verify navigation stack configuration
   - Clear AsyncStorage if stuck on entry screen

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
- ✅ Web (limited support)

## 🔒 Security

- Firebase Authentication for secure user management
- Token-based session management
- Secure API communication
- Input validation on forms
- Password encryption via Firebase

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

- Firebase for authentication services
- Expo team for the amazing development platform
- React Native community for excellent libraries and support

## 📞 Support

For support, email support@esportsindia.com or create an issue in the repository.

## 🔄 Version History

- **v1.0.0** - Initial release
  - User authentication
  - Tournament registration
  - Game information screens
  - Profile management

---

**Made with ❤️ for the EsportsIndia community**
