
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const REWARDED_AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-6973227795015320/6466136612';

export function showTournamentRewardedAd() {
  return new Promise((resolve, reject) => {
    const rewarded = RewardedAd.createForAdRequest(
      REWARDED_AD_UNIT_ID,
      {
        requestNonPersonalizedAdsOnly: true,
      }
    );

    let earnedReward = false;
    let settled = false;
    let shown = false;

    const subscriptions = [];

    const cleanup = () => {
      subscriptions.forEach(unsubscribe => unsubscribe());
    };

    const finish = (error = null) => {
      if (settled) return;

      settled = true;
      cleanup();

      if (error) {
        console.warn('Rewarded ad failed:', {
          code: error?.code,
          message: error?.message,
        });

        reject(error);
      } else {
        resolve(earnedReward);
      }
    };

    subscriptions.push(
      rewarded.addAdEventListener(
        RewardedAdEventType.LOADED,
        async () => {
          if (shown || settled) return;

          shown = true;

          try {
            await rewarded.show();
          } catch (error) {
            finish(error);
          }
        }
      )
    );

    subscriptions.push(
      rewarded.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
          earnedReward = true;
        }
      )
    );

    subscriptions.push(
      rewarded.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          finish();
        }
      )
    );

    subscriptions.push(
      rewarded.addAdEventListener(
        AdEventType.ERROR,
        error => {
          finish(error);
        }
      )
    );

    try {
      rewarded.load();
    } catch (error) {
      finish(error);
    }
  });
}
