import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { wp, hp, rf, rs } from '../../../utils/responsive';

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
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Ionicons name="person" size={rs(18)} color="#FFD700" />
          <Text style={styles.sectionTitle}>{label}</Text>
          {isRequired && <Text style={styles.requiredBadge}>Required</Text>}
        </View>
      </View>

      {['name', 'gameId', 'mobile', 'email', 'aadhaar'].map((field) => {
        const fieldIcons = {
          name: 'person-outline',
          gameId: 'id-card-outline',
          mobile: 'call-outline',
          email: 'mail-outline',
          aadhaar: 'document-text-outline',
        };
        return (
          <View style={styles.inputContainer} key={field}>
            <View style={styles.labelContainer}>
              <Ionicons name={fieldIcons[field]} size={rs(14)} color="#9CA3AF" />
              <Text style={styles.label}>
                {field === 'gameId' ? 'Game ID' : field === 'aadhaar' ? 'Aadhaar Number' : field.charAt(0).toUpperCase() + field.slice(1)}
                {isRequired && <Text style={styles.required}> *</Text>}
              </Text>
            </View>
            <TextInput
              placeholder={`Enter ${field === 'gameId' ? 'Game ID' : field === 'aadhaar' ? 'Aadhaar Number' : field}`}
              placeholderTextColor="#6B7280"
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
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Tournament Register</Text>
      </View>
      <View style={styles.headerLine} />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tournament Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <Ionicons name="information-circle" size={rs(20)} color="#FFD700" />
            <Text style={styles.infoCardTitle}>Tournament Details</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="game-controller" size={rs(16)} color="#9CA3AF" />
              <Text style={styles.infoLabel}>Esport</Text>
              <Text style={styles.infoValue}>{game || 'N/A'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="layers" size={rs(16)} color="#9CA3AF" />
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{category || 'N/A'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="map" size={rs(16)} color="#9CA3AF" />
              <Text style={styles.infoLabel}>Map</Text>
              <Text style={styles.infoValue}>{map || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Player Fields */}
        {renderPlayerFields('firstPlayer', 'Player 1', true)}
        {renderPlayerFields('secondPlayer', 'Player 2')}
        {renderPlayerFields('thirdPlayer', 'Player 3')}
        {renderPlayerFields('fourthPlayer', 'Player 4')}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={submitting ? "hourglass" : "checkmark-circle"} 
            size={rs(20)} 
            color="#000000" 
          />
          <Text style={styles.submitText}>
            {submitting ? 'Submitting...' : 'Submit Registration'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141E30',
  },
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
  formContent: {
    flexGrow: 1,
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(4),
  },
  infoCard: {
    backgroundColor: '#1A1F2E',
    borderRadius: rs(12),
    padding: wp(4),
    marginBottom: hp(3),
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
    paddingBottom: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: '#2A3441',
  },
  infoCardTitle: {
    fontSize: rf(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: wp(2),
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: hp(1.5),
    backgroundColor: '#0F1419',
    padding: wp(3),
    borderRadius: rs(8),
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  infoLabel: {
    fontSize: rf(11),
    color: '#9CA3AF',
    marginTop: hp(0.5),
    marginBottom: hp(0.3),
  },
  infoValue: {
    fontSize: rf(14),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  inputContainer: {
    marginBottom: hp(2),
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.8),
  },
  label: {
    fontSize: rf(14),
    fontWeight: '600',
    color: '#D1D5DB',
    marginLeft: wp(1.5),
  },
  required: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  requiredBadge: {
    fontSize: rf(10),
    color: '#FF6B6B',
    fontWeight: '600',
    marginLeft: wp(2),
    backgroundColor: '#2A1F1F',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: rs(4),
  },
  input: {
    borderWidth: 1,
    borderColor: '#2A3441',
    borderRadius: rs(10),
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
    backgroundColor: '#1A1F2E',
    color: '#FFFFFF',
    fontSize: rf(14),
  },
  section: {
    marginTop: hp(3),
    backgroundColor: '#1A1F2E',
    borderRadius: rs(12),
    padding: wp(4),
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  sectionHeader: {
    marginBottom: hp(2),
    paddingBottom: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: '#2A3441',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: rf(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: wp(2),
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(6),
    borderRadius: rs(12),
    marginTop: hp(3),
    marginBottom: hp(2),
    elevation: 4,
    //shadowColor: '#FFD700',
    //shadowOffset: { width: 0, height: 2 },
    //shadowOpacity: 0.3,
    //shadowRadius: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: rf(16),
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: wp(2),
  },
});
