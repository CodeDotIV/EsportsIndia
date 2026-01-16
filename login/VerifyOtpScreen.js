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
import { verifyOtp, sendOtp } from "../services/otpService";
import { setItem } from "../utils/storageHelper";

export default function VerifyOtpScreen({ route, navigation }) {
  const { email, purpose = 'email_verification' } = route.params || {};
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert("Error", "Please enter 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp(email, otp);
      if (res.success) {
        // If token is returned (email verification), save it and navigate to Main
        if (res.token && res.user) {
          try {
            await setItem("user", JSON.stringify(res.user));
            await setItem("userToken", res.token);
            console.log("💾 User data and token saved after OTP verification");
          } catch (storageError) {
            console.error("❌ Failed to save user data:", storageError);
          }
          
          // Navigate directly to Main screen
          navigation.replace("Main");
        } else {
          // For other purposes, show success message
          Alert.alert(
            "Success", 
            "OTP verified successfully!",
            [
              {
                text: "OK",
                onPress: () => {
                  if (purpose === 'email_verification') {
                    navigation.replace("LoginScreen");
                  } else {
                    navigation.replace("Main");
                  }
                }
              }
            ]
          );
        }
      } else {
        Alert.alert("Verification Failed", res.error);
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const res = await sendOtp(email, purpose);
      if (res.success) {
        Alert.alert("Success", "OTP resent! Please check your email.");
      } else {
        Alert.alert("Error", res.error || "Failed to resend OTP");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
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
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
          maxLength={6}
          editable={!loading}
        />

        <TouchableOpacity 
          style={[styles.verifyButton, loading && styles.verifyButtonDisabled]} 
          onPress={handleVerifyOtp}
          disabled={loading}
        >
          <Text style={styles.verifyButtonText}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resendButton}
          onPress={handleResendOtp}
          disabled={loading}
        >
          <Text style={[styles.resendText, loading && styles.resendTextDisabled]}>
            Resend OTP
          </Text>
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
  verifyButtonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.6,
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
  resendTextDisabled: {
    color: "#ccc",
  },
});
