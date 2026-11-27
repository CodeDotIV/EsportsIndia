
import React from 'react';
import {
  BannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';

const BANNER_AD_UNIT_ID =
  'ca-app-pub-6973227795015320/5120643239';

export default function ExploreBannerAd() {
  return (
    <BannerAd
      unitId={BANNER_AD_UNIT_ID}
      size={BannerAdSize.BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
      onAdFailedToLoad={(error) => {
        console.warn('Explore banner ad failed to load:', error);
      }}
    />
  );
}
