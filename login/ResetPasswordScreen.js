import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { useVideoPlayer, VideoView } from "expo-video";
import { resetPassword } from "../services/authService";

export default function ResetPasswordScreen({ navigation, route }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  const player = useVideoPlayer(require("../assets/vedios/intro.mp4"), (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  useEffect(() => {
    // Get token from route params (when navigated from email link or manually)
    const resetToken = route?.params?.token || "";
    if (resetToken) {
      setToken(resetToken);
    }
    // If no token, user can manually enter it from email
  }, [route]);

  const handleResetPassword = async () => {
    if (!token) {
      Alert.alert("Error", "Reset token is missing. Please use the link from your email.");
      return;
    }

    if (!password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(token, password);
    if (res.success) {
        Alert.alert(
          "Success",
          "Password reset successful! You can now login with your new password.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("LoginScreen")
            }
          ]
        );
    } else {
        Alert.alert("Failed", res.error || "Password reset failed. The link may have expired.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };


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
            <MaskedView maskElement={<Text style={styles.title}>Reset Password</Text>}>
              <LinearGradient
                colors={["#FF9933", "#FFFFFF", "#138808"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={[styles.title, { opacity: 0 }]}>Reset Password</Text>
              </LinearGradient>
            </MaskedView>
              <Text style={styles.subtitle}>
                {token ? "Enter your new password" : "Enter reset token from email and new password"}
              </Text>
          </View>

          <View style={styles.form}>
              {!token && (
            <TextInput
                  placeholder="Reset Token (from email)"
              placeholderTextColor="#aaa"
                  value={token}
                  onChangeText={setToken}
                  style={styles.input}
                  editable={!loading}
              autoCapitalize="none"
                />
              )}

              <TextInput
                placeholder="New Password"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                editable={!loading}
              />

              <TextInput
                placeholder="Confirm New Password"
                placeholderTextColor="#aaa"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              style={styles.input}
                editable={!loading}
            />

              <TouchableOpacity
                style={[styles.resetBtn, loading && styles.resetBtnDisabled]}
                onPress={handleResetPassword}
                disabled={loading}
              >
                <Text style={styles.resetText}>
                  {loading ? "Resetting..." : "Reset Password"}
                </Text>
            </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
              <Text style={styles.backText}>← Back to Login</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  innerContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
  },
  header: {
    marginTop: 60,
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 1,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#ddd",
    marginTop: 10,
    textAlign: "center",
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#ffffff22",
    padding: 14,
    borderRadius: 12,
    marginVertical: 10,
    color: "white",
    fontSize: 16,
  },
  resetBtn: {
    backgroundColor: "#e94560",
    width: "100%",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  resetBtnDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
  resetText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  backText: {
    color: "#e94560",
    marginTop: 15,
    fontSize: 16,
  },
  footer: {
    marginTop: 30,
    marginBottom: 20,
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
});
