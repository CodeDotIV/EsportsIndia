import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, SafeAreaView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getItem, setItem, removeItem } from '../../utils/storageHelper';
import { wp, hp, rf, rs, isTablet } from '../../utils/responsive';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    name: '',
    email: 'user@example.com',  // Non-editable placeholder if no email is stored
    phone: '',
    gender: '',
    location: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
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
      await setItem('user', JSON.stringify(user));
      setIsEditing(false);
      Alert.alert('Success', 'Profile saved successfully!');
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: async () => {
            await removeItem('user');
            await removeItem('userToken');  // Optional: clear token too
            navigation.replace('LoginScreen');
          } 
        },
      ]
    );
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
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={user.name}
            onChangeText={(text) => setUser({ ...user, name: text })}
            editable={isEditing}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={user.email}
            editable={false}
          />

          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your mobile number"
            keyboardType="phone-pad"
            value={user.phone}
            onChangeText={(text) => setUser({ ...user, phone: text })}
            editable={isEditing}
          />

          <Text style={styles.label}>Gender</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your gender"
            value={user.gender}
            onChangeText={(text) => setUser({ ...user, gender: text })}
            editable={isEditing}
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your location"
            value={user.location}
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

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
  },
  logoutText: {
    fontSize: rf(18),
    color: 'red',
    marginLeft: wp(2.5),
    fontWeight: 'bold',
  },
});
