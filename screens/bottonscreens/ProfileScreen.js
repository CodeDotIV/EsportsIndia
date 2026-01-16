import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, SafeAreaView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { getItem, setItem, removeItem } from '../../utils/storageHelper';
import { logout } from '../../services/authService';
import { wp, hp, rf, rs, isTablet } from '../../utils/responsive';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    name: '',
    email: 'user@example.com',
    phone: '',
    gender: '',
    location: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log('📱 Loading user data from storage...');
        const userData = await getItem('user');
        console.log('📦 Retrieved user data:', userData);
        if (userData) {
          const parsedData = JSON.parse(userData);
          console.log('✅ Parsed user data:', parsedData);
          setUser(parsedData);
        } else {
          console.log('ℹ️ No user data found in storage');
        }
      } catch (error) {
        console.error('❌ Failed to load user data:', error);
        Alert.alert('Error', 'Failed to load profile data. Please try again.');
      }
    };
    loadUserData();
  }, []);

  const handleSave = async () => {
    if (!user.name.trim() || !user.phone.trim() || !user.gender.trim() || !user.location.trim()) {
      Alert.alert('Validation', 'Please fill all fields before saving.');
      return;
    }

    try {
      console.log('💾 Saving user data:', user);
      await setItem('user', JSON.stringify(user));
      console.log('✅ User data saved successfully');
      setIsEditing(false);
      Alert.alert('Success', 'Profile saved successfully!');
    } catch (error) {
      console.error('❌ Failed to save user data:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const performLogout = async () => {
    try {
      console.log('🚪 Starting logout process...');
      
      // Clear storage
      await removeItem('user');
      await removeItem('userToken');
      console.log('✅ Storage cleared');
      
      // Verify
      const checkUser = await getItem('user');
      const checkToken = await getItem('userToken');
      console.log('🔍 Verification - User:', checkUser, 'Token:', checkToken);
      
      // Navigate to LoginScreen via Stack Navigator
      console.log('🔄 Navigating to LoginScreen...');
      
      // Get Stack Navigator (parent of Tab Navigator)
      const tabNav = navigation.getParent();
      const stackNav = tabNav?.getParent();
      
      console.log('📍 Tab Nav:', !!tabNav, 'Stack Nav:', !!stackNav);
      
      if (stackNav) {
        try {
          console.log('✅ Resetting to LoginScreen');
          stackNav.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
          });
          console.log('✅ Navigation successful!');
        } catch (error) {
          console.error('❌ Reset failed:', error);
          // Try dispatch
          try {
            stackNav.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }],
              })
            );
            console.log('✅ Dispatch successful!');
          } catch (dispatchError) {
            console.error('❌ Dispatch failed:', dispatchError);
            // Fallback to EntryScreen
            stackNav.navigate('Entryscreen');
          }
        }
      } else {
        console.log('⚠️ Stack Nav not found, navigating to EntryScreen');
        navigation.navigate('Entryscreen');
      }
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Force clear and navigate
      try {
        await removeItem('user');
        await removeItem('userToken');
        const tabNav = navigation.getParent();
        const stackNav = tabNav?.getParent();
        if (stackNav) {
          stackNav.navigate('Entryscreen');
        } else {
          navigation.navigate('Entryscreen');
        }
      } catch (e) {
        console.error('❌ Final fallback failed:', e);
      }
    }
  };

  const handleLogout = () => {
    console.log('🔴 Logout button clicked!');
    // Direct logout - Alert seems to not be working
    performLogout();
  };

  const tablet = isTablet();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={rs(24)} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
        </View>
      
      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp(5) }}
      >
        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={user.name || ''}
            onChangeText={(text) => setUser({ ...user, name: text })}
            editable={isEditing}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={user.email || ''}
            editable={false}
          />

          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your mobile number"
            keyboardType="phone-pad"
            value={user.phone || ''}
            onChangeText={(text) => setUser({ ...user, phone: text })}
            editable={isEditing}
          />

          <Text style={styles.label}>Gender</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your gender"
            value={user.gender || ''}
            onChangeText={(text) => setUser({ ...user, gender: text })}
            editable={isEditing}
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your location"
            value={user.location || ''}
            onChangeText={(text) => setUser({ ...user, location: text })}
            editable={isEditing}
          />

          {isEditing ? (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save Profile</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={rs(24)} color="red" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5a623',
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    paddingTop: Platform.OS === 'ios' ? hp(1) : hp(2.5),
  },
  backButton: {
    marginRight: wp(2.5),
  },
  title: {
    fontSize: rf(18),
    fontWeight: 'bold',
    color: '#000',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: wp(5),
  },
  form: {
    paddingVertical: hp(2.5),
  },
  label: {
    fontSize: rf(16),
    marginTop: hp(1.5),
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: rs(5),
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
    marginTop: hp(0.6),
    fontSize: rf(16),
    backgroundColor: 'white',
    minHeight: hp(5.5),
  },
  disabledInput: {
    backgroundColor: '#EAEAEA',
    color: 'gray',
  },
  saveButton: {
    backgroundColor: 'blue',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
    borderRadius: rs(5),
    marginTop: hp(2.5),
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontSize: rf(16),
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: 'green',
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(5),
    borderRadius: rs(5),
    marginTop: hp(2.5),
    alignItems: 'center',
  },
  editText: {
    color: 'white',
    fontSize: rf(16),
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp(2.5),
    paddingVertical: hp(1.5),
    backgroundColor: 'transparent',
    minHeight: 44,
  },
  logoutText: {
    fontSize: rf(18),
    color: 'red',
    marginLeft: wp(2.5),
    fontWeight: 'bold',
  },
});
