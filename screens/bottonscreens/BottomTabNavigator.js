import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from './HomeScreen';
import ExploreScreen from './ExploreScreen';
import TournamentsScreen from './tournaments/tournamentsscreen';
import ConnectScreen from './ConnectScreen';
import PlansScreen from './PlansScreen';
import ProfileScreen from './ProfileScreen';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = Math.max(72, 64 + insets.bottom);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Explore') iconName = 'explore';
          else if (route.name === 'Tournaments') iconName = 'emoji-events';
          else if (route.name === 'Connect') iconName = 'people';
          else if (route.name === 'Plans') iconName = 'card-membership';
          else if (route.name === 'Profile') iconName = 'person';
          return <Icon name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
        tabBarStyle: {
          height: tabBarHeight,
          paddingBottom: Math.max(8, insets.bottom),
          paddingTop: 8,
          backgroundColor: 'transparent',
        },
        tabBarItemStyle: {
          flex: 1,
          minWidth: 0,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['#141E30', '#243B55']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarAccessibilityLabel: `${route.name} tab`,
      })}
      detachInactiveScreens={Platform.OS === 'web' ? false : true}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Tournaments" component={TournamentsScreen} />
      <Tab.Screen name="Connect" component={ConnectScreen} />
      <Tab.Screen
        name="Plans"
        component={PlansScreen}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' },
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
