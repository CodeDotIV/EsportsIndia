import React, { useEffect } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { auth } from "../firebaseConfig"; // Make sure firebaseConfig is properly initialized
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import GoogleLoginButton from "../components/GoogleLoginButton";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  // Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "1047059325621-a0un440sj2uvj138qj1dhjs6m7nv9jv1.apps.googleusercontent.com", // Expo Go
    iosClientId: "1047059325621-a0un440sj2uvj138qj1dhjs6m7nv9jv1.apps.googleusercontent.com",   // iOS standalone
    androidClientId: "1047059325621-1h2o2enmv7rr0pm8ckf2qppv09i9djjb.apps.googleusercontent.com", // Android
    webClientId: "1047059325621-1h2o2enmv7rr0pm8ckf2qppv09i9djjb.apps.googleusercontent.com",     // Web
  });

  // Handle Google response
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCred) => {
          console.log("User signed in:", userCred.user);
          Alert.alert("Welcome", `Hello ${userCred.user.displayName}`);
        })
        .catch((err) => {
          console.error("Firebase sign-in error:", err);
          Alert.alert("Error", "Failed to sign in with Google");
        });
    }
  }, [response]);

  const handleGoogleLogin = () => {
    promptAsync();
  };

  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f3460", "#e94560"]}
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
        <GoogleLoginButton onPress={handleGoogleLogin} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2025 EsportsIndia. All Rights Reserved.
        </Text>
      </View>
    </LinearGradient>
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
