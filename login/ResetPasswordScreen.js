import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { resetPassword } from '../utils/api';  // ✅ Using central API

const ResetPasswordScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleReset = async () => {
    if (!otp || !newPassword) {
      return Alert.alert('Missing Fields', 'Please fill in both OTP and new password.');
    }

    if (otp.length !== 6) {
      return Alert.alert('Invalid OTP', 'OTP must be a 6-digit number.');
    }

    if (newPassword.length < 6) {
      return Alert.alert('Weak Password', 'Password must be at least 6 characters.');
    }

    try {
      await resetPassword(email, otp, newPassword);  // ✅ Calling centralized API
      Alert.alert('Success', 'Password reset successfully');
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Reset Password Error:', error);
      Alert.alert('Error', 'Failed to reset password. Please check OTP and try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
      />

      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333', textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#4A90E2', padding: 15, borderRadius: 30, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
