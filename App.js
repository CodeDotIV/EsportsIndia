
import React, { useCallback, useEffect, useRef } from 'react';
import { Platform, Text } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import mobileAds from 'react-native-google-mobile-ads';

import BottomTabNavigator from './screens/bottonscreens/BottomTabNavigator.js';
import Freefire from './screens/esports/freefire.js';
import Bgmi from './screens/esports/bgmi.js';
import Callofduty from './screens/esports/callofduty.js';
import Erangel from './screens/esports/bgmi/erangel/erangel.js';
import EntryScreen from './screens/entryscreen';
import Livik from './screens/esports/bgmi/livik/livik.js';
import Nusa from './screens/esports/bgmi/nusa/nusa.js';
import Register from './screens/register';
import Liviksolo from './screens/esports/bgmi/livik/solo/liviksolo.js';
import Livikduo from './screens/esports/bgmi/livik/duo/livikduo.js';
import Liviksquad from './screens/esports/bgmi/livik/squad/liviksquad.js';
import Erangelsolo from './screens/esports/bgmi/erangel/solo/erangelsolo.js';
import Erangelduo from './screens/esports/bgmi/erangel/duo/erangelduo.js';
import Erangelsquad from './screens/esports/bgmi/erangel/squad/erangelsquad.js';
import Nusasolo from './screens/esports/bgmi/nusa/solo/nusasolo.js';
import Nusaduo from './screens/esports/bgmi/nusa/duo/nusaduo.js';
import Nusasquad from './screens/esports/bgmi/nusa/squad/nusasquad.js';
import Shanoksolo from './screens/esports/bgmi/shanok/solo/shanoksolo.js';
import Shanokduo from './screens/esports/bgmi/shanok/duo/shanokduo.js';
import Shanoksquad from './screens/esports/bgmi/shanok/squad/shanoksquad.js';
import Shanok from './screens/esports/bgmi/shanok/shanok.js';
import Liviksoloregister from './screens/esports/bgmi/livik/solo/liviksoloregister.js';
import Livikduoregister from './screens/esports/bgmi/livik/duo/livikduoregister.js';
import Liviksquadregister from './screens/esports/bgmi/livik/squad/liviksquadregister.js';
import Erangelsoloregister from './screens/esports/bgmi/erangel/solo/erangelsoloregister.js';
import Erangelduoregister from './screens/esports/bgmi/erangel/duo/erangelduoregister.js';
import Erangelsquadregister from './screens/esports/bgmi/erangel/squad/erangelsquadregister.js';
import Nusasoloregister from './screens/esports/bgmi/nusa/solo/nusasoloregister.js';
import Nusaduoregister from './screens/esports/bgmi/nusa/duo/nusaduoregister.js';
import Nusasquadregister from './screens/esports/bgmi/nusa/squad/nusasquadregister.js';
import Shanoksoloregister from './screens/esports/bgmi/shanok/solo/shanoksoloregister.js';
import Shanokduoregister from './screens/esports/bgmi/shanok/duo/shanokduoregister.js';
import Shanoksquadregister from './screens/esports/bgmi/shanok/squad/shanoksquad.js';
import Aboutbgmi from './screens/aboutbgmi.js';
import Aboutfreefire from './screens/aboutfreefire.js';
import Aboutcallofduty from './screens/aboutcallofduty.js';
import Aboutvalorant from './screens/aboutvalorant.js';
import Esportsarena from './screens/esportsarena/esportsarena.js';
import Inventory from './screens/esportsarena/modes/inventory.js';
import Library from './screens/esportsarena/modes/library.js';
import Livikultimatearena from './screens/esportsarena/modes/livikultimatearena.js';
import Ruins from './screens/esportsarena/modes/ruins.js';
import Town from './screens/esportsarena/modes/town.js';
import Erangelultimatearena from './screens/esportsarena/modes/erangelultimatearena.js';
import Hangerarenatraining from './screens/esportsarena/modes/hangerarenatraining.js';
import Hangertdm from './screens/esportsarena/modes/hangertdm.js';
import Hangertgm from './screens/esportsarena/modes/hangertgm.js';
import TournamentRegister from './screens/bottonscreens/tournaments/tournamentregister.js';

import {
  SettingsAboutScreen,
  SettingsAccountScreen,
  SettingsAdvancedScreen,
  SettingsDiagnosticsScreen,
  SettingsHomeScreen,
  SettingsLegalScreen,
  SettingsMembershipScreen,
  SettingsPreferencesScreen,
  SettingsPrivacyScreen,
  SettingsSupportScreen,
  SettingsTournamentsScreen,
} from './screens/bottonscreens/settings/SettingsScreens.js';

import LoginScreen from './login/LoginScreen.js';
import { AppDialogHost } from './components/AppDialog.js';
import NetworkStatusBanner from './components/NetworkStatusBanner.js';

const Stack = createStackNavigator();

const MAIN_TABS = [
  'Home',
  'Explore',
  'Tournaments',
  'Connect',
  'Plans',
  'Profile',
];

