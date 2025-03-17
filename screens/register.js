import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';

const RegistrationForm = () => {
  const [form, setForm] = useState({
    mode: '',
    slot: '',
    Player1: '',
    gameId: '',
    mobileNumber: '',
    aadhaarNumber: '',
    payment: '',
    we:'',
    mode: '',
    slot: '',
    name: '',
    gameId: '',
    mobileNumber: '',
    aadhaarNumber: '',
    payment: '',
    we:'',
  });

  const placeholders = {
    mode: 'Enter Mode',
    slot: 'Enter Slot',
    Player1: 'Enter Name',
    gameId: 'Enter Team Lead Game ID',
    mobileNumber: 'Enter Mobile Number',
    aadhaarNumber: 'Enter Aadhaar Number',
    payment: 'Enter Payment Details',
    we: 'efef',
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <View style={styles.container}>
      {/* Static Header */}
      <View style={styles.header}> 
        <Text style={styles.title}>Register</Text>
      </View>

      {/* Scrollable Form Fields */}
      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {Object.keys(form).map((field) => (
          <View key={field} style={styles.inputContainer}>
            <Text style={styles.label}>
              {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}
            </Text>
            <TextInput
              style={styles.input}
              value={form[field]}
              onChangeText={(value) => handleChange(field, value)}
              placeholder={placeholders[field]}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the full height is used
    backgroundColor: '#f5f5f5',
    padding:0,
  },
  header: {
    backgroundColor: '#f5a623', padding: 30, alignItems: 'left',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingTop:30,
    color: '#000',
  },
  form: {
    flex: 1,
    paddingHorizontal: 30,
    marginTop: 15,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
  },
});

export default RegistrationForm;
