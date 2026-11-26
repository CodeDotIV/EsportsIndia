import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Network from 'expo-network';

export default function NetworkStatusBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    let hasReceivedNetworkUpdate = false;
    const updateNetworkState = (state) => {
      setIsOffline(
        state.isConnected === false || state.isInternetReachable === false
      );
    };

    const subscription = Network.addNetworkStateListener((state) => {
      hasReceivedNetworkUpdate = true;
      updateNetworkState(state);
    });

    Network.getNetworkStateAsync()
      .then((state) => {
        if (!hasReceivedNetworkUpdate) updateNetworkState(state);
      })
      .catch((error) => {
        console.error('Failed to check network status:', error);
      });

    return () => subscription.remove();
  }, []);

  if (!isOffline) return null;

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Ionicons name="cloud-offline-outline" size={18} color="#FFFFFF" />
      <Text style={styles.message}>No internet connection</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    backgroundColor: '#B42318',
  },
  message: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
