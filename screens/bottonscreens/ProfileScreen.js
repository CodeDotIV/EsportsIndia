import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, SafeAreaView, Platform, Image, Linking, Modal, Pressable
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { getItem, setItem, removeItem } from '../../utils/storageHelper';
import { logout, updateProfile, getCurrentUser } from '../../services/authService';
import { wp, hp, rf, rs, isTablet } from '../../utils/responsive';

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

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    name: '',
    email: '',
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
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(0);
  const SAVE_COOLDOWN_MS = 2000; // 2 seconds cooldown between saves

  useEffect(() => {
    loadUserProfile();
  }, []);

  // Generate random avatar URL based on user name or email
  const getRandomAvatar = (name, email) => {
    const seed = name || email || 'user';
    // Using UI Avatars API for random avatars
    const encodedName = encodeURIComponent(seed);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=200&bold=true`;
  };


  const loadUserProfile = async () => {
    try {
      setLoading(true);
      console.log('📱 Loading user profile...');
      
      // Get token from storage
      const token = await getItem('userToken');
      if (!token) {
        console.log('⚠️ No token found');
        // Load from local storage as fallback
        const localData = await getItem('user');
        if (localData) {
          const parsedData = JSON.parse(localData);
          setUser(parsedData);
        }
        return;
      }

      // Fetch from backend
      const result = await getCurrentUser(token);
      if (result.success) {
        console.log('✅ Profile loaded from backend:', result.user);
        setUser({
          name: result.user.name || '',
          email: result.user.email || '',
          phone: result.user.phone || '',
          gender: result.user.gender || '',
          location: result.user.location || '',
          bio: result.user.bio || '',
          dateOfBirth: result.user.dateOfBirth ? new Date(result.user.dateOfBirth).toISOString().split('T')[0] : '',
          avatar: result.user.avatar || '',
          gamingUsername: result.user.gamingUsername || '',
          favoriteGame: result.user.favoriteGame || '',
          gamingPlatform: result.user.gamingPlatform || '',
          skillLevel: result.user.skillLevel || '',
          teamName: result.user.teamName || '',
          yearsOfGaming: result.user.yearsOfGaming || '',
          preferredGameMode: result.user.preferredGameMode || '',
          country: result.user.country || '',
          timezone: result.user.timezone || '',
          language: result.user.language || 'English',
          instagram: result.user.instagram || '',
          twitter: result.user.twitter || '',
          discord: result.user.discord || '',
          youtube: result.user.youtube || '',
          twitch: result.user.twitch || '',
        });
        // Also save to local storage
        await setItem('user', JSON.stringify(result.user));
      } else {
        console.log('⚠️ Failed to load from backend, using local storage');
        const localData = await getItem('user');
        if (localData) {
          const parsedData = JSON.parse(localData);
          setUser(parsedData);
        }
      }
    } catch (error) {
      console.error('❌ Failed to load profile:', error);
      // Fallback to local storage
      try {
        const localData = await getItem('user');
        if (localData) {
          const parsedData = JSON.parse(localData);
          setUser(parsedData);
        }
      } catch (e) {
        console.error('❌ Failed to load from local storage:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user.name.trim()) {
      Alert.alert('Validation', 'Name is required.');
      return;
    }

    // Prevent rapid successive saves
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
      console.log('💾 Saving profile to backend...', user);

      const token = await getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'You must be logged in to save your profile.');
        return;
      }

      // Prepare profile data
      // Validate and format dateOfBirth
      let formattedDateOfBirth = null;
      if (user.dateOfBirth && user.dateOfBirth.trim()) {
        const dateStr = user.dateOfBirth.trim();
        // Check if it's a valid date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (dateRegex.test(dateStr)) {
          // Validate that it's actually a valid date
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

      // Validate yearsOfGaming - convert empty string to null
      let formattedYearsOfGaming = null;
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

      // Helper function to convert empty strings to null for optional fields
      const sanitizeField = (value) => {
        if (value === null || value === undefined) return null;
        const trimmed = String(value).trim();
        return trimmed === '' ? null : trimmed;
      };

      const profileData = {
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

      console.log('📤 Sending profile data - bio:', profileData.bio);
      
      const result = await updateProfile(token, profileData);
      
      if (result.success) {
        console.log('✅ Profile saved successfully');
        console.log('📥 Received user data - bio:', result.user.bio);
        // Update local storage
        await setItem('user', JSON.stringify(result.user));
        // Update local state with the response to ensure bio is synced
        setUser({
          ...user,
          bio: result.user.bio !== undefined && result.user.bio !== null ? String(result.user.bio) : '',
          name: result.user.name || user.name,
          email: result.user.email || user.email,
          dateOfBirth: result.user.dateOfBirth ? new Date(result.user.dateOfBirth).toISOString().split('T')[0] : user.dateOfBirth,
        });
        setIsEditing(false);
        Alert.alert('Success', 'Profile saved successfully!');
      } else {
        console.error('❌ Profile save failed:', result.error);
        Alert.alert('Error', result.error || 'Failed to save profile. Please try again.');
      }
    } catch (error) {
      console.error('❌ Failed to save profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const performLogout = async () => {
    try {
      console.log('🚪 Starting logout process...');
      
      await removeItem('user');
      await removeItem('userToken');
      console.log('✅ Storage cleared');
      
      const tabNav = navigation.getParent();
      const stackNav = tabNav?.getParent();
      
      if (stackNav) {
        try {
          stackNav.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
          });
          console.log('✅ Navigation successful!');
        } catch (error) {
          try {
            stackNav.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }],
              })
            );
          } catch (dispatchError) {
            stackNav.navigate('Entryscreen');
          }
        }
      } else {
        navigation.navigate('Entryscreen');
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
      try {
        await removeItem('user');
        await removeItem('userToken');
        navigation.navigate('Entryscreen');
      } catch (e) {
        console.error('❌ Final fallback failed:', e);
      }
    }
  };

  const handleLogout = () => {
    console.log('🔴 Logout button clicked!');
    performLogout();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={rs(24)} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>My Profile</Text>
          <View style={styles.headerRight}>
            {!isEditing ? (
              <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editIconButton}>
                <Ionicons name="create-outline" size={rs(22)} color="#fff" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        
        <ScrollView 
          style={styles.scrollContainer} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          nestedScrollEnabled={true}
          bounces={true}
        >
            {/* Profile Header Card */}
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Image 
                  source={{ uri: user.avatar || getRandomAvatar(user.name, user.email) }} 
                  style={styles.avatarImage}
                />
              </View>
              <Text style={styles.profileName}>{user.name || 'User Name'}</Text>
              <Text style={styles.profileEmail}>{user.email || 'user@example.com'}</Text>
              {user.gamingUsername ? (
                <View style={styles.gamingBadge}>
                  <Ionicons name="game-controller-outline" size={rs(14)} color="#FFD700" />
                  <Text style={styles.gamingBadgeText}>{user.gamingUsername}</Text>
                </View>
              ) : null}
              
              {/* Bio Section */}
              {isEditing ? (
                <View style={styles.bioEditContainer}>
                  <Text style={styles.label}>Bio</Text>
                  <TextInput
                    style={[styles.input, styles.bioInput]}
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
      
            {/* Profile Form */}
        <View style={styles.form}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Full Name</Text>
                  <Text style={styles.requiredIndicator}>* Required</Text>
                </View>
          <TextInput
            style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#999"
            value={user.name}
            onChangeText={(text) => setUser({ ...user, name: text })}
            editable={isEditing}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={user.email}
            editable={false}
                  placeholderTextColor="#999"
          />

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
                    style={[styles.input, styles.disabledInput]}
                    value={user.gender || 'Not specified'}
                    editable={false}
                    placeholderTextColor="#999"
                  />
                )}

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

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Gaming Profile</Text>
                <Text style={styles.label}>Gaming Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your gaming username"
                  placeholderTextColor="#999"
                  value={user.gamingUsername}
                  onChangeText={(text) => setUser({ ...user, gamingUsername: text })}
                  editable={isEditing}
                />

                <Text style={styles.label}>Favorite Game</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your favorite game"
                  placeholderTextColor="#999"
                  value={user.favoriteGame}
                  onChangeText={(text) => setUser({ ...user, favoriteGame: text })}
                  editable={isEditing}
                />

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
                    style={[styles.input, styles.disabledInput]}
                    value={user.gamingPlatform || 'Not specified'}
                    editable={false}
                    placeholderTextColor="#999"
                  />
                )}

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
                    style={[styles.input, styles.disabledInput]}
                    value={user.skillLevel || 'Not specified'}
                    editable={false}
                    placeholderTextColor="#999"
                  />
                )}

                <Text style={styles.label}>Team/Clan Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your team or clan name"
                  placeholderTextColor="#999"
                  value={user.teamName}
                  onChangeText={(text) => setUser({ ...user, teamName: text })}
                  editable={isEditing}
                />

                <Text style={styles.label}>Years of Gaming Experience</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter years (e.g., 5)"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={user.yearsOfGaming ? user.yearsOfGaming.toString() : ''}
                  onChangeText={(text) => setUser({ ...user, yearsOfGaming: text })}
                  editable={isEditing}
                />

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
                    style={[styles.input, styles.disabledInput]}
                    value={user.preferredGameMode || 'Not specified'}
                    editable={false}
                    placeholderTextColor="#999"
                  />
          )}
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
                    >
                      <Ionicons 
                        name="logo-instagram" 
                        size={rs(32)} 
                        color={user.instagram ? "#E4405F" : "#666"} 
                      />
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
                    >
                      <Ionicons 
                        name="logo-twitter" 
                        size={rs(32)} 
                        color={user.twitter ? "#1DA1F2" : "#666"} 
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        if (user.discord) {
                          Alert.alert('Discord', `Discord: ${user.discord}\n\nCopy this to add as friend on Discord.`);
                        }
                      }}
                      disabled={!user.discord}
                      style={styles.socialIconButton}
                    >
                      <Ionicons 
                        name="logo-discord" 
                        size={rs(32)} 
                        color={user.discord ? "#5865F2" : "#666"} 
                      />
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
                    >
                      <Ionicons 
                        name="logo-youtube" 
                        size={rs(32)} 
                        color={user.youtube ? "#FF0000" : "#666"} 
                      />
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
                    >
                      <Ionicons 
                        name="logo-twitch" 
                        size={rs(32)} 
                        color={user.twitch ? "#9146FF" : "#666"} 
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <Text style={styles.sectionSubtitle}>Paste your profile links. Click icons to open profiles.</Text>
                    
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
                        style={styles.socialInput}
                        placeholder="Instagram profile URL or @username"
                        placeholderTextColor="#999"
                        value={user.instagram}
                        onChangeText={(text) => setUser({ ...user, instagram: text })}
                        editable={isEditing}
                      />
                    </View>

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
                        style={styles.socialInput}
                        placeholder="Twitter profile URL or @username"
                        placeholderTextColor="#999"
                        value={user.twitter}
                        onChangeText={(text) => setUser({ ...user, twitter: text })}
                        editable={isEditing}
                      />
                    </View>

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
                        style={styles.socialInput}
                        placeholder="Discord username#1234"
                        placeholderTextColor="#999"
                        value={user.discord}
                        onChangeText={(text) => setUser({ ...user, discord: text })}
                        editable={isEditing}
                      />
                    </View>

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
                        style={styles.socialInput}
                        placeholder="YouTube channel URL or channel name"
                        placeholderTextColor="#999"
                        value={user.youtube}
                        onChangeText={(text) => setUser({ ...user, youtube: text })}
                        editable={isEditing}
                      />
                    </View>

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
                        style={styles.socialInput}
                        placeholder="Twitch channel URL or username"
                        placeholderTextColor="#999"
                        value={user.twitch}
                        onChangeText={(text) => setUser({ ...user, twitch: text })}
                        editable={isEditing}
                      />
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
            </View>

            {/* Logout Button */}
            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={rs(20)} color="#ff4444" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
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
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  gradient: {
    flex: 1,
    ...(Platform.OS === 'web' && { pointerEvents: 'box-none' }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    paddingTop: Platform.OS === 'ios' ? hp(1) : hp(2.5),
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backButton: {
    marginRight: wp(2.5),
  },
  title: {
    fontSize: rf(20),
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  headerRight: {
    width: rs(30),
  },
  editIconButton: {
    padding: rs(5),
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: hp(8),
    paddingTop: hp(1),
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: hp(2),
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: hp(1.5),
  },
  avatar: {
    width: rs(100),
    height: rs(100),
    borderRadius: rs(50),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarImage: {
    width: rs(100),
    height: rs(100),
    borderRadius: rs(50),
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: rf(22),
    fontWeight: 'bold',
    color: '#fff',
    marginTop: hp(0.5),
    marginBottom: hp(0.5),
  },
  profileEmail: {
    fontSize: rf(14),
    color: '#ccc',
    marginBottom: hp(1),
  },
  gamingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: wp(5),
    paddingVertical: hp(0.8),
    borderRadius: rs(18),
    borderWidth: 1.5,
    borderColor: '#FFD700',
    marginTop: hp(0.5),
  },
  gamingBadgeText: {
    color: '#FFD700',
    fontSize: rf(14),
    fontWeight: '600',
    marginLeft: wp(1.5),
  },
  form: {
    paddingHorizontal: wp(5),
  },
  section: {
    marginBottom: hp(3),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: rs(15),
    padding: wp(4.5),
  },
  sectionTitle: {
    fontSize: rf(18),
    fontWeight: 'bold',
    color: '#f5a623',
    marginBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245, 166, 35, 0.3)',
    paddingBottom: hp(0.8),
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp(1.5),
    marginBottom: hp(0.8),
  },
  label: {
    fontSize: rf(14),
    fontWeight: '600',
    color: '#fff',
  },
  requiredIndicator: {
    fontSize: rf(11),
    color: '#ff4444',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: rs(10),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    fontSize: rf(15),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    minHeight: hp(5.5),
    marginBottom: hp(1),
  },
  disabledInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
    marginHorizontal: wp(5),
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
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: hp(1.5),
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
  },
  socialIconButton: {
    padding: wp(2.5),
    borderRadius: rs(12),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flex: 1,
    alignItems: 'center',
    marginHorizontal: wp(1),
    maxWidth: wp(18),
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.2),
    marginTop: hp(0.5),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: rs(10),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
  },
  socialIcon: {
    marginRight: wp(2.5),
  },
  socialInput: {
    flex: 1,
    borderWidth: 0,
    fontSize: rf(14),
    color: '#fff',
    paddingVertical: hp(1),
  },
  bioContainer: {
    marginTop: hp(1),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: rs(10),
    maxWidth: wp(90),
  },
  bioText: {
    fontSize: rf(16),
    color: '#fff',
    lineHeight: rf(24),
    textAlign: 'center',
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
