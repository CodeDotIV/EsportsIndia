import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { Video } from "expo-av";
import { resetPasswordViaBackend } from "../services/authService";

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    const res = await resetPasswordViaBackend(email);
    if (res.success) {
      Alert.alert("Success", "Password reset link sent to your email.");
      navigation.navigate("Login");
    } else {
      Alert.alert("Failed", res.error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Video
        source={require("../assets/vedios/intro.mp4")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        isLooping
        shouldPlay
        isMuted
      />

      <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0, 0, 0, 0.80)" }]} />

      <LinearGradient colors={["#1a1a2eaa", "#16213eaa", "#0f3460aa"]} style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.innerContainer}
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
            <Text style={styles.subtitle}>Enter your registered email</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <TouchableOpacity style={styles.resetBtn} onPress={handleResetPassword}>
              <Text style={styles.resetText}>Send Reset Link</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.backText}>← Back to Login</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>© 2025 EsportsIndia. All Rights Reserved.</Text>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    marginTop: 120,
    alignItems: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#ddd",
    marginTop: 10,
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
    marginBottom: 40,
    color: "white",
    fontSize: 14,
  },
});
