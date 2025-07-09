import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifyOtp } from '../utils/api';

const VerifyOtpScreen = ({ route, navigation }) => {
  const { phone } = route.params;
  const [otp, setOtp] = useState('');

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      return Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP.');
    }

    try {
      const res = await verifyOtp(phone.trim(), otp.trim());   // ✅ trimmed values
      const token = res.data.token;

      await AsyncStorage.setItem('userToken', token);
      Alert.alert('Success', 'Account verified!');
      navigation.replace('Main');
    } catch (error) {
      console.error('OTP Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Invalid OTP.');
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
