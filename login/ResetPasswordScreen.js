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
import { Ionicons } from "@expo/vector-icons";
import { resetPasswordWithOtp } from "../services/otpService";
import { wp, hp, rf, rs } from "../utils/responsive";

export default function ResetPasswordScreen({ navigation, route }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Get email from route params (from VerifyOtpScreen after OTP verification)
    const userEmail = route?.params?.email || "";
    if (userEmail) {
      setEmail(userEmail);
    }
  }, [route]);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Email is missing. Please start the password reset process again.");
      navigation.navigate("ForgotPasswordScreen");
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
      const res = await resetPasswordWithOtp(email, password);
      if (res.success) {
        Alert.alert(
          "Success",
          "Password reset successful! Redirecting to login..."
        );
        // Navigate to login screen after 2 seconds
        setTimeout(() => {
          navigation.replace("LoginScreen");
        }, 2000);
      } else {
        Alert.alert("Failed", res.error || "Password reset failed. Please verify OTP again.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Reset Password</Text>
        </View>
        <View style={styles.headerLine} />

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
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>Enter your new password</Text>
            </View>

          <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                  placeholder="Enter new password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={styles.input}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm New Password</Text>
                <TextInput
                  placeholder="Enter confirm password"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  style={styles.input}
                  editable={!loading}
                />
              </View>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '',
    padding: 20,
  },
  backButton: {
    color: 'white',
    marginRight: 10,
    paddingTop: 40,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    paddingTop: 38,
  },
  headerLine: {
    height: 1,
    width: '100%',
    backgroundColor: '#FFD700',
    marginVertical: 5,
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
