import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Alert, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const games = [
  { id: '1', name: 'Battle Grounds Mobile India', image: require('../../assets/images/bgmilogo.png'), screen: 'Esportsarena' },
  { id: '2', name: 'Call of Duty', image: require('../../assets/images/callofduty.png'), screen: 'Callofduty' },
  { id: '3', name: 'FreeFire', image: require('../../assets/images/freefirelogo.png'), screen: 'Freefire' },
  { id: '4', name: 'Valorant', image: require('../../assets/images/valorant.png'), screen: 'valorant' },
];

export default function EsportsScreen() {
  const navigation = useNavigation();

  const handlePress = (screen, name) => {
    if (screen === 'Freefire' || screen === 'Callofduty' || screen === 'valorant') {
      Alert.alert('Coming Soon', `${name} will be available soon!`);
      return;
    }
    navigation.navigate(screen);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.gameContainer} onPress={() => handlePress(item.screen, item.name)}>
      <Image source={item.image} style={styles.gameImage} />
      <Text style={styles.gameName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Esports</Text>
      </View>
      <View style={styles.headerLine} />

      {/* Game Grid */}
      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}               // Keep static to avoid errors
        key="two-column"             // Forces FlatList to render properly
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={{ justifyContent: 'space-around', marginBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141E30', // dark background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    marginRight: 10,
    paddingTop: 0, // original layout spacing
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    paddingTop: 0, // original layout
  },
  listContent: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  gameContainer: {
    alignItems: 'center',
    width: width * 0.45, // keeps original approximate width
    marginVertical: 18,
  },
  gameImage: {
    height: 120,
    width: '100%', // fills container width
    borderRadius: 18,
  },
  gameName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 25, // keep spacing consistent
    color: '#FFF',
    textAlign: 'center',
  },
  headerLine: {
    height: 1,
    width: '100%',
    backgroundColor: '#FFD700',
    marginVertical: 5,
  },
});
