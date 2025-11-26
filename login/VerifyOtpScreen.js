// login/VerifyOtpScreen.js
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
import { verifyOtp } from "../services/otpService";

export default function VerifyOtpScreen({ route, navigation }) {
  const { email } = route.params;
  const [otp, setOtp] = useState("");

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter 4-digit OTP.");
      return;
    }

    const res = await verifyOtp(email, otp);
    if (res.success) {
      navigation.replace("MainScreen");
    } else {
      Alert.alert("Verification Failed", res.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>Code sent to:</Text>
        <Text style={styles.emailText}>{email}</Text>

        <TextInput
          style={styles.otpInput}
          placeholder="Enter 4-digit OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
          maxLength={4}
        />

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOtp}>
          <Text style={styles.verifyButtonText}>Verify OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resendButton}
          onPress={() => Alert.alert("OTP Resent", "Please check your inbox!")}
        >
          <Text style={styles.resendText}>Resend OTP</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#777",
  },
  emailText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 25,
    fontWeight: "600",
    color: "#000",
  },
  otpInput: {
    height: 55,
    fontSize: 20,
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    borderWidth: 1.5,
    borderColor: "#bbb",
    borderRadius: 12,
    marginBottom: 20,
    fontWeight: "bold",
    letterSpacing: 10,
  },
  verifyButton: {
    backgroundColor: "#ff7f00",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  verifyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  resendButton: {
    alignItems: "center",
  },
  resendText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#007bff",
  },
});
