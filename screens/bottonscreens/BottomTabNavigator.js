import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from './HomeScreen';
import EsportsScreen from './EsportsScreen';
import TournamentsScreen from './tournamentsscreen';
import LearnScreen from './LearnScreen';
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
        else if (route.name === 'Learn') iconName = 'school';
        else if (route.name === 'Profile') iconName = 'person';
        return <Icon name={iconName} size={32} color={color} />; // Set size to 32
      },
      tabBarActiveTintColor: '#8A0D52',
      tabBarInactiveTintColor: '#ccc',
      tabBarShowLabel: true, // Hide labels
      tabBarStyle: {
        height: 70,
        paddingBottom: 10,
        paddingTop: 14,
      },
      tabBarItemStyle: {
        flex:1.5, // Ensure equal width
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Esports" component={EsportsScreen} />
    <Tab.Screen name="Tournaments" component={TournamentsScreen} />
    <Tab.Screen name="Learn" component={LearnScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
  
  );
}