// login/VerifyOtpScreen.js
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
  BackHandler,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { verifyOtp, sendOtp } from "../services/otpService";
import { setItem } from "../utils/storageHelper";

export default function VerifyOtpScreen({ route, navigation }) {
  const { email, purpose = 'email_verification' } = route.params || {};
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Android hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleGoBack();
      return true; // Prevent default back behavior
    });

    return () => backHandler.remove();
  }, []);

  // Handle back button press
  const handleGoBack = () => {
    if (loading) return; // Prevent navigation during loading
    
    // Navigate back to the previous screen (SignUpScreen or LoginScreen)
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Fallback: navigate to LoginScreen if no previous screen
      navigation.replace("LoginScreen");
    }
  };

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
          // Handle password reset purpose
          if (purpose === 'password_reset') {
            // Navigate to reset password screen
            navigation.replace("ResetPasswordScreen", { email });
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={handleGoBack} 
            style={styles.backButton}
            disabled={loading}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>OTP Verification</Text>
        </View>
        <View style={styles.headerLine} />

        <View style={styles.container}>
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.subtitle}>Code sent to:</Text>
          <Text style={styles.emailText}>{email}</Text>

        <TextInput
          style={styles.otpInput}
          placeholder="XXXXXX"
          placeholderTextColor="#999"
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

        <TouchableOpacity
          style={styles.backToLoginButton}
          onPress={handleGoBack}
          disabled={loading}
        >
          <Text style={[styles.backToLoginText, loading && styles.backToLoginTextDisabled]}>
            ← Back to {purpose === 'email_verification' ? 'Login' : 'Previous'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#141E30",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "",
    padding: 20,
  },
  backButton: {
    color: "white",
    marginRight: 10,
    paddingTop: 40,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    paddingTop: 38,
  },
  headerLine: {
    height: 1,
    width: "100%",
    backgroundColor: "#FFD700",
    marginVertical: 5,
  },
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
    color: "white",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#ccc",
  },
  emailText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 25,
    fontWeight: "600",
    color: "#FFD700",
  },
  otpInput: {
    height: 55,
    fontSize: 20,
    textAlign: "center",
    backgroundColor: "#1A1F2E",
    borderWidth: 1,
    borderColor: "#2A3441",
    borderRadius: 12,
    marginBottom: 20,
    fontWeight: "bold",
    letterSpacing: 10,
    color: "white",
    paddingHorizontal: 10,
  },
  verifyButton: {
    backgroundColor: "#FFD700",
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
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  resendButton: {
    alignItems: "center",
  },
  resendText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFD700",
  },
  resendTextDisabled: {
    color: "#666",
  },
  backToLoginButton: {
    alignItems: "center",
    marginTop: 20,
  },
  backToLoginText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFD700",
  },
  backToLoginTextDisabled: {
    color: "#666",
  },
});
