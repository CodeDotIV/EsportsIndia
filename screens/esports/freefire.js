import React, { useCallback } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, 
  StyleSheet, Image, SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { wp, hp, rf, rs } from '../../utils/responsive';

// Import the Livik image
const livik = require('../../assets/images/livik.jpg');

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
        <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
      </TouchableOpacity>
      <Text style={styles.cardText}>{item.name}</Text>
    </View>
  );

  const renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionTitle}>{section.title}</Text> // Ensure section.title is being passed
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText} numberOfLines={1}>Free Fire</Text>
      </View>

      {/* FlatList for sections */}
      <FlatList
        data={sections}
        style={styles.flatList}
        renderItem={({ item }) => (
          <FlatList
            data={item.data}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            numColumns={2}  // Display items in two columns
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => renderSectionHeader({ section: item })}
            nestedScrollEnabled={true}
            scrollEnabled={false}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        bounces={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1419',
  },
  header: {
    backgroundColor: '#1A1F2E',
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(5),
    borderBottomWidth: 1,
    borderBottomColor: '#2A3441',
  },
  headerText: {
    fontSize: rf(20),
    fontWeight: 'bold',
    color: '#FFFFFF',
    flexShrink: 1,
  },
  sectionTitle: {
    fontSize: rf(20),
    fontWeight: 'bold',
    marginTop: hp(2),
    marginHorizontal: wp(5),
    marginBottom: hp(1),
    color: '#FFFFFF',
  },
  flatList: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: hp(4),
    paddingHorizontal: wp(3),
  },
  grid: {
    paddingTop: hp(1),
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    margin: wp(2),
  },
  card: {
    width: '100%',
    aspectRatio: 1.55,
    backgroundColor: '#1A1F2E',
    borderRadius: rs(12),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardText: {
    fontSize: rf(13),
    fontWeight: '600',
    marginTop: hp(0.7),
    textAlign: 'center',
    color: '#FFFFFF',
  },
});

export default GameScreen;
