import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { wp, hp, rf, rs } from '../utils/responsive';

const RegistrationForm = ({ route }) => {
  const { slot } = route.params; // Get the slot from navigation

  const [form, setForm] = React.useState({
    mode: 'Nusa - Duo',
    slot: slot, // Use the received slot
    player1: '',
    gameId: '',
    mobileNumber: '',
    aadhaarNumber: '',
    payment: '',
  });

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}> 
        <Text style={styles.title}>Register</Text>
      </View>

      <ScrollView
        style={styles.form}
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mode</Text>
          <TextInput style={[styles.input, styles.disabledInput]} value={form.mode} editable={false} />
        </SafeAreaView>

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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141E30' },
  header: {
    backgroundColor: '#1A1F2E',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#2A3441',
  },
  title: { fontSize: rf(20), fontWeight: 'bold', color: '#FFFFFF' },
  form: { flex: 1 },
  formContent: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2.5),
    paddingBottom: hp(4),
  },
  inputContainer: { marginBottom: hp(1.8) },
  label: { fontSize: rf(14), fontWeight: '600', marginBottom: hp(0.7), color: '#FFFFFF' },
  input: {
    minHeight: rs(46),
    borderWidth: 1,
    borderColor: '#34445C',
    borderRadius: rs(10),
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(1),
    backgroundColor: '#0F1419',
    color: '#FFFFFF',
    fontSize: rf(14),
  },
  disabledInput: { backgroundColor: '#202D42', color: '#9CA3AF' },
});

export default RegistrationForm;
