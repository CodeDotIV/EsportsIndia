
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-6973227795015320/5120643239';

export default function ExploreBannerAd() {
  const [adError, setAdError] = useState('');

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={BANNER_AD_UNIT_ID}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          setAdError('');
          console.log('Explore banner loaded');
        }}
        onAdFailedToLoad={(error) => {
          console.warn('Explore banner error:', error);
          setAdError(
            `Code: ${error.code}\n${error.message}`
          );
        }}
      />

      {!!adError && (
        <Text style={styles.error}>
          Banner error: {adError}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: '#FF7777',
    fontSize: 11,
    textAlign: 'center',
    padding: 6,
  },
});
