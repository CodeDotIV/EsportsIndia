import React, { useEffect } from "react";
import { View, StyleSheet, Text, Alert, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { Video } from "expo-av";
import { auth } from "../firebaseConfig";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import GoogleLoginButton from "../components/GoogleLoginButton";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    // Expo Go uses Web Client ID
    expoClientId: "1047059325621-rsjgkah208ur3e92j2d0do5tk5pornv5.apps.googleusercontent.com",
    // Required for iOS standalone builds
    iosClientId: Platform.OS === "ios" 
      ? "1047059325621-a0un440sj2uvj138qj1dhjs6m7nv9jv1.apps.googleusercontent.com" 
      : undefined,
    // Required for Android standalone builds
    androidClientId: Platform.OS === "android" 
      ? "1047059325621-1h2o2enmv7rr0pm8ckf2qppv09i9djjb.apps.googleusercontent.com" 
      : undefined,
  });

  useEffect(() => {
    const loginWithGoogle = async () => {
      if (response?.type === "success" && response.authentication) {
        const { idToken } = response.authentication;

        if (!idToken) {
          console.error("No idToken returned. Check client IDs.");
          Alert.alert("Error", "Failed to get token from Google");
          return;
        }

        const credential = GoogleAuthProvider.credential(idToken);

        try {
          const userCred = await signInWithCredential(auth, credential);
          Alert.alert("Welcome", `Hello ${userCred.user.displayName}`);
        } catch (err) {
          console.error("Firebase sign-in error:", err);
          Alert.alert("Error", "Failed to sign in with Google");
        }
      }
    };

    loginWithGoogle();
  }, [response]);

  return (
    <View style={{ flex: 1 }}>
      {/* Background Video */}
      <Video
        source={require("../assets/vedios/intro.mp4")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        isLooping
        shouldPlay
        isMuted
        volume={0}
      />

      {/* Semi-transparent overlay */}
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "rgba(0, 0, 0, 0.8)" },
        ]}
      />

      {/* Content */}
      <LinearGradient
        colors={["#1a1a2eaa", "#16213eaa", "#0f3460aa", "#e94560aa"]}
        style={styles.container}
      >
        <View style={styles.header}>
          <MaskedView maskElement={<Text style={styles.title}>EsportsIndia</Text>}>
            <LinearGradient
              colors={["#FF9933", "#FFFFFF", "#138808"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.title, { opacity: 0 }]}>EsportsIndia</Text>
            </LinearGradient>
          </MaskedView>

          <Text style={styles.subtitle}>Level Up Gaming Journey</Text>
        </View>

        <View style={styles.buttonWrapper}>
          <GoogleLoginButton onPress={() => promptAsync()} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 EsportsIndia. All Rights Reserved.
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
  },
  header: {
    alignItems: "center",
    marginTop: 80,
  },
  title: {
    fontSize: 44,
    fontWeight: "bold",
    letterSpacing: 2,
    textAlign: "center",
    marginTop: 140,
  },
  subtitle: {
    fontSize: 16,
    color: "#ddd",
    marginTop: 6,
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  footer: {
    marginBottom: 80,
  },
  footerText: {
    color: "white",
    fontSize: 14,
  },
});
