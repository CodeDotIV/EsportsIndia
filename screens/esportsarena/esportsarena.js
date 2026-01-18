import React, { useCallback } from 'react';
import {
  View, 
  Text, 
  FlatList, 
  TouchableOpacity,
  StyleSheet, 
  Image,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { wp, hp, rf, rs } from '../../utils/responsive';

const livik = require('../../assets/images/livik.png');

const GameScreen = () => {
  const navigation = useNavigation();

  const arenaData = [
    { name: 'Inventory', screen: 'Inventory', image: livik, icon: 'cube-outline' },
    { name: 'Ruins', screen: 'Ruins', image: livik, icon: 'location-outline' },
    { name: 'Town', screen: 'Town', image: livik, icon: 'business-outline' },
    { name: 'Library', screen: 'Library', image: livik, icon: 'library-outline' },
    { name: 'Hanger TDM', screen: 'Hangertdm', image: livik, icon: 'people-outline' },
    { name: 'Hanger TGM', screen: 'Hangertgm', image: livik, icon: 'trophy-outline' },
    { name: 'Arena Training', screen: 'Hangerarenatraining', image: livik, icon: 'fitness-outline' },
    { name: 'Livik Arena', screen: 'Livikultimatearena', image: livik, icon: 'map-outline' },
    { name: 'Erangel Arena', screen: 'Erangelultimatearena', image: livik, icon: 'map-outline' },
  ];

  const handlePress = useCallback((screen, mode) => {
    navigation.navigate(screen, { mode });
  }, [navigation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.cardContainer}
      onPress={() => handlePress(item.screen, item.name)}
      activeOpacity={0.8}
    >
      <View style={styles.card}>
        <View style={styles.cardImageContainer}>
          <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
        </View>
        <View style={styles.cardInfo}>
          <View style={styles.cardTitleRow}>
            <Ionicons name={item.icon} size={rs(20)} color="#FFD700" />
            <Text style={styles.cardText} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
            <Ionicons name="arrow-forward-circle" size={rs(18)} color="#FFD700" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Ionicons name="trophy" size={rs(22)} color="#FFD700" />
        <Text style={styles.sectionTitle}>Arena Modes</Text>
      </View>

      {/* Arena Grid */}
      <View style={styles.listContainer}>
        <FlatList
          data={arenaData}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          style={styles.flatList}
          nestedScrollEnabled={true}
          bounces={true}
        />
      </View>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    marginTop: hp(1),
  },
  sectionTitle: {
    fontSize: rf(22),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: wp(2),
  },
  listContainer: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  grid: {
    paddingHorizontal: wp(3),
    paddingTop: hp(1),
    paddingBottom: hp(4),
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: wp(1),
  },
  cardContainer: {
    width: '48%',
    marginBottom: hp(2),
  },
  card: {
    backgroundColor: '#1A1F2E',
    borderRadius: rs(16),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A3441',
    elevation: 4,
    //shadowColor: '#000',
    //shadowOffset: { width: 0, height: 2 },
    //shadowOpacity: 0.3,
    //shadowRadius: 4,
  },
  cardImageContainer: {
    width: '100%',
    height: hp(12),
    position: 'relative',
    backgroundColor: '#0F1419',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardInfo: {
    padding: wp(3),
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardText: {
    fontSize: rf(13),
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: wp(2),
    flex: 1,
    textAlign: 'left',
  },
});

export default GameScreen;
