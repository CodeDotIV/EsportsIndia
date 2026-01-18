import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { useVideoPlayer, VideoView } from "expo-video";
import { signUp } from "../services/authService";
import { wp, hp, rf, rs, isTablet, isSmallDevice } from "../utils/responsive";
import { setItem } from "../utils/storageHelper";
import { sendOtp } from "../services/otpService";

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const player = useVideoPlayer(require("../assets/vedios/intro.mp4"), (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      console.log("🔐 Attempting signup for:", email);
      const result = await signUp(name, email, password);
      
      if (result.success) {
        console.log("✅ Signup successful:", result.user.email);
        
        // Always navigate to OTP verification screen after signup
        // OTP is automatically sent during signup
        navigation.navigate("VerifyOtpScreen", {
          email: result.user.email,
          purpose: "email_verification"
        });
      } else {
        console.error("❌ Signup failed:", result.error);
        Alert.alert("Signup Failed", result.error);
      }
    } catch (err) {
      console.error("❌ Signup error:", err);
      Alert.alert("Signup Failed", err.message || "An unexpected error occurred");
    }
  };

  const tablet = isTablet();
  const smallDevice = isSmallDevice();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.videoContainer}>
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          nativeControls={false}
        />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0, 0, 0, 0.80)" }]} />
      </View>

      <LinearGradient colors={["#1a1a2eaa", "#16213eaa", "#0f3460aa"]} style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.innerContainer}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <MaskedView maskElement={<Text style={styles.title}>Create Account</Text>}>
                <LinearGradient
                  colors={["#FF9933", "#FFFFFF", "#138808"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={[styles.title, { opacity: 0 }]}>Create Account</Text>
                </LinearGradient>
              </MaskedView>
              <Text style={styles.subtitle}>Join the EsportsIndia Community</Text>
            </View>

            <View style={styles.form}>
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />

              <TextInput
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />

              <TextInput
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
              />

              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
              />

              <TouchableOpacity onPress={handleSignup} style={styles.signupBtn}>
                <Text style={styles.signupTextBtn}>Sign Up</Text>
              </TouchableOpacity>

              <View style={styles.loginRow}>
                <Text style={styles.loginLabel}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
                  <Text style={styles.loginLink}> Login</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.footer}>© 2025 EsportsIndia. All Rights Reserved.</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  videoContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(8),
    justifyContent: "center",
  },
  innerContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(3),
  },
  header: {
    alignItems: "center",
    marginTop: hp(6),
    marginBottom: hp(3),
  },
  title: {
    fontSize: rf(42),
    fontWeight: "bold",
    color: "white",
    letterSpacing: 1,
    textAlign: "center",
  },
  subtitle: {
    fontSize: rf(16),
    color: "#ddd",
    marginTop: hp(1.2),
    textAlign: "center",
    paddingHorizontal: wp(5),
  },
  form: {
    width: "100%",
    maxWidth: wp(90),
    alignItems: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#ffffff22",
    paddingVertical: hp(1.7),
    paddingHorizontal: wp(4),
    borderRadius: rs(12),
    marginVertical: hp(1),
    color: "white",
    fontSize: rf(16),
  },
  signupBtn: {
    backgroundColor: "#e94560",
    width: "100%",
    paddingVertical: hp(2),
    borderRadius: rs(14),
    alignItems: "center",
    marginTop: hp(1.2),
  },
  signupTextBtn: {
    color: "white",
    fontSize: rf(20),
    fontWeight: "bold",
  },
  loginRow: {
    flexDirection: "row",
    marginTop: hp(2),
    flexWrap: "wrap",
    justifyContent: "center",
  },
  loginLabel: {
    color: "#ddd",
    fontSize: rf(16),
  },
  loginLink: {
    color: "#e94560",
    fontWeight: "bold",
    fontSize: rf(16),
  },
  footer: {
    marginTop: hp(3),
    marginBottom: hp(5),
    color: "white",
    fontSize: rf(14),
    textAlign: "center",
  },
});
