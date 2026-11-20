import React, { useEffect, useRef, useState } from 'react';
import { 
  Animated, View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, SafeAreaView, Platform, Image, Linking, Modal, Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getItem, setItem, removeItem } from '../../utils/storageHelper';
import { signOut } from '../../services/supabaseAuth';
import { getOrCreatePlayerId } from '../../utils/playerId';
import { wp, hp, rf, rs } from '../../utils/responsive';

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

const FREE_PLAN_CUSTOMIZATIONS = [
  ['2', 'Backgrounds'],
  ['1', 'Profile frame'],
  ['1', 'Name style'],
  ['2', 'Themes'],
];

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

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
  const isFocused = useIsFocused();
  const upgradeOpacity = useRef(new Animated.Value(1)).current;
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
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(0);
  const SAVE_COOLDOWN_MS = 2000; // 2 seconds cooldown between saves

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    if (!isFocused) {
      upgradeOpacity.setValue(1);
      return undefined;
    }

    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(upgradeOpacity, {
          toValue: 0.45,
          duration: 850,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(upgradeOpacity, {
          toValue: 1,
          duration: 850,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    );

    blinkAnimation.start();
    return () => {
      blinkAnimation.stop();
      upgradeOpacity.setValue(1);
    };
  }, [isFocused, upgradeOpacity]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const localData = await getItem('user');
      if (localData) {
        const savedProfile = JSON.parse(localData);
        const playerId = savedProfile.id
          ? await getOrCreatePlayerId(
              savedProfile.id,
              savedProfile.playerId,
              savedProfile.authCreatedAt
            )
          : savedProfile.playerId || '';
        if (playerId && savedProfile.playerId !== playerId) {
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
      }
    } catch (error) {
      console.error('Failed to load local profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user.name.trim()) {
      Alert.alert('Validation', 'Name is required.');
      return;
    }

    const now = Date.now();
    const timeSinceLastSave = now - lastSaveTime;

    if (timeSinceLastSave < SAVE_COOLDOWN_MS) {
      const remainingSeconds = ((SAVE_COOLDOWN_MS - timeSinceLastSave) / 1000).toFixed(1);
      Alert.alert('Please wait', `Please wait ${remainingSeconds} seconds before saving again.`);
      return;
    }

    if (loading) {
      Alert.alert('Please wait', 'A save operation is already in progress.');
      return;
    }

    try {
      setLoading(true);
      setLastSaveTime(now);

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
      setIsEditing(false);
      Alert.alert('Success', 'Profile saved locally!');
    } catch (error) {
      console.error('Failed to save local profile:', error);
      Alert.alert('Error', 'Failed to save profile locally.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (signingOut) return;

    setSigningOut(true);
    try {
      await signOut();
      await removeItem('user');

      const rootNavigation =
        navigation.getParent()?.getParent() || navigation.getParent() || navigation;
      rootNavigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    } catch (error) {
      console.error('Failed to sign out:', error);
      const message = error instanceof Error ? error.message : 'Please try again.';
      if (Platform.OS === 'web') {
        window.alert(`Sign out failed: ${message}`);
      } else {
        Alert.alert('Sign out failed', message);
      }
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>My Profile</Text>
          <View style={styles.headerRight}>
            {!isEditing ? (
              <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editIconButton}>
                <Ionicons name="create-outline" size={22} color="white" />
              </TouchableOpacity>
            ) : null}
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
                <Text
                  style={styles.playerIdLabel}
                >
                  PLAYER ID
                </Text>
                <Text
                  style={styles.playerId}
                  selectable
                >
                  {user.playerId || 'Generating ID...'}
                </Text>
                {user.gamingUsername ? (
                  <View style={styles.gamingBadge}>
                    <Ionicons name="game-controller-outline" size={rs(14)} color="#FFD700" />
                    <Text style={styles.gamingBadgeText}>{user.gamingUsername}</Text>
                  </View>
                ) : null}

                {isEditing ? (
                  <View style={styles.profileBioInput}>
                    <Text style={styles.label}>Bio</Text>
                    <TextInput
                      style={[styles.input, { minHeight: hp(12), textAlignVertical: 'top', paddingTop: hp(1.2) }]}
                      placeholder="Tell us about yourself..."
                      placeholderTextColor="#999"
                      value={user.bio || ''}
                      onChangeText={(text) => {
                        if (text.length <= 500) {
                          setUser({ ...user, bio: text });
                        }
                      }}
                      editable={isEditing}
                      multiline
                      numberOfLines={3}
                      maxLength={500}
                    />
                    <Text style={styles.charCount}>{(user.bio || '').length}/500</Text>
                  </View>
                ) : user.bio ? (
                  <View style={styles.bioContainer}>
                    <Text style={styles.bioText}>{user.bio}</Text>
                  </View>
                ) : null}
              </View>
        </View>
      
            <View style={styles.membershipCard}>
              <View style={styles.membershipHeader}>
                <View style={styles.membershipIcon}>
                  <Ionicons name="person-outline" size={rs(24)} color="#9CA3AF" />
                </View>
                <View style={styles.membershipDetails}>
                  <Text style={styles.membershipLabel}>CURRENT PLAN</Text>
                  <Text style={styles.membershipName}>BASIC</Text>
                  <Text style={styles.membershipSubtitle}>Basic Player · ₹0</Text>
                </View>
                <AnimatedTouchableOpacity
                  style={[styles.membershipUpgrade, { opacity: upgradeOpacity }]}
                  onPress={() => navigation.navigate('Plans')}
                  accessibilityRole="button"
                  accessibilityLabel="Upgrade from the Basic plan"
                >
                  <Text style={styles.membershipUpgradeText}>UPGRADE</Text>
                </AnimatedTouchableOpacity>
              </View>
              <View style={styles.membershipDivider} />
              <Text style={styles.customizationTitle}>Your customization limits</Text>
              <View style={styles.customizationGrid}>
                {FREE_PLAN_CUSTOMIZATIONS.map(([count, label]) => (
                  <View key={label} style={styles.customizationItem}>
                    <Text style={styles.customizationCount}>{count}</Text>
                    <Text style={styles.customizationLabel}>{label}</Text>
                  </View>
                ))}
              </View>
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
                    style={styles.input}
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
                    style={styles.input}
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
                      style={[styles.input, styles.disabled]}
                      value={user.gender || 'Not specified'}
                      editable={false}
                      placeholderTextColor="#999"
                    />
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Date of Birth</Text>
                  <TextInput
                    style={styles.input}
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
                    style={styles.input}
                    placeholder="Enter your location"
                    placeholderTextColor="#999"
                    value={user.location}
                    onChangeText={(text) => setUser({ ...user, location: text })}
                    editable={isEditing}
                  />
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Gaming Profile</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Gaming Username</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your gaming username"
                    placeholderTextColor="#999"
                    value={user.gamingUsername}
                    onChangeText={(text) => setUser({ ...user, gamingUsername: text })}
                    editable={isEditing}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Favorite Game</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your favorite game"
                    placeholderTextColor="#999"
                    value={user.favoriteGame}
                    onChangeText={(text) => setUser({ ...user, favoriteGame: text })}
                    editable={isEditing}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Gaming Platform</Text>
                  {isEditing ? (
                    <View style={styles.optionsContainer}>
                      {['PC', 'Mobile', 'Console', 'PC & Mobile', 'PC & Console', 'Mobile & Console', 'All Platforms'].map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={[
                            styles.optionButton,
                            user.gamingPlatform === option && styles.optionButtonSelected
                          ]}
                          onPress={() => setUser({ ...user, gamingPlatform: option })}
                        >
                          <Text style={[
                            styles.optionButtonText,
                            user.gamingPlatform === option && styles.optionButtonTextSelected
                          ]}>
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <TextInput
                      style={[styles.input, styles.disabled]}
                      value={user.gamingPlatform || 'Not specified'}
                      editable={false}
                      placeholderTextColor="#999"
                    />
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Skill Level</Text>
                  {isEditing ? (
                    <View style={styles.optionsContainer}>
                      {['Beginner', 'Intermediate', 'Advanced', 'Professional'].map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={[
                            styles.optionButton,
                            user.skillLevel === option && styles.optionButtonSelected
                          ]}
                          onPress={() => setUser({ ...user, skillLevel: option })}
                        >
                          <Text style={[
                            styles.optionButtonText,
                            user.skillLevel === option && styles.optionButtonTextSelected
                          ]}>
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <TextInput
                      style={[styles.input, styles.disabled]}
                      value={user.skillLevel || 'Not specified'}
                      editable={false}
                      placeholderTextColor="#999"
                    />
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Team/Clan Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your team or clan name"
                    placeholderTextColor="#999"
                    value={user.teamName}
                    onChangeText={(text) => setUser({ ...user, teamName: text })}
                    editable={isEditing}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Years of Gaming Experience</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter years (e.g., 5)"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={
                      user.yearsOfGaming === null || user.yearsOfGaming === undefined
                        ? ''
                        : user.yearsOfGaming.toString()
                    }
                    onChangeText={(text) => setUser({ ...user, yearsOfGaming: text })}
                    editable={isEditing}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Preferred Game Mode</Text>
                  {isEditing ? (
                    <View style={styles.optionsContainer}>
                      {['Solo', 'Duo', 'Squad', 'Tournament', 'All'].map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={[
                            styles.optionButton,
                            user.preferredGameMode === option && styles.optionButtonSelected
                          ]}
                          onPress={() => setUser({ ...user, preferredGameMode: option })}
                        >
                          <Text style={[
                            styles.optionButtonText,
                            user.preferredGameMode === option && styles.optionButtonTextSelected
                          ]}>
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <TextInput
                      style={[styles.input, styles.disabled]}
                      value={user.preferredGameMode || 'Not specified'}
                      editable={false}
                      placeholderTextColor="#999"
                    />
                  )}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Social Media</Text>
                
                {!isEditing ? (
                  <View style={styles.socialIconsContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        if (user.instagram) {
                          const url = user.instagram.startsWith('http') ? user.instagram : `https://instagram.com/${user.instagram.replace('@', '')}`;
                          Linking.openURL(url).catch(err => Alert.alert('Error', 'Could not open Instagram'));
                        }
                      }}
                      disabled={!user.instagram}
                      style={styles.socialIconButton}
                      accessibilityRole="button"
                      accessibilityLabel={`Instagram ${user.instagram ? 'linked' : 'not linked'}`}
                    >
                      <Ionicons
                        name="logo-instagram"
                        size={rs(22)}
                        color={user.instagram ? '#E4405F' : '#64748B'}
                      />
                      <Text style={styles.socialTileName}>Instagram</Text>
                      <Text style={styles.socialTileStatus}>{user.instagram ? 'Linked' : 'Not linked'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        if (user.twitter) {
                          const url = user.twitter.startsWith('http') ? user.twitter : `https://twitter.com/${user.twitter.replace('@', '')}`;
                          Linking.openURL(url).catch(err => Alert.alert('Error', 'Could not open Twitter'));
                        }
                      }}
                      disabled={!user.twitter}
                      style={styles.socialIconButton}
                      accessibilityRole="button"
                      accessibilityLabel={`Twitter ${user.twitter ? 'linked' : 'not linked'}`}
                    >
                      <Ionicons
                        name="logo-twitter"
                        size={rs(22)}
                        color={user.twitter ? '#1DA1F2' : '#64748B'}
                      />
                      <Text style={styles.socialTileName}>Twitter</Text>
                      <Text style={styles.socialTileStatus}>{user.twitter ? 'Linked' : 'Not linked'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        if (user.discord) {
                          Alert.alert('Discord', `Discord: ${user.discord}\n\nCopy this to add as friend on Discord.`);
                        }
                      }}
                      disabled={!user.discord}
                      style={styles.socialIconButton}
                      accessibilityRole="button"
                      accessibilityLabel={`Discord ${user.discord ? 'linked' : 'not linked'}`}
                    >
                      <Ionicons
                        name="logo-discord"
                        size={rs(22)}
                        color={user.discord ? '#5865F2' : '#64748B'}
                      />
                      <Text style={styles.socialTileName}>Discord</Text>
                      <Text style={styles.socialTileStatus}>{user.discord ? 'Linked' : 'Not linked'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        if (user.youtube) {
                          const url = user.youtube.startsWith('http') ? user.youtube : `https://youtube.com/@${user.youtube.replace('@', '').replace(/ /g, '')}`;
                          Linking.openURL(url).catch(err => Alert.alert('Error', 'Could not open YouTube'));
                        }
                      }}
                      disabled={!user.youtube}
                      style={styles.socialIconButton}
                      accessibilityRole="button"
                      accessibilityLabel={`YouTube ${user.youtube ? 'linked' : 'not linked'}`}
                    >
                      <Ionicons
                        name="logo-youtube"
                        size={rs(22)}
                        color={user.youtube ? '#FF0000' : '#64748B'}
                      />
                      <Text style={styles.socialTileName}>YouTube</Text>
                      <Text style={styles.socialTileStatus}>{user.youtube ? 'Linked' : 'Not linked'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        if (user.twitch) {
                          const url = user.twitch.startsWith('http') ? user.twitch : `https://twitch.tv/${user.twitch.replace('@', '').replace(/ /g, '')}`;
                          Linking.openURL(url).catch(err => Alert.alert('Error', 'Could not open Twitch'));
                        }
                      }}
                      disabled={!user.twitch}
                      style={styles.socialIconButton}
                      accessibilityRole="button"
                      accessibilityLabel={`Twitch ${user.twitch ? 'linked' : 'not linked'}`}
                    >
                      <Ionicons
                        name="logo-twitch"
                        size={rs(22)}
                        color={user.twitch ? '#9146FF' : '#64748B'}
                      />
                      <Text style={styles.socialTileName}>Twitch</Text>
                      <Text style={styles.socialTileStatus}>{user.twitch ? 'Linked' : 'Not linked'}</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <Text style={styles.sectionSubtitle}>Paste your profile links. Click icons to open profiles.</Text>
                    
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Instagram</Text>
                      <View style={styles.socialRow}>
                        <TouchableOpacity
                          onPress={() => {
                            if (user.instagram) {
                              const url = user.instagram.startsWith('http') ? user.instagram : `https://instagram.com/${user.instagram.replace('@', '')}`;
                              Linking.openURL(url).catch(err => Alert.alert('Error', 'Could not open Instagram'));
                            }
                          }}
                          disabled={!user.instagram}
                        >
                          <Ionicons 
                            name="logo-instagram" 
                            size={rs(24)} 
                            color={user.instagram ? "#E4405F" : "#666"} 
                            style={styles.socialIcon} 
                          />
                        </TouchableOpacity>
                        <TextInput
                          style={styles.input}
                          placeholder="Instagram profile URL or @username"
                          placeholderTextColor="#999"
                          value={user.instagram}
                          onChangeText={(text) => setUser({ ...user, instagram: text })}
                          editable={isEditing}
                          autoCapitalize="none"
                        />
                      </View>
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Twitter</Text>
                      <View style={styles.socialRow}>
                        <TouchableOpacity
                          onPress={() => {
                            if (user.twitter) {
                              const url = user.twitter.startsWith('http') ? user.twitter : `https://twitter.com/${user.twitter.replace('@', '')}`;
                              Linking.openURL(url).catch(err => Alert.alert('Error', 'Could not open Twitter'));
                            }
                          }}
                          disabled={!user.twitter}
                        >
                          <Ionicons 
                            name="logo-twitter" 
                            size={rs(24)} 
                            color={user.twitter ? "#1DA1F2" : "#666"} 
                            style={styles.socialIcon} 
                          />
                        </TouchableOpacity>
                        <TextInput
                          style={styles.input}
                          placeholder="Twitter profile URL or @username"
                          placeholderTextColor="#999"
                          value={user.twitter}
                          onChangeText={(text) => setUser({ ...user, twitter: text })}
                          editable={isEditing}
                          autoCapitalize="none"
                        />
                      </View>
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Discord</Text>
                      <View style={styles.socialRow}>
                        <TouchableOpacity
                          onPress={() => {
                            if (user.discord) {
                              Alert.alert('Discord', `Discord: ${user.discord}\n\nCopy this to add as friend on Discord.`);
                            }
                          }}
                          disabled={!user.discord}
                        >
                          <Ionicons 
                            name="logo-discord" 
                            size={rs(24)} 
                            color={user.discord ? "#5865F2" : "#666"} 
                            style={styles.socialIcon} 
                          />
                        </TouchableOpacity>
                        <TextInput
                          style={styles.input}
                          placeholder="Discord username#1234"
                          placeholderTextColor="#999"
                          value={user.discord}
                          onChangeText={(text) => setUser({ ...user, discord: text })}
                          editable={isEditing}
                          autoCapitalize="none"
                        />
                      </View>
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>YouTube</Text>
                      <View style={styles.socialRow}>
                        <TouchableOpacity
                          onPress={() => {
                            if (user.youtube) {
                              const url = user.youtube.startsWith('http') ? user.youtube : `https://youtube.com/@${user.youtube.replace('@', '').replace(/ /g, '')}`;
                              Linking.openURL(url).catch(err => Alert.alert('Error', 'Could not open YouTube'));
                            }
                          }}
                          disabled={!user.youtube}
                        >
                          <Ionicons 
                            name="logo-youtube" 
                            size={rs(24)} 
                            color={user.youtube ? "#FF0000" : "#666"} 
                            style={styles.socialIcon} 
                          />
                        </TouchableOpacity>
                        <TextInput
                          style={styles.input}
                          placeholder="YouTube channel URL or channel name"
                          placeholderTextColor="#999"
                          value={user.youtube}
                          onChangeText={(text) => setUser({ ...user, youtube: text })}
                          editable={isEditing}
                          autoCapitalize="none"
                        />
                      </View>
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Twitch</Text>
                      <View style={styles.socialRow}>
                        <TouchableOpacity
                          onPress={() => {
                            if (user.twitch) {
                              const url = user.twitch.startsWith('http') ? user.twitch : `https://twitch.tv/${user.twitch.replace('@', '').replace(/ /g, '')}`;
                              Linking.openURL(url).catch(err => Alert.alert('Error', 'Could not open Twitch'));
                            }
                          }}
                          disabled={!user.twitch}
                        >
                          <Ionicons 
                            name="logo-twitch" 
                            size={rs(24)} 
                            color={user.twitch ? "#9146FF" : "#666"} 
                            style={styles.socialIcon} 
                          />
                        </TouchableOpacity>
                        <TextInput
                          style={styles.input}
                          placeholder="Twitch channel URL or username"
                          placeholderTextColor="#999"
                          value={user.twitch}
                          onChangeText={(text) => setUser({ ...user, twitch: text })}
                          editable={isEditing}
                          autoCapitalize="none"
                        />
                      </View>
                    </View>
                  </>
                )}
              </View>


              {isEditing ? (
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
                  <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={() => {
                      setIsEditing(false);
                      loadUserProfile(); // Reload to discard changes
                    }}
                    disabled={loading}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleSignOut}
                disabled={signingOut}
                activeOpacity={0.7}
              >
                <Ionicons name="log-out-outline" size={rs(20)} color="#ff4444" />
                <Text style={styles.logoutText}>
                  {signingOut ? 'Signing out...' : 'Sign out'}
                </Text>
              </TouchableOpacity>
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
    alignItems: 'flex-end',
  },
  editIconButton: {
    padding: 0,
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
  },
  profileName: {
    fontSize: rf(22),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: hp(0.4),
    textAlign: 'left',
    flexShrink: 1,
  },
  playerIdLabel: {
    color: '#9CA3AF',
    fontSize: rf(9),
    fontWeight: '600',
    letterSpacing: 0.6,
    marginBottom: hp(0.25),
  },
  playerId: {
    width: '100%',
    fontSize: rf(9),
    lineHeight: rf(13),
    color: '#D1D5DB',
    textAlign: 'left',
    flexShrink: 1,
  },
  profileBioInput: {
    width: '100%',
    marginTop: hp(1),
  },
  membershipCard: {
    backgroundColor: '#1A1F2E',
    borderWidth: 1,
    borderColor: '#2A3441',
    borderRadius: rs(12),
    padding: wp(4),
    marginBottom: hp(1),
  },
  membershipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membershipIcon: {
    width: rs(46),
    height: rs(46),
    borderRadius: rs(23),
    backgroundColor: 'rgba(156, 163, 175, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  membershipDetails: {
    flex: 1,
    marginLeft: wp(3),
  },
  membershipLabel: {
    color: '#9CA3AF',
    fontSize: rf(10),
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  membershipName: {
    color: '#D1D5DB',
    fontSize: rf(17),
    fontWeight: 'bold',
    marginTop: hp(0.2),
  },
  membershipSubtitle: {
    color: '#9CA3AF',
    fontSize: rf(11),
    marginTop: hp(0.15),
  },
  membershipUpgrade: {
    backgroundColor: '#FFD700',
    borderRadius: rs(8),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.8),
    minHeight: 36,
    justifyContent: 'center',
  },
  membershipUpgradeText: {
    color: '#141E30',
    fontSize: rf(9),
    fontWeight: 'bold',
  },
  membershipDivider: {
    height: 1,
    backgroundColor: '#2A3441',
    marginVertical: hp(1.5),
  },
  customizationTitle: {
    color: '#FFFFFF',
    fontSize: rf(13),
    fontWeight: '600',
    marginBottom: hp(0.8),
  },
  customizationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: hp(0.8),
  },
  customizationItem: {
    width: '48%',
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: rs(7),
    paddingHorizontal: wp(2.5),
  },
  customizationCount: {
    color: '#D1D5DB',
    fontSize: rf(13),
    fontWeight: 'bold',
    marginRight: wp(2),
  },
  customizationLabel: {
    flex: 1,
    color: '#9CA3AF',
    fontSize: rf(10),
  },
  gamingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: rs(18),
    borderWidth: 1.5,
    borderColor: '#FFD700',
  },
  gamingBadgeText: {
    color: '#FFD700',
    fontSize: rf(14),
    fontWeight: '600',
    marginLeft: wp(1.5),
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
  disabled: {
    backgroundColor: '#1A1F2E',
    color: '#999',
  },
  textArea: {
    minHeight: hp(12),
    textAlignVertical: 'top',
    paddingTop: hp(1.2),
  },
  charCount: {
    fontSize: rf(12),
    color: '#999',
    textAlign: 'right',
    marginTop: hp(0.5),
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
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
    borderRadius: rs(10),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: rf(16),
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp(2.5),
    paddingVertical: hp(1.5),
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
    borderRadius: rs(10),
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.5)',
    minHeight: 44,
  },
  logoutText: {
    fontSize: rf(16),
    color: '#ff4444',
    marginLeft: wp(2),
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
  bioContainer: {
    alignSelf: 'stretch',
    marginTop: hp(0.5),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: rs(10),
  },
  bioText: {
    fontSize: rf(16),
    color: '#fff',
    lineHeight: rf(24),
    textAlign: 'left',
  },
  bioEditContainer: {
    marginTop: hp(1.5),
    marginBottom: hp(1),
    width: '100%',
    paddingHorizontal: wp(2),
  },
  bioInput: {
    minHeight: hp(8),
    textAlignVertical: 'top',
    paddingTop: hp(1.2),
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
