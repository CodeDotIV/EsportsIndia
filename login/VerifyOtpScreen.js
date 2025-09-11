// login/VerifyOtpScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { verifyOtp } from "../services/otpService";

export default function VerifyOtpScreen({ route, navigation }) {
  const { email } = route.params;
  const [otp, setOtp] = useState("");

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP.");
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
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>OTP sent to: {email}</Text>
      <TextInput style={styles.input} placeholder="Enter OTP" value={otp} onChangeText={setOtp} keyboardType="numeric" />
      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  subtitle: { textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  button: { backgroundColor: "#ffc107", padding: 15, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "#000", fontWeight: "bold" },
});
