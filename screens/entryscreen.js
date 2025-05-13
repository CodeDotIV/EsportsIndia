import React, { useEffect, useRef } from 'react';
import { View, Text, ImageBackground, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const EntryScreen = () => {
  const navigation = useNavigation();

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current; // Background fade-in
  const slideAnim = useRef(new Animated.Value(50)).current; // Text slides up

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 15000,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after 4 seconds
    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, slideAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ImageBackground source={require('../assets/images/logo.png')} style={styles.background}>
        <Animated.Text style={[styles.title, { transform: [{ translateY: slideAnim }] }]}>
          Welcome to EsportsIndia
        </Animated.Text>
      </ImageBackground>
    </Animated.View>
  );
};

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

export default EntryScreen;
