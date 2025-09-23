import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const games = [
  { id: '1', name: 'Battle Grounds Mobile India', image: require('../../../assets/images/bgmilogo.png') },
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
    if (game.name === 'Battle Grounds Mobile India') {
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Tournaments</Text>
      </View>

      {/* Back to Game */}
      {showBgmiCards && (
        <TouchableOpacity style={styles.backToBgmiBtn} onPress={handleBackToGames}>
          <Ionicons name="arrow-back" size={16} color="#007aff" />
          <Text style={styles.backToBgmiText}>{selectedGame}</Text>
        </TouchableOpacity>
      )}

      {/* Events Row */}
      <View style={styles.eventsRow}>
        <Text style={styles.eventsTitle}>Events</Text>
        {showBgmiCards && (
          <TouchableOpacity style={styles.seasonDropdown}>
            <Text style={styles.seasonText}>Season - {season}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)} style={styles.tabButton}>
            <Text style={[styles.tabText, selectedTab === tab && styles.tabTextSelected]}>{tab}</Text>
            {selectedTab === tab && <View style={styles.smallUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Game or BGMI Map Cards */}
      <ScrollView contentContainerStyle={styles.cardsContainer} showsVerticalScrollIndicator={false}>
        {showBgmiCards ? (
          bgmiCategories.map((category) => (
            <View key={category.category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>
                {category.category === 'Mini - Classic'
                  ? 'Mini Classic - Maps'
                  : category.category === 'Classic'
                  ? 'Classic - Map'
                  : category.category}
              </Text>
              <View style={styles.mapCardRow}>
                {category.maps.map((map) => (
                  <TouchableOpacity key={map} style={styles.mapCard} onPress={() => handleMapPress(map, category.category)}>
                    <Text style={styles.mapCardText}>{map}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        ) : (
          games.map((game) => (
            <TouchableOpacity key={`${selectedTab}-${game.id}`} style={styles.gameCard} onPress={() => handleCardPress(game)}>
              <Image source={game.image} style={styles.gameImage} resizeMode="contain" />
              <Text style={styles.gameCardText}>{game.name}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141E30' },

  // Header
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

  // Events
  eventsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 20,
  },
  eventsTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  seasonDropdown: {
    borderWidth: 1,
    borderColor: '#f5a623',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  seasonText: { fontSize: 14, fontWeight: '500', color: '#fff' },

  // Back to BGMI
  backToBgmiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginLeft: 20,
    marginBottom: 10,
  },
  backToBgmiText: { marginLeft: 6, fontSize: 14, fontWeight: '500', color: '#007aff' },

  // Tabs
  tabsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 25, paddingBottom: 5 },
  tabButton: { alignItems: 'center', paddingHorizontal: 10 },
  tabText: { fontSize: 14, color: '#bbb', fontWeight: '600' },
  tabTextSelected: { color: '#fff' },
  smallUnderline: { marginTop: 4, height: 4, width: 45, borderRadius: 2, backgroundColor: '#f5a623' },

  // Cards
  cardsContainer: { padding: 16 },
  gameCard: { marginTop: 10, marginBottom: 22, alignSelf: 'center', width: width * 0.75, alignItems: 'center' },
  gameImage: { height: 125, width: '100%', borderRadius: 18 },
  gameCardText: { marginTop: 20, fontSize: 18, fontWeight: 'bold', color: '#fff', textAlign: 'center' },

  // Map Cards
  mapCard: {
    backgroundColor: '#1E2A40',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 18,
    alignItems: 'center',
    width: width * 0.65,
  },
  mapCardText: { fontSize: 18, fontWeight: '500', color: '#fff' },
  categorySection: { marginBottom: 30 },
  categoryTitle: { fontSize: 18, fontWeight: 'bold', color: '#f5a623', marginBottom: 8, marginLeft: 20 },
  mapCardRow: { flexDirection: 'column', alignItems: 'center', paddingTop: 20 },
});
