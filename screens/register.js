import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const RegistrationForm = () => {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    mode: '',
    Player1: '',
    gameId: '',
    mobileNumber: '',
    aadhaarNumber: '',
    payment: '',
    we: '',
    name: '',
  });

  const placeholders = {
    mode: 'Enter Mode',
    Player1: 'Enter Name',
    gameId: 'Enter Team Lead Game ID',
    mobileNumber: 'Enter Mobile Number',
    aadhaarNumber: 'Enter Aadhaar Number',
    payment: 'Enter Payment Details',
    we: 'efef',
    name: 'Enter Full Name',
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
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
    flex: 1, backgroundColor: '#f5f5f5', padding: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5a623',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 55,
    zIndex: 10,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
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
