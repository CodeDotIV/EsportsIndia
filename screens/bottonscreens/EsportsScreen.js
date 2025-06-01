import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const games = [
  {
    id: '1',
    name: 'Battle Grounds Mobile India',
    image: require('../../assets/images/bgmilogo.png'),
    screen: 'Esportsarena',
  },
  {
    id: '3',
    name: 'FreeFire',
    image: require('../../assets/images/freefirelogo.png'),
    screen: 'Freefire',
  },
  {
    id: '2',
    name: 'Call of Duty',
    image: require('../../assets/images/callofduty.png'),
    screen: 'Callofduty',
  },
];

export default function EsportsScreen() {
  const navigation = useNavigation();

  const handlePress = (screen, name) => {
    if (screen === 'Freefire' || screen === 'Callofduty') {
      Alert.alert('Coming Soon', `${name} will be available soon!`);
      return;
    }

    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      {/* Header Section with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Esports</Text>
      </View>

      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.gameContainer}
            onPress={() => handlePress(item.screen, item.name)}
          >
            <Image source={item.image} style={styles.gameImage} />
            <Text style={styles.gameName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5a623',
    padding: 20,
  },
  backButton: {
    marginRight: 10,
    paddingTop: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    paddingTop: 23,
  },
  gameContainer: {
    alignItems: 'center',
    marginVertical: 25,
  },
  gameImage: {
    height: 120,
    width: '48%',
    borderRadius: 18,
    marginVertical: 0,
  },
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
