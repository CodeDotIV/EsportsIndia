import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, SafeAreaView, Platform, Image, Linking, Modal, Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { getItem, setItem } from '../../utils/storageHelper';
import { getOrCreatePlayerId } from '../../utils/playerId';
import { wp, hp, rf, rs } from '../../utils/responsive';
import { supabase } from '../../services/supabase';
import {
  loadProfileFromCloud,
  mergeProfileWithAuthUser,
  syncProfileToCloud,
} from '../../services/userProfile';

// Country data with timezones
const COUNTRIES = [
  { name: 'India', code: 'IN', timezone: 'IST (UTC+5:30)' },
  { name: 'United States', code: 'US', timezone: 'EST/PST (UTC-5/-8)' },
  { name: 'United Kingdom', code: 'GB', timezone: 'GMT (UTC+0)' },
  { name: 'Canada', code: 'CA', timezone: 'EST/PST (UTC-5/-8)' },
  { name: 'Australia', code: 'AU', timezone: 'AEST (UTC+10)' },
  { name: 'Germany', code: 'DE', timezone: 'CET (UTC+1)' },
  { name: 'France', code: 'FR', timezone: 'CET (UTC+1)' },
  { name: 'Japan', code: 'JP', timezone: 'JST (UTC+9)' },
  { name: 'China', code: 'CN', timezone: 'CST (UTC+8)' },
  { name: 'Brazil', code: 'BR', timezone: 'BRT (UTC-3)' },
  { name: 'Russia', code: 'RU', timezone: 'MSK (UTC+3)' },
  { name: 'South Korea', code: 'KR', timezone: 'KST (UTC+9)' },
  { name: 'Mexico', code: 'MX', timezone: 'CST (UTC-6)' },
  { name: 'Italy', code: 'IT', timezone: 'CET (UTC+1)' },
  { name: 'Spain', code: 'ES', timezone: 'CET (UTC+1)' },
  { name: 'Netherlands', code: 'NL', timezone: 'CET (UTC+1)' },
  { name: 'Sweden', code: 'SE', timezone: 'CET (UTC+1)' },
  { name: 'Poland', code: 'PL', timezone: 'CET (UTC+1)' },
  { name: 'Turkey', code: 'TR', timezone: 'TRT (UTC+3)' },
  { name: 'Saudi Arabia', code: 'SA', timezone: 'AST (UTC+3)' },
  { name: 'United Arab Emirates', code: 'AE', timezone: 'GST (UTC+4)' },
  { name: 'Singapore', code: 'SG', timezone: 'SGT (UTC+8)' },
  { name: 'Malaysia', code: 'MY', timezone: 'MYT (UTC+8)' },
  { name: 'Indonesia', code: 'ID', timezone: 'WIB (UTC+7)' },
  { name: 'Philippines', code: 'PH', timezone: 'PHT (UTC+8)' },
  { name: 'Thailand', code: 'TH', timezone: 'ICT (UTC+7)' },
  { name: 'Vietnam', code: 'VN', timezone: 'ICT (UTC+7)' },
  { name: 'Bangladesh', code: 'BD', timezone: 'BST (UTC+6)' },
  { name: 'Pakistan', code: 'PK', timezone: 'PKT (UTC+5)' },
  { name: 'Nepal', code: 'NP', timezone: 'NPT (UTC+5:45)' },
  { name: 'Sri Lanka', code: 'LK', timezone: 'SLST (UTC+5:30)' },
  { name: 'South Africa', code: 'ZA', timezone: 'SAST (UTC+2)' },
  { name: 'Egypt', code: 'EG', timezone: 'EET (UTC+2)' },
  { name: 'Nigeria', code: 'NG', timezone: 'WAT (UTC+1)' },
  { name: 'Kenya', code: 'KE', timezone: 'EAT (UTC+3)' },
  { name: 'Argentina', code: 'AR', timezone: 'ART (UTC-3)' },
  { name: 'Chile', code: 'CL', timezone: 'CLT (UTC-3)' },
  { name: 'Colombia', code: 'CO', timezone: 'COT (UTC-5)' },
  { name: 'Peru', code: 'PE', timezone: 'PET (UTC-5)' },
  { name: 'Other', code: 'OTHER', timezone: 'Custom' },
];

