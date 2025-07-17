import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, getUserByEmail } from '../utils/api';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleLogin = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      return Alert.alert('Missing Fields', 'Please enter both email and password.');
    }

    if (!validateEmail(trimmedEmail)) {
      return Alert.alert('Invalid Email', 'Please enter a valid email address.');
    }

    try {
      const res = await login(trimmedEmail, trimmedPassword);
      await AsyncStorage.setItem('userToken', res.data.token);
      Alert.alert('Success', 'Logged in successfully!');
      navigation.replace('MainScreen');
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Login Failed', 'Invalid email or password.');

      try {
        const userRes = await getUserByEmail(trimmedEmail);
        const { name, phone } = userRes.data;
        Alert.alert('Account Found', `Name: ${name}\nPhone: ${phone}`);
      } catch (err) {
        console.log('No saved user:', err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <Text onPress={() => navigation.navigate('SignUpScreen')} style={styles.linkText}>Sign Up</Text>
        <Text onPress={() => navigation.navigate('ForgotPasswordScreen')} style={styles.linkText}>Forgot Password?</Text>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 10, marginBottom: 20, fontSize: 16 },
  button: { backgroundColor: '#4A90E2', padding: 15, borderRadius: 30, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  linkContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  linkText: { color: '#4A90E2', fontWeight: '600' },
});
