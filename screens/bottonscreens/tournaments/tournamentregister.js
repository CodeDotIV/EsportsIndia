import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function TournamentRegister() {
  const route = useRoute();
  const navigation = useNavigation();
  const { game, map, category } = route.params ?? {};

  const [form, setForm] = useState({
    firstPlayer: { name: '', gameId: '', mobile: '', email: '', aadhaar: '' },
    secondPlayer: { name: '', gameId: '', mobile: '', email: '', aadhaar: '' },
    thirdPlayer: { name: '', gameId: '', mobile: '', email: '', aadhaar: '' },
    fourthPlayer: { name: '', gameId: '', mobile: '', email: '', aadhaar: '' },
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (playerKey, field, value) => {
    setForm((prev) => ({
      ...prev,
      [playerKey]: {
        ...prev[playerKey],
        [field]: value,
      },
    }));
  };

  const handleSubmit = () => {
    if (submitting) return;

    const { name, gameId, mobile, email, aadhaar } = form.firstPlayer;
    if (!name || !gameId || !mobile || !email || !aadhaar) {
      Alert.alert('Error', 'Please fill all required fields for Player 1');
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      Alert.alert('Success', 'Registration submitted!');
      setSubmitting(false);
      navigation.goBack();
    }, 1000);
  };

  const renderPlayerFields = (playerKey, label, isRequired = false) => (
    <View key={playerKey} style={styles.section}>
      <Text style={styles.sectionTitle}>{label}</Text>

      {['name', 'gameId', 'mobile', 'email', 'aadhaar'].map((field) => (
        <View style={styles.inputContainer} key={field}>
          <Text style={styles.label}>
            {field.charAt(0).toUpperCase() + field.slice(1)}{' '}
            {isRequired && <Text style={styles.required}>*</Text>}
          </Text>
          <TextInput
            placeholder={`Enter ${field}`}
            style={styles.input}
            keyboardType={
              field === 'mobile'
                ? 'phone-pad'
                : field === 'aadhaar'
                ? 'numeric'
                : field === 'email'
                ? 'email-address'
                : 'default'
            }
            maxLength={field === 'aadhaar' ? 12 : undefined}
            value={form[playerKey][field]}
            onChangeText={(text) => handleChange(playerKey, field, text)}
          />
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Tournament Register</Text>
      </View>

      <ScrollView style={styles.form}>
        {/* Auto-filled Fields */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Esport</Text>
          <TextInput value={game} editable={false} style={[styles.input, styles.disabled]} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <TextInput value={category} editable={false} style={[styles.input, styles.disabled]} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Map</Text>
          <TextInput value={map} editable={false} style={[styles.input, styles.disabled]} />
        </View>

        {/* Player Fields */}
        {renderPlayerFields('firstPlayer', 'Player 1', true)}
        {renderPlayerFields('secondPlayer', 'Player 2')}
        {renderPlayerFields('thirdPlayer', 'Player 3')}
        {renderPlayerFields('fourthPlayer', 'Player 4')}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitText}>
            {submitting ? 'Submitting...' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

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
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  inputContainer: {
    marginBottom: 15,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#000',
  },

  required: {
    color: 'red',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
  },

  disabled: {
    backgroundColor: '#e0e0e0',
    color: '#777',
  },

  section: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  submitButton: {
    backgroundColor: '#f5a623',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },

  submitText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