// Main languages
const LANGUAGES = [
  'English',
  'Hindi',
  'Spanish',
  'French',
  'German',
  'Chinese (Mandarin)',
  'Japanese',
  'Korean',
  'Arabic',
  'Portuguese',
  'Russian',
  'Italian',
];

const getInitials = (value) =>
  value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'U';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    name: '',
    email: '',
    playerId: '',
    authCreatedAt: '',
    phone: '',
    gender: '',
    location: '',
    bio: '',
    dateOfBirth: '',
    avatar: '',
    gamingUsername: '',
    favoriteGame: '',
    gamingPlatform: '',
    skillLevel: '',
    teamName: '',
    yearsOfGaming: '',
    preferredGameMode: '',
    country: '',
    timezone: '',
    language: 'English',
    instagram: '',
    twitter: '',
    discord: '',
    youtube: '',
    twitch: '',
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const isEditing = !profileSaved;
  const [loading, setLoading] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const readOnlyInputStyle =
    Platform.OS === 'web' && !isEditing ? styles.readOnlyInput : null;
  const inputStyle = [styles.input, readOnlyInputStyle];
  const handleProfileInputFocus = (event) => {
    if (Platform.OS === 'web' && !isEditing) {
      event.target.blur();
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const localData = await getItem('user');
      const localProfile = localData ? JSON.parse(localData) : {};
      let authUser = null;
      let cloudProfile = null;
      if (supabase) {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Failed to load cloud profile:', error);
          Alert.alert('Cloud profile unavailable', 'Showing profile data saved on this device.');
        } else {
          authUser = data.user;
          if (authUser) {
            try {
              cloudProfile = await loadProfileFromCloud(authUser);
            } catch (cloudError) {
              console.error('Failed to load profile from Supabase:', cloudError);
              Alert.alert(
                'Cloud profile unavailable',
                'Showing profile data saved on this device. Check that the profiles table migration has been applied.'
              );
            }
          }
        }
      }

      const savedProfile = mergeProfileWithAuthUser(localProfile, authUser, cloudProfile);
      const playerId = savedProfile.id
        ? await getOrCreatePlayerId(
            savedProfile.id,
            savedProfile.playerId,
            savedProfile.authCreatedAt
          )
        : savedProfile.playerId || '';
      if (playerId && (savedProfile.playerId !== playerId || authUser)) {
        savedProfile.playerId = playerId;
        await setItem('user', JSON.stringify(savedProfile));
      }

      setUser((currentUser) => ({
        ...Object.fromEntries(
          Object.entries(currentUser).map(([field, initialValue]) => {
            const value = savedProfile[field] ?? initialValue;
            return [
              field,
              value === null || value === undefined
                ? ''
                : field === 'yearsOfGaming'
                  ? value
                  : String(value),
            ];
          })
        ),
        id: savedProfile.id,
      }));
      setProfileSaved(savedProfile.profileCompleted === true);
    } catch (error) {
      console.error('Failed to load local profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (profileSaved) return;

    if (!user.name.trim()) {
      Alert.alert('Validation', 'Name is required.');
      return;
    }

    if (loading) {
      Alert.alert('Please wait', 'A save operation is already in progress.');
      return;
    }

    try {
      setLoading(true);

      let formattedDateOfBirth = '';
      if (user.dateOfBirth && user.dateOfBirth.trim()) {
        const dateStr = user.dateOfBirth.trim();
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (dateRegex.test(dateStr)) {
          const date = new Date(dateStr);
          const [year, month, day] = dateStr.split('-').map(Number);
          const isValidDate = 
            !isNaN(date.getTime()) &&
            date.getFullYear() === year &&
            date.getMonth() + 1 === month &&
            date.getDate() === day &&
            year >= 1900 &&
            year <= new Date().getFullYear() &&
            month >= 1 &&
            month <= 12 &&
            day >= 1 &&
            day <= 31;
          
          if (isValidDate) {
            formattedDateOfBirth = dateStr;
          } else {
            Alert.alert('Invalid Date', 'Please enter a valid date in YYYY-MM-DD format (e.g., 1990-01-15)');
            setLoading(false);
            return;
          }
        } else {
          Alert.alert('Invalid Date Format', 'Please enter date in YYYY-MM-DD format (e.g., 1990-01-15)');
          setLoading(false);
          return;
        }
      }

      let formattedYearsOfGaming = '';
      if (user.yearsOfGaming !== null && user.yearsOfGaming !== undefined && user.yearsOfGaming !== '') {
        const yearsStr = user.yearsOfGaming.toString().trim();
        if (yearsStr) {
          const years = parseInt(yearsStr);
          if (!isNaN(years) && years >= 0 && years <= 100) {
            formattedYearsOfGaming = years;
          } else {
            Alert.alert('Invalid Years', 'Years of gaming must be a number between 0 and 100');
            setLoading(false);
            return;
          }
        }
      }

      const sanitizeField = (value) => {
        if (value === null || value === undefined) return '';
        const trimmed = String(value).trim();
        return trimmed;
      };

      const profileData = {
        profileCompleted: false,
        id: user.id,
        playerId: user.playerId,
        authCreatedAt: user.authCreatedAt,
        email: user.email,
        name: user.name.trim(),
        phone: sanitizeField(user.phone),
        gender: sanitizeField(user.gender) || '',
        location: sanitizeField(user.location),
        bio: sanitizeField(user.bio) || '',
        dateOfBirth: formattedDateOfBirth,
        avatar: sanitizeField(user.avatar) || '',
        gamingUsername: sanitizeField(user.gamingUsername),
        favoriteGame: sanitizeField(user.favoriteGame),
        gamingPlatform: user.gamingPlatform || '',
        skillLevel: user.skillLevel || '',
        teamName: sanitizeField(user.teamName),
        yearsOfGaming: formattedYearsOfGaming,
        preferredGameMode: user.preferredGameMode || '',
        country: sanitizeField(user.country),
        timezone: sanitizeField(user.timezone),
        language: user.language.trim() || 'English',
        instagram: sanitizeField(user.instagram),
        twitter: sanitizeField(user.twitter),
        discord: sanitizeField(user.discord),
        youtube: sanitizeField(user.youtube),
        twitch: sanitizeField(user.twitch),
      };

      await setItem('user', JSON.stringify(profileData));
      setUser(profileData);
      const completedProfile = { ...profileData, profileCompleted: true };
      try {
        await syncProfileToCloud(completedProfile);
      } catch (error) {
        console.error('Failed to sync profile to cloud:', error);
        Alert.alert(
          'Saved on this device',
          'Your profile was saved locally, but cloud sync failed. Please try saving again when connected.'
        );
        return;
      }

      setUser(completedProfile);
      setProfileSaved(true);
      try {
        await setItem('user', JSON.stringify(completedProfile));
      } catch (error) {
        console.error('Failed to save profile completion state locally:', error);
        Alert.alert(
          'Profile synced',
          'Your profile is saved to your account, but this device could not save its completion status.'
        );
        return;
      }
      Alert.alert('Success', 'Profile saved and synced to your account.');
    } catch (error) {
      console.error('Failed to save local profile:', error);
      Alert.alert('Error', 'Failed to save profile locally.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>My Profile</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => navigation.getParent()?.navigate('Settings')}
              style={styles.settingsButton}
              accessibilityRole="button"
              accessibilityLabel="Open settings"
            >
              <Ionicons name="settings-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView 
          style={styles.scrollContainer} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={Platform.OS !== 'web'}
          keyboardShouldPersistTaps="always"
          nestedScrollEnabled={true}
          bounces={true}
        >
            {/* Profile Header Card */}
            <View style={styles.profileHeader}>
              <View style={styles.avatarCircle}>
                {user.avatar ? (
                  <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarInitials}>
                    {getInitials(user.name || 'Player')}
                  </Text>
                )}
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user.name || 'User Name'}</Text>
                <View style={styles.playerIdRow}>
                  <Text style={styles.playerIdLabel}>Player ID</Text>
                  <Text
                    style={styles.playerId}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    selectable
                  >
                    {user.playerId || 'Generating ID...'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('Plans')}
                style={styles.profileUpgradeButton}
                accessibilityRole="button"
                accessibilityLabel="Upgrade from the free tier"
              >
                <Ionicons name="sparkles-outline" size={rs(13)} color="#141E30" />
                <Text style={styles.upgradeButtonText}>Upgrade</Text>
              </TouchableOpacity>
        </View>

            {/* Profile Form */}
        <View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    Full Name <Text style={{ color: '#FF6B6B' }}>*</Text>
                  </Text>
                  <TextInput
                    style={inputStyle}
                    onFocus={handleProfileInputFocus}
                    placeholder="Enter your full name"
                    placeholderTextColor="#999"
                    value={user.name}
                    onChangeText={(text) => setUser({ ...user, name: text })}
                    editable={isEditing}
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput
                    style={inputStyle}
                    onFocus={handleProfileInputFocus}
                    placeholder="Enter your phone number"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    value={user.phone}
                    onChangeText={(text) => setUser({ ...user, phone: text })}
                    editable={isEditing}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Gender</Text>
                  {isEditing ? (
                    <View style={styles.genderContainer}>
                      {['Male', 'Female', 'Other', 'Prefer not to say'].map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={[
                            styles.genderOption,
                            user.gender === option && styles.genderOptionSelected
                          ]}
                          onPress={() => setUser({ ...user, gender: option })}
                        >
                          <Text style={[
                            styles.genderOptionText,
                            user.gender === option && styles.genderOptionTextSelected
                          ]}>
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <TextInput
                      style={[inputStyle, styles.disabled]}
                      onFocus={handleProfileInputFocus}
                      value={user.gender || 'Not specified'}
                      editable={false}
                      placeholderTextColor="#999"
                    />
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Date of Birth</Text>
                  <TextInput
                    style={inputStyle}
                    onFocus={handleProfileInputFocus}
                    placeholder="YYYY-MM-DD (e.g., 1990-01-15)"
                    placeholderTextColor="#999"
                    value={user.dateOfBirth}
                    onChangeText={(text) => {
                      // Only allow valid date format characters
                      const cleaned = text.replace(/[^0-9-]/g, '');
                      // Auto-format as user types: YYYY-MM-DD
                      let formatted = cleaned;
                      if (cleaned.length > 4 && cleaned[4] !== '-') {
                        formatted = cleaned.slice(0, 4) + '-' + cleaned.slice(4);
                      }
                      if (formatted.length > 7 && formatted[7] !== '-') {
                        formatted = formatted.slice(0, 7) + '-' + formatted.slice(7);
                      }
                      // Limit to 10 characters (YYYY-MM-DD)
                      if (formatted.length <= 10) {
                        setUser({ ...user, dateOfBirth: formatted });
                      }
                    }}
                    editable={isEditing}
                    maxLength={10}
                    keyboardType="numeric"
                  />
                  {isEditing && (
                    <Text style={styles.helperText}>Format: YYYY-MM-DD (e.g., 1990-01-15)</Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Location</Text>
                  <TextInput
                    style={inputStyle}
                    onFocus={handleProfileInputFocus}
                    placeholder="Enter your location"
                    placeholderTextColor="#999"
                    value={user.location}
                    onChangeText={(text) => setUser({ ...user, location: text })}
                    editable={isEditing}
                  />
                </View>
              </View>

              {!profileSaved && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.saveButton, loading && styles.buttonDisabled]}
                    onPress={handleSave}
                    disabled={loading}
                  >
                    <Text style={styles.saveButtonText}>
                      {loading ? 'Saving...' : 'Save Profile'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

          </ScrollView>

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCountryPicker(false)}
        accessibilityViewIsModal={true}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={StyleSheet.absoluteFill}
            onPress={() => setShowCountryPicker(false)}
            accessible={false}
            accessibilityRole="none"
          />
          <View 
            style={styles.modalContent}
            accessible={true}
            importantForAccessibility="yes"
            accessibilityViewIsModal={true}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity 
                onPress={() => setShowCountryPicker(false)}
                accessible={true}
                accessibilityLabel="Close country picker"
                accessibilityRole="button"
              >
                <Ionicons name="close" size={rs(28)} color="#fff" />
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={user.country}
              onValueChange={(itemValue) => {
                const selectedCountry = COUNTRIES.find(c => c.name === itemValue);
                setUser({
                  ...user,
                  country: itemValue,
                  timezone: selectedCountry ? selectedCountry.timezone : ''
                });
                setShowCountryPicker(false);
              }}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              accessible={true}
            >
              <Picker.Item label="Select Country" value="" />
              {COUNTRIES.map((country) => (
                <Picker.Item key={country.code} label={`${country.name} (${country.timezone})`} value={country.name} />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>

      {/* Language Picker Modal */}
      <Modal
        visible={showLanguagePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLanguagePicker(false)}
        accessibilityViewIsModal={true}
        statusBarTranslucent={true}
        presentationStyle="overFullScreen"
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={StyleSheet.absoluteFill}
            onPress={() => setShowLanguagePicker(false)}
            accessible={false}
            accessibilityRole="none"
          />
          <View 
            style={styles.modalContent}
            accessible={true}
            importantForAccessibility="yes"
            accessibilityViewIsModal={true}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity 
                onPress={() => setShowLanguagePicker(false)}
                accessible={true}
                accessibilityLabel="Close language picker"
                accessibilityRole="button"
              >
                <Ionicons name="close" size={rs(28)} color="#fff" />
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={user.language}
              onValueChange={(itemValue) => {
                setUser({ ...user, language: itemValue });
                setShowLanguagePicker(false);
              }}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              accessible={true}
            >
              {LANGUAGES.map((lang) => (
                <Picker.Item key={lang} label={lang} value={lang} />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#141E30',
    ...(Platform.OS === 'web' && {
      height: '100vh',
      overflow: 'hidden',
    }),
  },
  gradient: {
    flex: 1,
    backgroundColor: '#141E30',
    ...(Platform.OS === 'web' && {
      height: '100%',
      minHeight: '100%',
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.5),
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
  },
  settingsButton: {
    padding: wp(1),
  },
  profileUpgradeButton: {
    position: 'absolute',
    top: hp(1),
    right: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    backgroundColor: '#FFD700',
    borderRadius: rs(8),
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.4),
    minHeight: 28,
  },
  upgradeButtonText: {
    color: '#141E30',
    fontSize: rf(10),
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      minHeight: 0,
    }),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(4),
    paddingTop: hp(2),
    flexGrow: 1,
    ...(Platform.OS === 'web' && {
      minHeight: 0,
    }),
  },
  profileHeader: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(4),
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    backgroundColor: '#1A1F2E',
    borderWidth: 1,
    borderColor: '#2A3441',
    borderRadius: rs(12),
    marginBottom: hp(2),
  },
  avatarCircle: {
    width: rs(72),
    height: rs(72),
    borderRadius: rs(36),
    backgroundColor: '#E97FA9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: rs(36),
  },
  avatarInitials: {
    fontSize: rf(24),
    fontWeight: 'bold',
    color: '#000',
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
    alignItems: 'flex-start',
    paddingRight: wp(2),
  },
  profileName: {
    fontSize: rf(22),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: hp(0.4),
    textAlign: 'left',
    flexShrink: 1,
  },
  playerIdRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
  },
  playerIdLabel: {
    color: '#9CA3AF',
    fontSize: rf(9),
    fontWeight: '600',
  },
  playerId: {
    flex: 1,
    minWidth: 0,
    fontSize: rf(9),
    lineHeight: rf(13),
    color: '#D1D5DB',
    textAlign: 'left',
    flexShrink: 1,
  },
  section: {
    backgroundColor: '#1A1F2E',
    borderWidth: 1,
    borderColor: '#2A3441',
    borderRadius: rs(12),
    padding: wp(4),
    marginTop: hp(1),
  },
  sectionTitle: {
    fontSize: rf(18),
    fontWeight: 'bold',
    marginBottom: hp(1.5),
    color: '#FFD700',
  },
  inputContainer: {
    marginBottom: hp(1.5),
  },
  label: {
    fontSize: rf(16),
    fontWeight: '600',
    marginBottom: hp(0.5),
    color: '#FFFFFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#2A3441',
    borderRadius: rs(8),
    padding: hp(1.2),
    backgroundColor: '#1A1F2E',
    color: '#FFFFFF',
    fontSize: rf(15),
  },
  readOnlyInput: {
    outlineStyle: 'none',
    cursor: 'default',
  },
  disabled: {
    backgroundColor: '#1A1F2E',
    color: '#999',
  },
  helperText: {
    fontSize: rf(11),
    color: '#999',
    marginTop: hp(0.3),
    fontStyle: 'italic',
  },
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: hp(0.5),
  },
  genderOption: {
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(4),
    borderRadius: rs(20),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: wp(2),
    marginBottom: hp(0.8),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  genderOptionSelected: {
    backgroundColor: '#f5a623',
    borderColor: '#f5a623',
  },
  genderOptionText: {
    color: '#fff',
    fontSize: rf(13),
    fontWeight: '500',
  },
  genderOptionTextSelected: {
    color: '#000',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: hp(3),
    paddingHorizontal: wp(2),
    gap: wp(3),
  },
  saveButton: {
    backgroundColor: '#f5a623',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
    borderRadius: rs(10),
    alignItems: 'center',
    marginBottom: hp(1),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#000',
    fontSize: rf(16),
    fontWeight: 'bold',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: hp(0.5),
  },
  optionButton: {
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(3.5),
    borderRadius: rs(20),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: wp(2),
    marginBottom: hp(0.8),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  optionButtonSelected: {
    backgroundColor: '#f5a623',
    borderColor: '#f5a623',
  },
  optionButtonText: {
    color: '#fff',
    fontSize: rf(12),
    fontWeight: '500',
  },
  optionButtonTextSelected: {
    color: '#000',
    fontWeight: 'bold',
  },
  socialIconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(1),
    paddingVertical: hp(1),
    columnGap: wp(2),
    rowGap: hp(1),
  },
  socialIconButton: {
    width: '30%',
    minHeight: 68,
    paddingVertical: hp(1),
    paddingHorizontal: wp(1),
    borderRadius: rs(10),
    borderWidth: 1,
    borderColor: '#2A3441',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    justifyContent: 'center',
    minWidth: 0,
    alignItems: 'center',
  },
  socialTileName: {
    color: '#D1D5DB',
    fontSize: rf(10),
    fontWeight: '600',
    marginTop: hp(0.25),
  },
  socialTileStatus: {
    color: '#9CA3AF',
    fontSize: rf(8),
    marginTop: hp(0.1),
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  socialIcon: {
    marginRight: wp(2.5),
  },
  timezoneDisplay: {
    fontSize: rf(12),
    color: '#f5a623',
    marginTop: hp(0.8),
    marginLeft: wp(1),
    fontStyle: 'italic',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: rs(10),
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: hp(5.5),
    marginTop: hp(0.5),
  },
  pickerButtonText: {
    fontSize: rf(15),
    color: '#fff',
    flex: 1,
  },
  pickerPlaceholder: {
    color: '#999',
  },
  sectionSubtitle: {
    fontSize: rf(12),
    color: '#ccc',
    marginBottom: hp(1.5),
    fontStyle: 'italic',
    marginTop: hp(-0.5),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: rs(20),
    borderTopRightRadius: rs(20),
    maxHeight: hp(60),
    paddingBottom: Platform.OS === 'ios' ? hp(2) : hp(1),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: rf(18),
    fontWeight: 'bold',
    color: '#fff',
  },
  picker: {
    backgroundColor: 'transparent',
    color: '#fff',
  },
  pickerItem: {
    color: '#fff',
    fontSize: rf(16),
  },
});
