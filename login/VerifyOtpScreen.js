import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifyOtp, registerUser } from '../utils/api';

const VerifyOtpScreen = ({ route, navigation }) => {
  const { phone, email, fullName, password } = route.params;
  const [otp, setOtp] = useState('');

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      return Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP.');
    }

    try {
      // 1. Verify OTP
      const res = await verifyOtp(phone.trim(), otp.trim());

      // 2. Register the user with password and name
      await registerUser(phone.trim(), email.trim(), fullName.trim(), password.trim());

      // 3. Save token and navigate
      await AsyncStorage.setItem('userToken', res.data.token);
      Alert.alert('Success', 'Account verified and registered!');
      navigation.replace('Main');
    } catch (error) {
      console.error('OTP Verify/Register Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VerifyOtpScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#d49fbf', padding: 15, borderRadius: 30, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});