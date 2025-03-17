import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Button, Alert } from 'react-native';

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwqrRrHhYhJ2O1lcTHC8Cyc8lAHaXUDpPgMXilotORD-K-g1iI6CUjp_iWUuzMYGUxGag/exec";

const RegistrationForm = ({ route }) => {
  const { slot } = route.params;

  const [form, setForm] = useState({
    mode: 'Nusa - Solo',
    slot: slot,
    player1: '',
    gameId: '',
    mobileNumber: '',
    aadhaarNumber: '',
    payment: '',
  });

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting form:", form);
  
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
  
      const resultText = await response.text();
      console.log("Response text:", resultText); // Log raw response
  
      try {
        const result = JSON.parse(resultText);
        console.log("Parsed response:", result);
  
        if (result.success) {
          Alert.alert("Success", "Data saved successfully!");
        } else {
          Alert.alert("Error", result.message || "Something went wrong.");
        }
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        Alert.alert("Error", "Invalid server response.");
      }
  
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Network or server issue.");
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Register</Text>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mode</Text>
          <TextInput style={[styles.input, styles.disabledInput]} value={form.mode} editable={false} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Slot</Text>
          <TextInput style={[styles.input, styles.disabledInput]} value={form.slot} editable={false} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Player 1</Text>
          <TextInput
            style={styles.input}
            value={form.player1}
            onChangeText={(text) => handleChange('player1', text)}
            placeholder="Enter Player 1 Name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Game ID</Text>
          <TextInput
            style={styles.input}
            value={form.gameId}
            onChangeText={(text) => handleChange('gameId', text)}
            placeholder="Enter Game ID"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            value={form.mobileNumber}
            onChangeText={(text) => handleChange('mobileNumber', text)}
            placeholder="Enter Mobile Number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Aadhaar Number</Text>
          <TextInput
            style={styles.input}
            value={form.aadhaarNumber}
            onChangeText={(text) => handleChange('aadhaarNumber', text)}
            placeholder="Enter Aadhaar Number"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Payment</Text>
          <TextInput
            style={styles.input}
            value={form.payment}
            onChangeText={(text) => handleChange('payment', text)}
            placeholder="Enter Payment Amount"
            keyboardType="numeric"
          />
        </View>

        <Button title="Submit" onPress={handleSubmit} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#f5a623', padding: 30, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000' },
  form: { flex: 1, paddingHorizontal: 20, marginTop: 10 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, backgroundColor: 'white' },
  disabledInput: { backgroundColor: '#e0e0e0', color: '#666' },
});

export default RegistrationForm;
