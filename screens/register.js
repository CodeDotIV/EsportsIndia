import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const RegistrationForm = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { mode, team } = route.params || {};

  const [form, setForm] = useState({
    mode: mode || '',
    team: team || '',
    firstPlayer: { name: '', gameId: '', mobile: '', email: '', aadhaar: '' },
    secondPlayer: { name: '', gameId: '', mobile: '', email: '', aadhaar: '' },
    thirdPlayer: { name: '', gameId: '', mobile: '', email: '', aadhaar: '' },
    fourthPlayer: { name: '', gameId: '', mobile: '', email: '', aadhaar: '' },
    payment: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (player, field, value) => {
    if (player === 'payment') {
      setForm((prev) => ({ ...prev, payment: value }));
    } else {
      setForm((prev) => ({
        ...prev,
        [player]: { ...prev[player], [field]: value },
      }));
    }
  };

  const validateForm = () => {
    const details = form.firstPlayer;
    for (let field in details) {
      if (!details[field]) {
        Alert.alert('Error', `Please fill all required fields for ${team === 'Solo' ? 'Player' : 'First Player'}`);
        return false;
      }
    }
    return true;
  };

  const handlePaymentAndSubmit = async () => {
    if (isSubmitting) return;
    if (!validateForm()) return;

    // ✅ Open Razorpay Payment Link
    Linking.openURL('https://rzp.io/rzp/4u7btCQi');  // Replace this with your actual Razorpay link

    // ✅ Auto-fill payment field as "Paid via Razorpay"
    setForm((prev) => ({ ...prev, payment: 'Paid via Razorpay' }));

    // ✅ Auto-submit after small delay (to give time to complete payment)
    setTimeout(() => {
      handleSubmit();
    }, 500000);  // You can increase delay if needed (in milliseconds)
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!form.payment) {
      Alert.alert('Error', 'Please complete the payment first.');
      return;
    }

    setIsSubmitting(true);

    let payload = {
      mode: form.mode,
      team: form.team,
      payment: form.payment,
    };

    if (team === 'Solo' || team === 'Duo' || team === 'Squad') {
      payload = {
        ...payload,
        firstPlayer_name: form.firstPlayer.name,
        firstPlayer_gameId: form.firstPlayer.gameId,
        firstPlayer_mobile: form.firstPlayer.mobile,
        firstPlayer_email: form.firstPlayer.email,
        firstPlayer_aadhaar: form.firstPlayer.aadhaar,
      };
    }

    if (team === 'Duo' || team === 'Squad') {
      payload = {
        ...payload,
        secondPlayer_name: form.secondPlayer.name,
        secondPlayer_gameId: form.secondPlayer.gameId,
        secondPlayer_mobile: form.secondPlayer.mobile,
        secondPlayer_email: form.secondPlayer.email,
        secondPlayer_aadhaar: form.secondPlayer.aadhaar,
      };
    }

    if (team === 'Squad') {
      payload = {
        ...payload,
        thirdPlayer_name: form.thirdPlayer.name,
        thirdPlayer_gameId: form.thirdPlayer.gameId,
        thirdPlayer_mobile: form.thirdPlayer.mobile,
        thirdPlayer_email: form.thirdPlayer.email,
        thirdPlayer_aadhaar: form.thirdPlayer.aadhaar,
        fourthPlayer_name: form.fourthPlayer.name,
        fourthPlayer_gameId: form.fourthPlayer.gameId,
        fourthPlayer_mobile: form.fourthPlayer.mobile,
        fourthPlayer_email: form.fourthPlayer.email,
        fourthPlayer_aadhaar: form.fourthPlayer.aadhaar,
      };
    }

    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbxYpQvWEoJeZVyFWDoTJhRwZfylw6fj0D6niqbuEWER7XxLyg4H2x-z1y-5i-vRxljGkA/exec',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const resText = await response.text();
      if (response.ok && resText === 'Success') {
        Alert.alert('✅ Success', 'Form submitted!');
        setForm({
          mode: mode || '',
          team: team || '',
          firstPlayer: { name: '', gameId: '', mobile: '', email: '', aadhaar: '' },
          secondPlayer: { name: '', gameId: '', mobile: '', email: '', aadhaar: '' },
          thirdPlayer: { name: '', gameId: '', mobile: '', email: '', aadhaar: '' },
          fourthPlayer: { name: '', gameId: '', mobile: '', email: '', aadhaar: '' },
          payment: '',
        });
      } else {
        Alert.alert('❌ Error', 'Failed: ' + resText);
      }
    } catch (error) {
      Alert.alert('❌ Error', 'Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPlayerFields = (label, key, required) => (
    <View style={styles.section} key={key}>
      <Text style={styles.sectionTitle}>{label}</Text>
      {['name', 'gameId', 'mobile', 'email', 'aadhaar'].map((field) => (
        <View style={styles.inputContainer} key={`${key}-${field}`}>
          <Text style={styles.label}>
            {field.charAt(0).toUpperCase() + field.slice(1)}
            {required && <Text style={{ color: 'red' }}> *</Text>}
          </Text>
          <TextInput
            style={styles.input}
            value={form[key][field]}
            onChangeText={(value) => handleChange(key, field, value)}
            placeholder={`Enter ${field}`}
          />
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Register</Text>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mode</Text>
          <TextInput style={[styles.input, styles.disabled]} value={form.mode} editable={false} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Team</Text>
          <TextInput style={[styles.input, styles.disabled]} value={form.team} editable={false} />
        </View>

        {renderPlayerFields(team === 'Solo' ? 'Player Details' : 'First Player', 'firstPlayer', true)}
        {team === 'Duo' || team === 'Squad' ? renderPlayerFields('Second Player', 'secondPlayer', false) : null}
        {team === 'Squad' ? renderPlayerFields('Third Player', 'thirdPlayer', false) : null}
        {team === 'Squad' ? renderPlayerFields('Fourth Player', 'fourthPlayer', false) : null}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Payment <Text style={{ color: 'red' }}>*</Text></Text>
          <TextInput
            style={styles.input}
            value={form.payment}
            onChangeText={(value) => handleChange('payment', null, value)}
            placeholder="Payment Status (auto-filled)"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && { opacity: 0.6 }]}
          onPress={handlePaymentAndSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitText}>{isSubmitting ? 'Processing...' : 'Pay & Submit'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5a623', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  backButton: { position: 'absolute', left: 15, top: 55, zIndex: 10 },
  title: { flex: 1, fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#000' },
  form: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, backgroundColor: 'white' },
  disabled: { backgroundColor: '#e0e0e0', color: '#777' },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  submitButton: { backgroundColor: '#f5a623', padding: 15, borderRadius: 8, alignItems: 'center', marginVertical: 20 },
  submitText: { fontSize: 16, fontWeight: 'bold', color: 'white' },
});

export default RegistrationForm;
