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
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        navigation.replace('SignUpScreen'); // Already logged in
      } else {
        navigation.replace('SignUpScreen'); // Google SSO button will be here
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
