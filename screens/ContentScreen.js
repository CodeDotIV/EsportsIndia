import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screen components
const EsportsScreen = () => (
  <View><Text>Esports Screen</Text></View>
);
const LearnScreen = () => (
  <View><Text>Learn Screen</Text></View>
);
const ProfileScreen = () => (
  <View><Text>Profile Screen</Text></View>
);
const HomeScreen = () => (
  <View><Text>Home Screen</Text></View>
);

// Tab Navigator
const Tab = createBottomTabNavigator();

export default function ContentScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Ensures no top header
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Esports') iconName = 'sports-esports';
          else if (route.name === 'Learn') iconName = 'school';
          else if (route.name === 'Profile') iconName = 'person';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#8A0D52',
        tabBarInactiveTintColor: '#ccc',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTitle: "" }} // Removes the "Home" title
      />
      <Tab.Screen name="Esports" component={EsportsScreen} />
      <Tab.Screen name="Learn" component={LearnScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
