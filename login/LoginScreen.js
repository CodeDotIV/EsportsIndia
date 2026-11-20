import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { isSupabaseConfigured } from '../services/supabase';
import { signInWithGoogle } from '../services/supabaseAuth';
import { setItem } from '../utils/storageHelper';
import { getOrCreatePlayerId } from '../utils/playerId';
import { hp, rf, wp } from '../utils/responsive';

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.cancelled || result.redirecting) return;

      const user = result.session.user;
      const userData = {
        id: user.id,
        authCreatedAt: user.created_at || '',
        playerId: await getOrCreatePlayerId(user.id, '', user.created_at),
        email: user.email || '',
        name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split('@')[0] ||
          'Player',
      };
      await setItem('user', JSON.stringify(userData));
      navigation.replace('Main');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Google sign-in failed.';
      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        Alert.alert('Google sign-in failed', message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>EsportsIndia</Text>
        <Text style={styles.subtitle}>Sign in or create your account with Google.</Text>
        {isSupabaseConfigured ? (
          <>
            <GoogleLoginButton onPress={handleGoogleSignIn} />
            {loading ? <ActivityIndicator color="#FFD700" style={styles.indicator} /> : null}
          </>
        ) : (
          <Text style={styles.configurationError}>
            Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY to enable sign-in.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#141E30',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(8),
  },
  title: {
    color: '#fff',
    fontSize: rf(38),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#ddd',
    fontSize: rf(17),
    marginTop: hp(1.5),
    marginBottom: hp(4),
    textAlign: 'center',
  },
  indicator: {
    marginTop: hp(2),
  },
  configurationError: {
    color: '#ffb4b4',
    fontSize: rf(15),
    textAlign: 'center',
  },
});
