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
import { signUp } from "../services/authService";
import { wp, hp, rf, rs, isTablet, isSmallDevice } from "../utils/responsive";
import { setItem } from "../utils/storageHelper";
import { sendOtp } from "../services/otpService";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function SignupScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join the EsportsIndia Community</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  placeholder="Enter full name"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  autoCapitalize="words"
                />
              </View>

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

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  placeholder="Enter confirm password"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  style={styles.input}
                />
              </View>

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
  signupBtn: {
    backgroundColor: "#FFD700",
    width: "100%",
    paddingVertical: hp(2),
    borderRadius: rs(8),
    alignItems: "center",
    marginTop: hp(1.2),
  },
  signupTextBtn: {
    color: "#000",
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
