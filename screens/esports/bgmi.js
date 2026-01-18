import React, { useCallback } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, 
  StyleSheet, Image, SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { wp, hp, rf, rs } from '../../utils/responsive';

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
        { name: 'Hanger - Arena training', screen: 'TDM', image: livik },
        { name: 'Livik - Ultimate Arena', screen: 'TDM', image: livik },
        { name: 'Erangel - Ultimate Arena', screen: 'TDM', image: livik },
      ],
    },
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
    <Text style={styles.sectionTitle}>{section.title}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={rs(28)} color="#FFD700" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Ionicons name="game-controller" size={rs(24)} color="#FFD700" />
            <Text style={styles.headerText} numberOfLines={1}>BGMI</Text>
          </View>
        </View>
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
            numColumns={2}
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
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    borderBottomWidth: 2,
    borderBottomColor: '#2A3441',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: wp(3),
    padding: wp(1),
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: rf(20),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: wp(2),
    flexShrink: 1,
  },
  sectionTitle: {
    fontSize: rf(22),
    fontWeight: 'bold',
    marginTop: hp(2),
    marginLeft: wp(5),
    marginBottom: hp(1),
    color: '#FFFFFF',
  },
  flatList: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: hp(4),
    paddingHorizontal: wp(2),
  },
  grid: {
    gap: 10,
    paddingTop: hp(1),
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    margin: wp(2),
  },
  card: {
    width: 150,
    height: 100,
    borderRadius: rs(12),
    overflow: 'hidden',
    elevation: 4,
    //shadowColor: '#000',
    //shadowOffset: { width: 0, height: 2 },
    //shadowOpacity: 0.3,
    //shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardText: {
    fontSize: rf(13),
    fontWeight: '600',
    marginTop: hp(0.5),
    textAlign: 'center',
    color: '#FFFFFF',
  },
});

export default GameScreen;
