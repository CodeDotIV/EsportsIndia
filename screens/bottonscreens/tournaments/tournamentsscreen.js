import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { wp, hp, rf, rs } from '../../../utils/responsive';

const games = [
  { id: '1', name: 'BGMI', image: require('../../../assets/images/bgmilogo.png') },
  { id: '2', name: 'Freefire', image: require('../../../assets/images/freefirelogo.png'), screen: 'Freefire' },
  { id: '3', name: 'Call of Duty', image: require('../../../assets/images/callofduty.png'), screen: 'Callofduty' },
  { id: '4', name: 'Valorant', image: require('../../../assets/images/valorant.png'), screen: 'Valorant' },
];

const bgmiCategories = [
  { category: 'Classic', maps: ['Erangel'] },
  { category: 'Mini - Classic', maps: ['Nusa', 'Livik'] },
  { category: 'Arena', maps: ['Team Death Match'] },
];

export default function TournamentsScreen() {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('Active');
  const [selectedGame, setSelectedGame] = useState('');
  const [showBgmiCards, setShowBgmiCards] = useState(false);
  const [season, setSeason] = useState('1');
  const tabs = ['Active', 'Upcoming'];

  const handleCardPress = (game) => {
    if (game.name === 'BGMI') {
      setShowBgmiCards(true);
      setSelectedGame(game.name);
    } else {
      Alert.alert('Coming Soon', `${game.name} tournaments will be available soon.`);
    }
  };

  const handleBackToGames = () => {
    setShowBgmiCards(false);
    setSelectedGame('');
    setSeason('1');
  };

  const handleMapPress = (map, category) => {
    navigation.navigate('TournamentRegister', { game: selectedGame, map, category });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={rs(28)} color="#FFD700" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Ionicons name="trophy" size={rs(24)} color="#FFD700" />
            <Text style={styles.title}>Tournaments</Text>
          </View>
        </View>
      </View>

      {/* Back to Game */}
      {showBgmiCards && (
        <TouchableOpacity style={styles.backToBgmiBtn} onPress={handleBackToGames} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={rs(18)} color="#FFD700" />
          <Text style={styles.backToBgmiText}>{selectedGame}</Text>
        </TouchableOpacity>
      )}

      {/* Events Row */}
      <View style={styles.eventsRow}>
        <View style={styles.eventsTitleContainer}>
          <Ionicons name="calendar" size={rs(22)} color="#FFD700" />
          <Text style={styles.eventsTitle}>Events</Text>
        </View>
        {showBgmiCards && (
          <TouchableOpacity style={styles.seasonDropdown} activeOpacity={0.8}>
            <Ionicons name="star" size={rs(14)} color="#FFD700" />
            <Text style={styles.seasonText}>Season {season}</Text>
            <Ionicons name="chevron-down" size={rs(14)} color="#FFD700" />
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsWrapper}>
          {tabs.map((tab) => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setSelectedTab(tab)} 
              style={[
                styles.tabButton,
                selectedTab === tab && styles.tabButtonActive
              ]}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.tabText, 
                selectedTab === tab && styles.tabTextActive
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Game or BGMI Map Cards */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.cardsContainer} 
        showsVerticalScrollIndicator={false}
      >
        {showBgmiCards ? (
          bgmiCategories.map((category) => (
            <View key={category.category} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Ionicons 
                  name={
                    category.category === 'Classic' ? 'map' : 
                    category.category === 'Mini - Classic' ? 'map-outline' : 
                    'people'
                  } 
                  size={rs(20)} 
                  color="#FFD700" 
                />
                <Text style={styles.categoryTitle}>
                  {category.category === 'Mini - Classic'
                    ? 'Mini Classic - Maps'
                    : category.category === 'Classic'
                    ? 'Classic - Map'
                    : category.category}
                </Text>
              </View>
              <View style={styles.mapCardRow}>
                {category.maps.map((map) => (
                  <TouchableOpacity 
                    key={map} 
                    style={styles.mapCard} 
                    onPress={() => handleMapPress(map, category.category)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.mapCardContent}>
                      <Ionicons name="location" size={rs(24)} color="#FFD700" />
                      <Text style={styles.mapCardText}>{map}</Text>
                      <Ionicons name="chevron-forward" size={rs(20)} color="#9CA3AF" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.gamesGrid}>
            {games.map((game) => (
              <TouchableOpacity 
                key={`${selectedTab}-${game.id}`} 
                style={styles.gameCard} 
                onPress={() => handleCardPress(game)}
                activeOpacity={0.8}
              >
                <View style={styles.gameCardInner}>
                  <View style={styles.gameImageContainer}>
                    <Image source={game.image} style={styles.gameImage} resizeMode="contain" />
                    {game.name !== 'BGMI' && (
                      <View style={styles.comingSoonOverlay}>
                        <Text style={styles.comingSoonText}>Coming Soon</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.gameCardInfo}>
                    <Text style={styles.gameCardText}>{game.name}</Text>
                    <View style={styles.gameCardBadge}>
                      <Ionicons name="trophy-outline" size={rs(14)} color="#FFD700" />
                      <Text style={styles.gameCardBadgeText}>Tournament</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

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
  title: {
    fontSize: rf(24),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: wp(2),
  },
  backToBgmiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(1.5),
    marginLeft: wp(5),
    marginBottom: hp(1),
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(3),
    backgroundColor: '#1A1F2E',
    borderRadius: rs(8),
    alignSelf: 'flex-start',
  },
  backToBgmiText: { 
    marginLeft: wp(2), 
    fontSize: rf(14), 
    fontWeight: '600', 
    color: '#FFD700' 
  },
  eventsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp(2),
    marginHorizontal: wp(5),
    marginBottom: hp(1),
  },
  eventsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventsTitle: { 
    fontSize: rf(22), 
    fontWeight: 'bold', 
    color: '#FFFFFF',
    marginLeft: wp(2),
  },
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    flexGrow: 1,
    padding: wp(4),
    paddingBottom: hp(4),
  },
  seasonDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: rs(8),
    backgroundColor: '#1A1F2E',
  },
  seasonText: { 
    fontSize: rf(14), 
    fontWeight: '600', 
    color: '#FFD700',
    marginHorizontal: wp(1.5),
  },
  tabsContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#2A3441',
  },
  tabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#1A1F2E',
    borderRadius: rs(10),
    padding: wp(0.5),
  },
  tabButton: {
    flex: 1,
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
    borderRadius: rs(8),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: '#FFD700',
  },
  tabText: { 
    fontSize: rf(15), 
    color: '#9CA3AF', 
    fontWeight: '600' 
  },
  tabTextActive: { 
    color: '#000000', 
    fontWeight: 'bold' 
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gameCard: {
    width: '48%',
    marginBottom: hp(2.5),
  },
  gameCardInner: {
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
  gameImageContainer: {
    width: '100%',
    height: hp(15),
    backgroundColor: '#0F1419',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameImage: { 
    height: '100%', 
    width: '100%',
  },
  comingSoonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: rf(14),
    fontWeight: 'bold',
    color: '#FFD700',
    textTransform: 'uppercase',
  },
  gameCardInfo: {
    padding: wp(3),
  },
  gameCardText: { 
    fontSize: rf(14), 
    fontWeight: 'bold', 
    color: '#FFFFFF',
    marginBottom: hp(0.8),
    textAlign: 'center',
  },
  gameCardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A3441',
    paddingVertical: hp(0.4),
    paddingHorizontal: wp(2),
    borderRadius: rs(6),
  },
  gameCardBadgeText: {
    fontSize: rf(10),
    color: '#FFD700',
    fontWeight: '600',
    marginLeft: wp(1),
  },
  categorySection: { 
    marginBottom: hp(3),
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
    marginLeft: wp(2),
  },
  categoryTitle: { 
    fontSize: rf(18), 
    fontWeight: 'bold', 
    color: '#FFD700',
    marginLeft: wp(2),
  },
  mapCardRow: { 
    flexDirection: 'column',
    paddingTop: hp(1),
  },
  mapCard: {
    backgroundColor: '#1A1F2E',
    borderRadius: rs(12),
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderColor: '#2A3441',
    elevation: 2,
    //shadowColor: '#000',
    //shadowOffset: { width: 0, height: 1 },
    //shadowOpacity: 0.2,
    //shadowRadius: 2,
  },
  mapCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
  },
  mapCardText: { 
    flex: 1,
    fontSize: rf(16), 
    fontWeight: '600', 
    color: '#FFFFFF',
    marginLeft: wp(2),
  },
});
