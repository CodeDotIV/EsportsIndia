import React, { useCallback } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, 
  StyleSheet, Image, StatusBar 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Import the Livik image
const livik = require('../../assets/images/livik.png');

const GameScreen = () => {
  const navigation = useNavigation();

  const sections = [
    {
      title: 'Classic',
      data: [
        { name: 'Livik', screen: 'Livik', image: livik },
        { name: 'Erangel', screen: 'Erangel', image: livik },
        { name: 'Nusa', screen: 'Nusa', image: livik },
        { name: 'Shanok', screen: 'Shanok', image: livik },
      ],
    },
    {
      title: 'Arena',
      data: [
        { name: 'Inventory', screen: 'Register', image: livik },
        { name: 'Ruins', screen: 'Register', image: livik },
        { name: 'Town - Domination', screen: 'Register', image: livik },
        { name: 'Libraby', screen: 'TDM', image: livik },
        { name: 'Hanger - TDM', screen: 'TDM', image: livik },
        { name: 'Hanger - TGM', screen: 'TDM', image: livik },
        { name: 'Hanger - Areana training', screen: 'TDM', image: livik },
        { name: 'Livik - Ultimate Arena', screen: 'TDM', image: livik },
        { name: 'Erangel - Ultimate Areana', screen: 'TDM', image: livik },
       // { name: 'Hanger - TGM', screen: 'TDM', image: livik },
      ],
    },
    // {
    //   title: 'WOW',
    //   data: [
    //     { name: 'TDM Map 1', screen: 'Register', image: livik },
    //     { name: 'Arena Training', screen: 'Register', image: livik },
    //     { name: 'Hanger', screen: 'Register', image: livik },
    //     { name: 'Desert', screen: 'Desert', image: livik },
    //   ],
    // },
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

  const renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionTitle}>{section.title}</Text> // Ensure section.title is being passed
  );

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.headerText}>Battle Grounds Mobile India</Text>
      </View>

      {/* FlatList for sections */}
      <FlatList
        data={sections}
        renderItem={({ item }) => (
          <FlatList
            data={item.data}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            numColumns={2}  // Display items in two columns
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => renderSectionHeader({ section: item })}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
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
    backgroundColor: '#f5a623', paddingTop: 50, alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingTop:30,
    color: '#000',
    marginBottom:30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 30,
    marginLeft: 26,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  grid: {
    gap: 10,
    paddingTop: 10,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
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
    marginTop: 5,
    textAlign: 'center',
  },
});

export default GameScreen;
