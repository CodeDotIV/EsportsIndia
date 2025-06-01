import React, { useCallback } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, 
  StyleSheet, Image 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import the Livik image
const livik = require('../assets/images/livik.png');

const GameScreen = () => {
  const navigation = useNavigation();

  const arenaData = [
    { name: 'Inventory', screen: 'Register', image: livik },
    { name: 'Ruins', screen: 'Register', image: livik },
    { name: 'Town - Domination', screen: 'Register', image: livik },
    { name: 'Libraby', screen: 'TDM', image: livik },
    { name: 'Hanger - TDM', screen: 'TDM', image: livik },
    { name: 'Hanger - TGM', screen: 'TDM', image: livik },
    { name: 'Hanger - Arena training', screen: 'TDM', image: livik },
    { name: 'Livik - Ultimate Arena', screen: 'TDM', image: livik },
    { name: 'Erangel - Ultimate Arena', screen: 'TDM', image: livik },
  ];

  const handlePress = useCallback((screen) => {
    console.log('Navigating to:', screen);
    navigation.navigate(screen);
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.card} onPress={() => handlePress(item.screen)}>
        <Image source={item.image} style={styles.cardImage} />
      </TouchableOpacity>
      <Text style={styles.cardText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Battle Grounds Mobile India</Text>
      </View>

      {/* Section Title */}
      <Text style={styles.sectionTitle}>Arena</Text>

      {/* Arena Grid */}
      <FlatList
        data={arenaData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#f5f5f5', padding: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5a623',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 55,
    zIndex: 10,
  },
  headerText: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginLeft: 26,
    color: '#333',
  },
  grid: {
    gap: 10,
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 25,
   // flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    width: 150,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
  },
});

export default GameScreen;
