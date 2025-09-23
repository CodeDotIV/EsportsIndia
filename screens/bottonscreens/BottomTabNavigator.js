import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from './HomeScreen';
import EsportsScreen from './EsportsScreen';
import TournamentsScreen from './tournaments/tournamentsscreen';
import WinnersScreen from './WinnersScreen';
import ProfileScreen from './ProfileScreen';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Esports') iconName = 'sports-esports';
          else if (route.name === 'Tournaments') iconName = 'emoji-events';
          else if (route.name === 'Winners') iconName = 'military-tech';
          else if (route.name === 'Profile') iconName = 'person';
          return <Icon name={iconName} size={32} color={color} />;
        },
        tabBarInactiveTintColor: '#ccc',
        tabBarStyle: {
          height: 90,
          paddingBottom: 10,
          paddingTop: 14,
          backgroundColor: 'transparent',
        },
        tabBarItemStyle: {
          flex: 1.5,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['#141E30', '#243B55']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Esports" component={EsportsScreen} />
      <Tab.Screen name="Tournaments" component={TournamentsScreen} />
      <Tab.Screen name="Winners" component={WinnersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