const NOTIFICATION_TAB_BY_TYPE = {
  daily_gaming: 'Explore',
  connection_request: 'Connect',
  tournament: 'Tournaments',
  tournament_update: 'Tournaments',
  membership: 'Plans',
  payment: 'Plans',
};

const getNotificationTab = (data) => {
  const requestedScreen = data?.screen || data?.tab;

  if (typeof requestedScreen === 'string') {
    const matchingTab = MAIN_TABS.find(
      (tab) => tab.toLowerCase() === requestedScreen.toLowerCase()
    );

    if (matchingTab) return matchingTab;
  }

  return NOTIFICATION_TAB_BY_TYPE[
    String(data?.type || '').toLowerCase()
  ] || null;
};

Text.defaultProps = {
  ...Text.defaultProps,
  maxFontSizeMultiplier: 1.3,
};

const prefix = Linking.createURL('/');

const linking = {
  prefixes: [prefix, 'myapp://'],
  config: {
    screens: {
      Entryscreen: '',
      LoginScreen: 'login',
      Main: 'main',
    },
  },
};

export default function App() {
  const navigationRef = useNavigationContainerRef();

  const pendingNotificationTab = useRef(null);
  const handledNotificationResponses = useRef(new Set());

  // Initialize Google Mobile Ads SDK once when the app starts.
  useEffect(() => {
    if (Platform.OS === 'web') return;

    let mounted = true;

    mobileAds()
      .initialize()
      .then((adapterStatuses) => {
        if (mounted) {
          console.log(
            'Google Mobile Ads SDK initialized successfully:',
            adapterStatuses
          );
        }
      })
      .catch((error) => {
        if (mounted) {
          console.warn(
            'Google Mobile Ads SDK initialization failed:',
            error
          );
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const flushPendingNotification = useCallback(() => {
    const tab = pendingNotificationTab.current;

    if (!tab || !navigationRef.isReady()) return;

    const rootState = navigationRef.getRootState();
    const activeRoute = rootState?.routes?.[rootState.index]?.name;

    if (
      activeRoute === 'Entryscreen' ||
      activeRoute === 'LoginScreen'
    ) {
      return;
    }

    pendingNotificationTab.current = null;

    navigationRef.navigate('Main', { screen: tab });
  }, [navigationRef]);

  const handleNotificationResponse = useCallback((response) => {
    const notification = response?.notification;

    if (!notification) return;

    const responseKey =
      `${notification.request.identifier}:${notification.date || ''}`;

    if (handledNotificationResponses.current.has(responseKey)) return;

    handledNotificationResponses.current.add(responseKey);

    const tab = getNotificationTab(
      notification.request.content.data
    );

    if (tab) {
      if (!navigationRef.isReady()) {
        pendingNotificationTab.current = tab;
      } else {
        const rootState = navigationRef.getRootState();
        const activeRoute =
          rootState?.routes?.[rootState.index]?.name;

        if (
          activeRoute !== 'Entryscreen' &&
          activeRoute !== 'LoginScreen'
        ) {
          navigationRef.navigate('Main', { screen: tab });
        } else {
          pendingNotificationTab.current = tab;
        }
      }
    }

    Notifications.clearLastNotificationResponseAsync().catch(
      (error) => {
        console.error(
          'Failed to clear notification response:',
          error
        );
      }
    );
  }, [navigationRef]);

  useEffect(() => {
    const subscription =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse
      );

    Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        if (response) {
          handleNotificationResponse(response);
        }
      })
      .catch((error) => {
        console.error(
          'Failed to read the last notification response:',
          error
        );
      });

    return () => subscription.remove();
  }, [handleNotificationResponse]);

  // iOS and Android app navigation
  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={Platform.OS === 'android' ? ['top'] : []}
        style={{
          flex: 1,
          backgroundColor: '#141E30',
        }}
      >
        <NetworkStatusBanner />

        <NavigationContainer
          linking={linking}
          ref={navigationRef}
          onReady={flushPendingNotification}
          onStateChange={flushPendingNotification}
        >
          <StatusBar
            style="light"
            backgroundColor="#141E30"
          />

          <Stack.Navigator initialRouteName="Entryscreen">
            <Stack.Screen
              name="Entryscreen"
              component={EntryScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Main"
              component={BottomTabNavigator}
              options={{ headerShown: false }}
            />

            <Stack.Screen name="Livik" component={Livik} options={{ headerShown: false }} />
            <Stack.Screen name="Aboutbgmi" component={Aboutbgmi} options={{ headerShown: false }} />
            <Stack.Screen name="Aboutfreefire" component={Aboutfreefire} options={{ headerShown: false }} />
            <Stack.Screen name="Aboutcallofduty" component={Aboutcallofduty} options={{ headerShown: false }} />
            <Stack.Screen name="Aboutvalorant" component={Aboutvalorant} options={{ headerShown: false }} />
            <Stack.Screen name="Bgmi" component={Bgmi} options={{ headerShown: false }} />
            <Stack.Screen name="Freefire" component={Freefire} options={{ headerShown: false }} />
            <Stack.Screen name="Callofduty" component={Callofduty} options={{ headerShown: false }} />
            <Stack.Screen name="Erangel" component={Erangel} options={{ headerShown: false }} />
            <Stack.Screen name="Shanok" component={Shanok} options={{ headerShown: false }} />
            <Stack.Screen name="Nusa" component={Nusa} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />

            <Stack.Screen name="Liviksolo" component={Liviksolo} options={{ headerShown: false }} />
            <Stack.Screen name="Livikduo" component={Livikduo} options={{ headerShown: false }} />
            <Stack.Screen name="Liviksquad" component={Liviksquad} options={{ headerShown: false }} />

            <Stack.Screen name="Erangelsolo" component={Erangelsolo} options={{ headerShown: false }} />
            <Stack.Screen name="Erangelduo" component={Erangelduo} options={{ headerShown: false }} />
            <Stack.Screen name="Erangelsquad" component={Erangelsquad} options={{ headerShown: false }} />

            <Stack.Screen name="Nusasolo" component={Nusasolo} options={{ headerShown: false }} />
            <Stack.Screen name="Nusaduo" component={Nusaduo} options={{ headerShown: false }} />
            <Stack.Screen name="Nusasquad" component={Nusasquad} options={{ headerShown: false }} />

            <Stack.Screen name="Shanoksolo" component={Shanoksolo} options={{ headerShown: false }} />
            <Stack.Screen name="Shanokduo" component={Shanokduo} options={{ headerShown: false }} />
            <Stack.Screen name="Shanoksquad" component={Shanoksquad} options={{ headerShown: false }} />

            <Stack.Screen name="Liviksoloregister" component={Liviksoloregister} options={{ headerShown: false }} />
            <Stack.Screen name="Livikduoregister" component={Livikduoregister} options={{ headerShown: false }} />
            <Stack.Screen name="Liviksquadregister" component={Liviksquadregister} options={{ headerShown: false }} />

            <Stack.Screen name="Erangelsoloregister" component={Erangelsoloregister} options={{ headerShown: false }} />
            <Stack.Screen name="Erangelduoregister" component={Erangelduoregister} options={{ headerShown: false }} />
            <Stack.Screen name="Erangelsquadregister" component={Erangelsquadregister} options={{ headerShown: false }} />

            <Stack.Screen name="Nusas oloregister" component={Nusasoloregister} options={{ headerShown: false }} />
            <Stack.Screen name="Nusaduoregister" component={Nusaduoregister} options={{ headerShown: false }} />
            <Stack.Screen name="Nusasquadregister" component={Nusasquadregister} options={{ headerShown: false }} />

            <Stack.Screen name="Shanoksoloregister" component={Shanoksoloregister} options={{ headerShown: false }} />
            <Stack.Screen name="Shanokduoregister" component={Shanokduoregister} options={{ headerShown: false }} />
            <Stack.Screen name="Shanoksquadregister" component={Shanoksquadregister} options={{ headerShown: false }} />

            <Stack.Screen name="Esportsarena" component={Esportsarena} options={{ headerShown: false }} />
            <Stack.Screen name="Inventory" component={Inventory} options={{ headerShown: false }} />
            <Stack.Screen name="Library" component={Library} options={{ headerShown: false }} />
            <Stack.Screen name="Livikultimatearena" component={Livikultimatearena} options={{ headerShown: false }} />
            <Stack.Screen name="Erangelultimatearena" component={Erangelultimatearena} options={{ headerShown: false }} />
            <Stack.Screen name="Ruins" component={Ruins} options={{ headerShown: false }} />
            <Stack.Screen name="Town" component={Town} options={{ headerShown: false }} />
            <Stack.Screen name="Hangerarenatraining" component={Hangerarenatraining} options={{ headerShown: false }} />
            <Stack.Screen name="Hangertdm" component={Hangertdm} options={{ headerShown: false }} />
            <Stack.Screen name="Hangertgm" component={Hangertgm} options={{ headerShown: false }} />

            <Stack.Screen
              name="TournamentRegister"
              component={TournamentRegister}
              options={{ headerShown: false }}
            />

            <Stack.Screen name="Settings" component={SettingsHomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SettingsAccount" component={SettingsAccountScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SettingsMembership" component={SettingsMembershipScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SettingsPrivacy" component={SettingsPrivacyScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SettingsPreferences" component={SettingsPreferencesScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SettingsTournaments" component={SettingsTournamentsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SettingsSupport" component={SettingsSupportScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SettingsLegal" component={SettingsLegalScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SettingsAbout" component={SettingsAboutScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SettingsAdvanced" component={SettingsAdvancedScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SettingsDiagnostics" component={SettingsDiagnosticsScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>

      <AppDialogHost />
    </SafeAreaProvider>
  );
}
