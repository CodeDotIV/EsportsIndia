import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Animated,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wp, hp, rf, getScreenDimensions } from '../utils/responsive';

const EntryScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();

    // Check login status
    const checkLoginStatus = async () => {
      try {
        console.log('🔍 Checking login status...');
        const token = await AsyncStorage.getItem('userToken');
        const userDataStr = await AsyncStorage.getItem('user');
        
        console.log('📦 Token exists:', !!token);
        console.log('👤 User data exists:', !!userDataStr);
        
        if (token && userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            // Verify token is valid by checking if user data exists
            if (userData && userData.email) {
          console.log('✅ User is logged in, navigating to Main');
          navigation.replace('Main');
              return;
            }
          } catch (parseError) {
            console.error('❌ Error parsing user data:', parseError);
            // Clear invalid data
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('userToken');
          }
        }
        
        // No valid token or user data, go to login
          console.log('ℹ️ User not logged in, navigating to LoginScreen');
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        });
      } catch (error) {
        console.error('❌ Error checking login status:', error);
        // Default to login screen on error
        navigation.replace('LoginScreen');
      }
    };

    const timer = setTimeout(() => {
      checkLoginStatus();
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, slideAnim]);

  const { height } = getScreenDimensions();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <ImageBackground
          source={require('../assets/images/logo.png')}
          style={styles.background}
          resizeMode="cover"
        >
          <Animated.Text
            style={[styles.title, { transform: [{ translateY: slideAnim }] }]}
          >
            Welcome to EsportsIndia
          </Animated.Text>
          <ActivityIndicator size="small" color="#fff" style={styles.loader} />
        </ImageBackground>
      </Animated.View>
    </SafeAreaView>
  );
};

export default EntryScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    width: wp(100),
    height: hp(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: rf(28),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: hp(60),
    paddingHorizontal: wp(5),
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  loader: {
    marginTop: hp(2),
  },
});
