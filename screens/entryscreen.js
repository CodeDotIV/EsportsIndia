import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, ActivityIndicator, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { wp, hp } from '../utils/responsive';
import { supabase } from '../services/supabase';
import { getItem, setItem } from '../utils/storageHelper';
import { getOrCreatePlayerId } from '../utils/playerId';

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

    const timer = setTimeout(async () => {
      try {
        const { data, error } = supabase
          ? await supabase.auth.getSession()
          : { data: { session: null }, error: null };
        if (error) throw error;

        if (data.session) {
          const authUser = data.session.user;
          const storedUser = await getItem('user');
          const profile = storedUser ? JSON.parse(storedUser) : {};
          const playerId = await getOrCreatePlayerId(
            authUser.id,
            profile.playerId,
            authUser.created_at
          );
          await setItem(
            'user',
            JSON.stringify({
              ...profile,
              id: authUser.id,
              authCreatedAt: authUser.created_at || '',
              playerId,
              email: authUser.email || '',
              name:
                profile.name ||
                authUser.user_metadata?.full_name ||
                authUser.user_metadata?.name ||
                authUser.email?.split('@')[0] ||
                'Player',
            })
          );
          navigation.replace('Main');
        } else {
          navigation.replace('LoginScreen');
        }
      } catch (error) {
        console.error('Failed to restore Supabase session:', error);
        navigation.replace('LoginScreen');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, slideAnim]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.logoWrap}>
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
            <ActivityIndicator size="small" color="#fff" style={styles.loader} />
          </Animated.View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default EntryScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#141E30',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#141E30',
  },
  logoWrap: {
    width: wp(72),
    height: hp(72),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  loader: {
    marginTop: hp(1),
  },
});
