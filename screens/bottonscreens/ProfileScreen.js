import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    name: '',
    email: 'user@example.com', // Non-editable
    phone: '',
    gender: '',
    location: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
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
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setIsEditing(false);
      Alert.alert('Success', 'Profile saved successfully!');
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: async () => {
            await AsyncStorage.removeItem('user');
            navigation.replace('LoginScreen'); 
          } 
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
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
          <Ionicons name="log-out-outline" size={24} color="red" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5a623', padding: 20 },
  backButton: { marginRight: 10, paddingTop: 25 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', paddingTop: 23 },
  scrollContainer: { flex: 1, paddingHorizontal: 20 },
  form: { paddingVertical: 20 },
  label: { fontSize: 16, marginTop: 10, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginTop: 5, fontSize: 16, backgroundColor: 'white' },
  disabledInput: { backgroundColor: '#EAEAEA', color: 'gray' },
  saveButton: { backgroundColor: 'blue', padding: 10, borderRadius: 5, marginTop: 20, alignItems: 'center' },
  saveText: { color: 'white', fontSize: 16 },
  editButton: { backgroundColor: 'green', padding: 15, borderRadius: 5, marginTop: 20, alignItems: 'center' },
  editText: { color: 'white', fontSize: 16 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
  logoutText: { fontSize: 18, color: 'red', marginLeft: 10 },
});

export default ProfileScreen;