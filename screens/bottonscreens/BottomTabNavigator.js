import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from './HomeScreen';
import EsportsScreen from './EsportsScreen';
import TournamentsScreen from './tournamentsscreen';
import WinnersScreen from './WinnersScreen';
import ProfileScreen from './ProfileScreen';

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
          else if (route.name === 'Winners') iconName = 'military-tech'; // ✅ Fixed here
          else if (route.name === 'Profile') iconName = 'person';
          return <Icon name={iconName} size={32} color={color} />;
        },
        tabBarActiveTintColor: '#8A0D52',
        tabBarInactiveTintColor: '#ccc',
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 14,
        },
        tabBarItemStyle: {
          flex: 1.5,
        },
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
