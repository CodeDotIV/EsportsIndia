import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        navigation.replace('Main'); // Already logged in
      } else {
        navigation.replace('Main'); // Google SSO button will be here
      }
    };

    const timer = setTimeout(() => {
      checkLoginStatus();
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, slideAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ImageBackground
        source={require('../assets/images/logo.png')}
        style={styles.background}
      >
        <Animated.Text
          style={[styles.title, { transform: [{ translateY: slideAnim }] }]}
        >
          Welcome to EsportsIndia
        </Animated.Text>
        <ActivityIndicator size="small" color="#fff" style={{ marginTop: 20 }} />
      </ImageBackground>
    </Animated.View>
  );
};

export default EntryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 500,
  },
});
