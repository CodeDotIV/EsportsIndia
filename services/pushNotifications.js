
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { requireSupabase } from './supabase';

// Display notifications even when the app is open.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Four daily reminders, using the phone's local timezone.
const DAILY_NOTIFICATIONS = [
  {
    hour: 9,
    minute: 0,
    title: 'Good morning, gamer! ☀️',
    body: 'Your squad is waiting. Dont keep them waiting 😉',
  },
  {
    hour: 13,
    minute: 0,
    title: 'Taking a gaming break? 🎮',
    body: 'Lunch is better with a quick match and a fun teammate ❤️',
  },
  {
    hour: 18,
    minute: 0,
    title: 'Evening gaming vibes! 🔥',
    body: 'Your next winning teammate could be one match away. Come play!',
  },
  {
    hour: 21,
    minute: 0,
    title: 'One last match? 🌙',
    body: 'Someone might be waiting for your invite. Ready to play? 😉',
  },
];

export async function scheduleDailyGamingNotifications() {
  try {
    if (Platform.OS === 'web' || !Device.isDevice) {
      return false;
    }

    // Create a dedicated Android notification channel.
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily-gaming', {
        name: 'Daily Gaming Reminders',
        description: 'Daily EsportsIndia gaming reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FFD700',
        sound: 'default',
      });
    }

    // Cancel only our previously scheduled daily reminders.
    const existing =
      await Notifications.getAllScheduledNotificationsAsync();

    for (const notification of existing) {
      if (notification.content.data?.type === 'daily_gaming') {
        await Notifications.cancelScheduledNotificationAsync(
          notification.identifier
        );
      }
    }

    // Schedule four repeating daily notifications.
    for (const item of DAILY_NOTIFICATIONS) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: item.title,
          body: item.body,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: {
            type: 'daily_gaming',
            screen: 'Explore',
          },
          ...(Platform.OS === 'android'
            ? { channelId: 'daily-gaming' }
            : {}),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: item.hour,
          minute: item.minute,
          ...(Platform.OS === 'android'
            ? { channelId: 'daily-gaming' }
            : {}),
        },
      });
    }

    console.log('Four daily gaming notifications scheduled.');
    return true;
  } catch (error) {
    console.warn('Daily notification scheduling failed:', error);
    return false;
  }
}

export async function registerForPushNotifications(userId) {
  try {
    if (Platform.OS === 'web' || !Device.isDevice) {
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'EsportsIndia Notifications',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FFD700',
        sound: 'default',
      });
    }

    let permission = await Notifications.getPermissionsAsync();

    if (!permission.granted) {
      permission = await Notifications.requestPermissionsAsync();
    }

    if (!permission.granted) {
      console.log('User declined notification permission.');
      return false;
    }

    // Schedule local daily notifications after permission is granted.
    await scheduleDailyGamingNotifications();

    // Register the remote push token separately.
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      console.warn('Expo EAS project ID is missing.');
      return true;
    }

    const tokenResponse = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    const supabase = requireSupabase();

    const { error } = await supabase
      .from('user_push_tokens')
      .upsert(
        {
          user_id: userId,
          expo_push_token: tokenResponse.data,
          platform: Platform.OS,
          device_name: Device.deviceName || null,
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,expo_push_token',
        }
      );

    if (error) {
      console.warn('Push token database error:', error);
    }

    return true;
  } catch (error) {
    console.warn('Push notification registration failed:', error);
    return false;
  }
}
