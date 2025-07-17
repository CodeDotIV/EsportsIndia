import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { sendOtp } from '../utils/api';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSignUp = async () => {
    console.log('✅ SignUp button clicked');

    if (!email || !fullName || !phone || !password) {
      Alert.alert('Missing Fields', 'All fields are required.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    try {
      const response = await sendOtp(phone, email);
      console.log('✅ OTP Sent Response:', response.data);

      Alert.alert('OTP Sent', 'Check your email for the OTP.');

      navigation.navigate('VerifyOtpScreen', { phone, email, fullName, password });
    } catch (error) {
      console.error('❌ Signup Error:', error);
      Alert.alert('Error', error?.response?.data?.message || 'Failed to send OTP.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
      <TextInput style={styles.input} placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>

      <Text style={styles.linkText} onPress={() => navigation.navigate('LoginScreen')}>
        Already have an account? Sign In
      </Text>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: '#d49fbf', padding: 15, borderRadius: 30, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  linkText: { textAlign: 'center', marginTop: 15, color: '#80004d' },
});
