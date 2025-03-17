import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { verifyOTP } from '../services/AuthService';

const OtpScreen = ({ route, navigation }) => {
  const { verificationId } = route.params;
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Enter a valid 6-digit OTP');
      return;
    }

    try {
      const user = await verifyOTP(verificationId, otp);
      alert('OTP Verified! Welcome.');
      navigation.replace('HomeScreen');
    } catch (error) {
      setError('Invalid OTP. Try again.');
      console.error('OTP Verification Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
        placeholder="Enter OTP"
        placeholderTextColor="#888"
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#F9F9F9' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#333' },
  input: { width: '100%', height: 50, borderColor: '#aaa', borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, fontSize: 16, backgroundColor: '#fff', marginBottom: 20 },
  errorText: { color: '#E53935', marginBottom: 10, textAlign: 'center' },
  button: { backgroundColor: '#4A90E2', padding: 15, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
});

export default OtpScreen;
