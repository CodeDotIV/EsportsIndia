import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const games = [
  {
    id: '1',
    name: 'Battle Grounds Mobile India',
    image: require('../../../assets/images/bgmilogo.png'),
  },
  {
    id: '2',
    name: 'Freefire',
    image: require('../../../assets/images/freefirelogo.png'),
    screen: 'Freefire',
  },
  {
    id: '3',
    name: 'Call of Duty',
    image: require('../../../assets/images/callofduty.png'),
    screen: 'Callofduty',
  },
  {
    id: '4',
    name: 'Valorant',
    image: require('../../../assets/images/valorant.png'),
    screen: 'Valorant',
  },
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
    navigation.navigate('TournamentRegister', {
      game: selectedGame,
      map: map,
      category: category,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Tournaments</Text>
      </View>

      {/* Back to Game */}
      {showBgmiCards && (
        <TouchableOpacity style={styles.backToBgmiBtn} onPress={handleBackToGames}>
          <Ionicons name="arrow-back" size={16} />
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
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={styles.tabButton}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextSelected,
              ]}
            >
              {tab}
            </Text>
            {selectedTab === tab && <View style={styles.smallUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Game or BGMI Map Cards */}
      <ScrollView
        contentContainerStyle={styles.cardsContainer}
        showsVerticalScrollIndicator={false}
      >
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
                  <TouchableOpacity
                    key={map}
                    style={styles.mapCard}
                    onPress={() => handleMapPress(map, category.category)}
                  >
                    <Text style={styles.mapCardText}>{map}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        ) : (
          games.map((game) => (
            <TouchableOpacity
              key={`${selectedTab}-${game.id}`}
              style={styles.gameCard}
              onPress={() => handleCardPress(game)}
            >
              <Image source={game.image} style={styles.gameImage} />
              <Text style={styles.gameCardText}>{game.name}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 0 },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5a623', padding: 20 },
  backButton: { marginRight: 10, paddingTop: 40 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#000', paddingTop: 38 },
  eventsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginLeft: 20, gap: 150 },
  eventsTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginLeft: 10 },
  seasonDropdown: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'red', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, marginLeft: 28 },
  seasonText: { fontSize: 14, fontWeight: '500', color: '#444' },
  backToBgmiBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 28, marginLeft: 20, marginBottom: 10 },
  backToBgmiText: { marginLeft: 6, fontSize: 14, fontWeight: '500', color: '#007aff' },
  tabsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 30, paddingBottom: 5 },
  tabButton: { alignItems: 'center', paddingHorizontal: 10 },
  tabText: { fontSize: 14, color: '#888', fontWeight: '600' },
  tabTextSelected: { color: '#000' },
  smallUnderline: { marginTop: 4, height: 4.5, width: 45, borderRadius: 2, backgroundColor: 'red' },
  cardsContainer: { padding: 16 },
  gameCard: { marginTop: 10, paddingVertical:5, paddingHorizontal: 20,  marginBottom: 22, alignSelf: 'center', width: '78%', justifyContent: 'center', alignItems: 'center' },
  gameImage: {
    height: 125,
    width: '240',
    borderRadius: 18,
    marginVertical: 0,
  },  gameCardText: { marginTop:28,fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  mapCard: { backgroundColor: '#f0f0f0', paddingVertical: 40, paddingHorizontal: 50, borderRadius: 12, marginBottom: 18, alignItems: 'center', borderColor: '#bbb', borderWidth: 0.5, width: '65%' },
  mapCardText: { fontSize: 18, fontWeight: '500', color: '#333' },
  categorySection: { marginBottom: 30 },
  categoryTitle: { fontSize: 18, fontWeight: 'bold', color: '#444', marginBottom: 1, marginLeft: 36, marginTop: 15 },
  mapCardRow: { flexDirection: 'column', alignItems: 'center', paddingTop: 20 },
});
