import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { wp, hp, rf, rs } from '../utils/responsive';

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyC8bb14gmxo_xVHd3DzxwKCb6YHG3f1xWR5m-No-OiWs1Oso0nyz3doTOGEubg5fbHeA/exec";

const RegistrationForm = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { mode, team } = route.params || {};

  const [form, setForm] = useState({
    mode: mode || '',
    team: team || '',
    firstPlayer: { name: '', gameId: '', mobile: '', email: '' },
    secondPlayer: { name: '', gameId: '', mobile: '', email: '' },
    thirdPlayer: { name: '', gameId: '', mobile: '', email: '' },
    fourthPlayer: { name: '', gameId: '', mobile: '', email: '' },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (player, field, value) => {
    setForm((prev) => ({
      ...prev,
      [player]: { ...prev[player], [field]: value },
    }));
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());

  const validatePlayer = (playerKey, label, required = true) => {
    const p = form[playerKey];

    if (!required) return true;

    if (!p.name || !p.gameId || !p.mobile || !p.email) {
      Alert.alert("Error", `Please fill all fields for ${label}`);
      return false;
    }

    const mobileDigits = String(p.mobile).replace(/\D/g, "");
    if (mobileDigits.length < 8) {
      Alert.alert("Error", `${label} mobile number is invalid`);
      return false;
    }

    if (!isValidEmail(p.email)) {
      Alert.alert("Error", `${label} email is invalid`);
      return false;
    }

    return true;
  };

  const validateForm = () => {
    if (!validatePlayer("firstPlayer", team === "Solo" ? "Player" : "First Player", true)) return false;

    if (team === "Duo") {
      if (!validatePlayer("secondPlayer", "Second Player", true)) return false;
    }

    if (team === "Squad") {
      if (!validatePlayer("secondPlayer", "Second Player", true)) return false;
      if (!validatePlayer("thirdPlayer", "Third Player", true)) return false;
      if (!validatePlayer("fourthPlayer", "Fourth Player", true)) return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);

    let payload = {
      mode: form.mode,
      team: form.team,

      firstPlayer_name: form.firstPlayer.name,
      firstPlayer_gameId: form.firstPlayer.gameId,
      firstPlayer_mobile: form.firstPlayer.mobile,
      firstPlayer_email: form.firstPlayer.email,
    };

    if (team === "Duo" || team === "Squad") {
      payload = {
        ...payload,
        secondPlayer_name: form.secondPlayer.name,
        secondPlayer_gameId: form.secondPlayer.gameId,
        secondPlayer_mobile: form.secondPlayer.mobile,
        secondPlayer_email: form.secondPlayer.email,
      };
    }

    if (team === "Squad") {
      payload = {
        ...payload,
        thirdPlayer_name: form.thirdPlayer.name,
        thirdPlayer_gameId: form.thirdPlayer.gameId,
        thirdPlayer_mobile: form.thirdPlayer.mobile,
        thirdPlayer_email: form.thirdPlayer.email,

        fourthPlayer_name: form.fourthPlayer.name,
        fourthPlayer_gameId: form.fourthPlayer.gameId,
        fourthPlayer_mobile: form.fourthPlayer.mobile,
        fourthPlayer_email: form.fourthPlayer.email,
      };
    }

    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: {
          // CORS FIX for Expo Web
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      const resText = await response.text();

      if (response.ok && resText.trim() === "Success") {
        Alert.alert("✅ Success", "Form submitted!");

        setForm({
          mode: mode || '',
          team: team || '',
          firstPlayer: { name: '', gameId: '', mobile: '', email: '' },
          secondPlayer: { name: '', gameId: '', mobile: '', email: '' },
          thirdPlayer: { name: '', gameId: '', mobile: '', email: '' },
          fourthPlayer: { name: '', gameId: '', mobile: '', email: '' },
        });
      } else {
        Alert.alert("❌ Error", "Failed: " + resText);
      }
    } catch (err) {
      Alert.alert("❌ Error", "Network error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPlayerFields = (label, key, required) => (
    <View style={styles.section} key={key}>
      <Text style={styles.sectionTitle}>{label}</Text>

      {/* Name */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Name {required && <Text style={{ color: '#FF6B6B' }}> *</Text>}
        </Text>
        <TextInput
          style={styles.input}
          value={form[key].name}
          onChangeText={(value) => handleChange(key, "name", value)}
          placeholder="Enter name"
          placeholderTextColor="#999"
          autoCapitalize="words"
        />
      </View>

      {/* Game ID */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Game ID {required && <Text style={{ color: '#FF6B6B' }}> *</Text>}
        </Text>
        <TextInput
          style={styles.input}
          value={form[key].gameId}
          onChangeText={(value) => handleChange(key, "gameId", value)}
          placeholder="Enter game ID"
          placeholderTextColor="#999"
          autoCapitalize="none"
        />
      </View>

      {/* Mobile */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Mobile {required && <Text style={{ color: '#FF6B6B' }}> *</Text>}
        </Text>
        <TextInput
          style={styles.input}
          value={form[key].mobile}
          onChangeText={(value) => handleChange(key, "mobile", value)}
          placeholder="Enter mobile number"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
        />
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Email {required && <Text style={{ color: '#FF6B6B' }}> *</Text>}
        </Text>
        <TextInput
          style={styles.input}
          value={form[key].email}
          onChangeText={(value) => handleChange(key, "email", value)}
          placeholder="Enter email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Register</Text>
        </View>
        <View style={styles.headerLine} />
  
        {/* SCROLL */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: wp(5), paddingTop: hp(2), paddingBottom: hp(20) }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mode</Text>
            <TextInput style={[styles.input, styles.disabled]} value={form.mode} editable={false} />
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Team</Text>
            <TextInput style={[styles.input, styles.disabled]} value={form.team} editable={false} />
          </View>
  
          {renderPlayerFields(team === 'Solo' ? 'Player Details' : 'First Player', 'firstPlayer', true)}
          {team === 'Duo' || team === 'Squad'
            ? renderPlayerFields('Second Player', 'secondPlayer', team !== "Solo")
            : null}
          {team === 'Squad' ? renderPlayerFields('Third Player', 'thirdPlayer', true) : null}
          {team === 'Squad' ? renderPlayerFields('Fourth Player', 'fourthPlayer', true) : null}
  
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitText}>{isSubmitting ? "Processing..." : "Submit"}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
  
};

export default RegistrationForm;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141E30' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '',
    padding: 20,
  },
  backButton: {
    color: 'white',
    marginRight: 10,
    paddingTop: 40,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    paddingTop: 38,
  },
  headerLine: {
    height: 1,
    width: '100%',
    backgroundColor: '#FFD700',
    marginVertical: 5,
  },
  scrollView: {
    flex: 1,
  },

  form: { flex: 1 },

  // 🔥 This is the MAIN scroll fix
  scrollContent: {
    paddingBottom: hp(15),
  },

  inputContainer: { marginBottom: hp(2) },
  label: { fontSize: rf(16), fontWeight: '600', marginBottom: hp(0.5), color: '#FFFFFF' },

  input: {
    borderWidth: 1,
    borderColor: '#2A3441',
    borderRadius: rs(8),
    padding: hp(1.2),
    backgroundColor: '#1A1F2E',
    color: '#FFFFFF',
    fontSize: rf(15),
  },
  disabled: { backgroundColor: '#1A1F2E', color: '#999' },

  section: { marginTop: hp(2) },
  sectionTitle: { fontSize: rf(18), fontWeight: 'bold', marginBottom: hp(1), color: '#FFD700' },

  submitButton: {
    backgroundColor: '#FFD700',
    padding: hp(2),
    borderRadius: rs(8),
    alignItems: 'center',
    marginVertical: hp(2.5),
  },
  submitText: { fontSize: rf(16), fontWeight: 'bold', color: '#000' },
});
