import React, { useEffect, useRef, useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { login } from "../services/authService";
import { sendOtp } from "../services/otpService";
import { supabase } from "../services/supabase";
import { wp, hp, rf, rs, isTablet, isSmallDevice } from "../utils/responsive";
import { setItem } from "../utils/storageHelper";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const enteredRef = useRef(false);

  const enterApp = async (session) => {
    if (!session?.user || enteredRef.current) return;
    enteredRef.current = true;

    const user = session.user;
    const userData = {
      email: user.email,
      name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
      id: user.id,
      isEmailVerified: Boolean(user.email_confirmed_at || user.email),
    };

    try {
      await setItem("user", JSON.stringify(userData));
      await setItem("userToken", session.access_token);
    } catch (storageError) {
      console.error("Failed to save Google session:", storageError);
    }

    navigation.replace("Main");
  };

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        enterApp(session);
      }
    });

    return () => data.subscription.unsubscribe();
  }, [navigation]);

  const showLoginError = (message) => {
    if (Platform.OS === "web") {
      window.alert(`Login failed: ${message}`);
    } else {
      Alert.alert("Login failed", message);
    }
  };

  const handleGoogleSignIn = async () => {
    if (googleLoading) return;

    try {
      setGoogleLoading(true);

      if (Platform.OS === "web") {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: window.location.origin,
            skipBrowserRedirect: true,
            queryParams: { prompt: "select_account" },
          },
        });

        if (error) throw error;
        if (!data?.url) throw new Error("Google authorization URL not received");

        window.location.assign(data.url);
        return;
      }

      const redirectTo = makeRedirectUri({
        scheme: "myapp",
        path: "auth/callback",
      });

      console.log("Google redirect URL:", redirectTo);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
          queryParams: { prompt: "select_account" },
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error("Google authorization URL not received");

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

      if (result.type === "cancel" || result.type === "dismiss") {
        return;
      }

      if (result.type !== "success" || !result.url) {
        throw new Error("Google authentication did not return successfully");
      }

      const callbackUrl = new URL(result.url);
      const authError =
        callbackUrl.searchParams.get("error_description") ||
        callbackUrl.searchParams.get("error");

      if (authError) {
        throw new Error(decodeURIComponent(authError.replace(/\+/g, " ")));
      }

      const code = callbackUrl.searchParams.get("code");
      if (!code) {
        throw new Error("Authentication code not received from Google");
      }

      const { data: sessionData, error: sessionError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (sessionError) throw sessionError;
      if (!sessionData.session) {
        throw new Error("Supabase session was not created");
      }

      await enterApp(sessionData.session);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      console.error("Google login error:", message);
      showLoginError(message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email & password");
      return;
    }

    try {
      console.log("🔐 Attempting login for:", email);
      const result = await login(email, password);
      
      if (result.success) {
        console.log("✅ Login successful:", result.user.email);
        
        // Save user data to AsyncStorage
        const userData = {
          email: result.user.email,
          name: result.user.name,
          id: result.user.id,
          isEmailVerified: result.user.isEmailVerified,
        };
        
        try {
          await setItem("user", JSON.stringify(userData));
          await setItem("userToken", result.token);
          console.log("💾 User data saved to storage:", userData);
        } catch (storageError) {
          console.error("❌ Failed to save user data:", storageError);
          // Continue navigation even if storage fails
        }
        
        Alert.alert("Success", `Welcome ${result.user.name || result.user.email}`);
        // Use replace instead of navigate to prevent going back to login
        navigation.replace("Main");
      } else {
        console.error("❌ Login failed:", result.error);
        
        // If email verification is required, navigate to OTP screen
        if (result.requiresVerification) {
          Alert.alert(
            "Email Not Verified",
            result.error || "Please verify your email before logging in.",
            [
              {
                text: "Send OTP",
                onPress: async () => {
                  // Send OTP for email verification
                  const otpResult = await sendOtp(result.email || email, "email_verification");
                  if (otpResult.success) {
                    navigation.navigate("VerifyOtpScreen", {
                      email: result.email || email,
                      purpose: "email_verification"
                    });
                  } else {
                    Alert.alert("Error", otpResult.error || "Failed to send OTP");
                  }
                }
              },
              {
                text: "Cancel",
                style: "cancel"
              }
            ]
          );
        } else {
          Alert.alert("Login Failed", result.error);
        }
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      Alert.alert("Login Failed", error.message || "An unexpected error occurred");
    }
  };

  const tablet = isTablet();
  const smallDevice = isSmallDevice();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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
            <View style={styles.titleContainer}>
              <Text style={styles.title}>EsportsIndia</Text>
              <Text style={styles.subtitle}>Level Up Your Gaming Journey</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  placeholder="Enter email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  placeholder="Enter password"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                />
              </View>

              <TouchableOpacity onPress={handleEmailLogin} style={styles.loginBtn}>
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>

              <Text style={styles.orText}>or</Text>

              <TouchableOpacity
                style={[styles.googleButton, googleLoading && styles.disabledButton]}
                onPress={handleGoogleSignIn}
                disabled={googleLoading}
                activeOpacity={0.8}
              >
                {googleLoading ? (
                  <ActivityIndicator color="#111827" />
                ) : (
                  <>
                    <Text style={styles.googleMark}>G</Text>
                    <Text style={styles.googleButtonText}>Continue with Google</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("ForgotPasswordScreen")}>
                <Text style={styles.link}>Forgot Password?</Text>
              </TouchableOpacity>

              <View style={styles.signupRow}>
                <Text style={styles.signupLabel}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignUpScreen")}>
                  <Text style={styles.signupText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.footer}>© 2025 EsportsIndia. All Rights Reserved.</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#141E30',
  },
  container: {
    flex: 1,
    backgroundColor: '#141E30',
  },
  innerContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(5),
    paddingVertical: hp(3),
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: hp(4),
  },
  title: {
    fontSize: rf(44),
    fontWeight: "bold",
    letterSpacing: 2,
    color: "white",
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
  inputContainer: {
    marginBottom: hp(2),
    width: "100%",
  },
  label: {
    fontSize: rf(16),
    fontWeight: '600',
    marginBottom: hp(0.5),
    color: '#FFFFFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#2A3441',
    borderRadius: rs(8),
    padding: hp(1.2),
    backgroundColor: '#1A1F2E',
    color: '#FFFFFF',
    fontSize: rf(15),
  },
  loginBtn: {
    backgroundColor: "#FFD700",
    width: "100%",
    paddingVertical: hp(2),
    borderRadius: rs(8),
    marginTop: hp(1.2),
    alignItems: "center",
  },
  loginText: {
    color: "#000",
    fontSize: rf(20),
    fontWeight: "bold",
    letterSpacing: 1,
  },
  orText: {
    color: "#A0A7BD",
    marginTop: hp(2),
    fontSize: rf(14),
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: 55,
    borderRadius: rs(12),
    marginTop: hp(1.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  googleMark: {
    color: "#4285F4",
    fontSize: rf(22),
    fontWeight: "900",
    marginRight: 12,
  },
  googleButtonText: {
    color: "#111827",
    fontSize: rf(15),
    fontWeight: "700",
  },
  link: {
    color: "#FFD700",
    marginTop: hp(1.2),
    fontSize: rf(16),
  },
  signupRow: {
    flexDirection: "row",
    marginTop: hp(2),
    flexWrap: "wrap",
    justifyContent: "center",
  },
  signupLabel: {
    color: "#ddd",
    fontSize: rf(16),
  },
  signupText: {
    color: "#FFD700",
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
