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
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { sendOtp } from "../services/otpService";
import { wp, hp, rf, rs } from "../utils/responsive";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      console.log("📧 Sending OTP to:", email);
      const res = await sendOtp(email, 'password_reset');
      console.log("📧 OTP Response:", res);
      if (res.success) {
        console.log("✅ OTP sent successfully, navigating to VerifyOtpScreen");
        // Navigate immediately to VerifyOtpScreen
        navigation.replace("VerifyOtpScreen", { 
          email, 
          purpose: 'password_reset' 
        });
      } else {
        console.log("❌ OTP send failed:", res.error);
        Alert.alert("Failed", res.error);
      }
    } catch (error) {
      console.error("❌ Error sending OTP:", error);
      Alert.alert("Error", error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.innerContainer}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Forgot Password</Text>
              <Text style={styles.subtitle}>Enter your registered email</Text>
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

            <TouchableOpacity 
              style={[styles.resetBtn, loading && styles.resetBtnDisabled]} 
              onPress={handleForgotPassword}
              disabled={loading}
            >
              <Text style={styles.resetText}>
                {loading ? "Sending..." : "Send OTP Code"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>← Back to Login</Text>
            </TouchableOpacity>
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
  resetBtn: {
    backgroundColor: "#FFD700",
    width: "100%",
    padding: hp(1.5),
    borderRadius: rs(8),
    alignItems: "center",
    marginTop: hp(1.2),
  },
  resetBtnDisabled: {
    backgroundColor: "#666",
    opacity: 0.6,
  },
  resetText: {
    color: "#000",
    fontSize: rf(18),
    fontWeight: "bold",
  },
  backText: {
    color: "#FFD700",
    marginTop: hp(1.5),
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
