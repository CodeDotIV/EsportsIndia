import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const games = [
  'Battlegrounds Mobile India',
  'Free Fire',
  'Call of Duty',
  'Valorant',
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
  const tabs = ['Active', 'Upcoming']; // 'Past' removed

  const handleCardPress = (game) => {
    if (game === 'Battlegrounds Mobile India') {
      setShowBgmiCards(true);
      setSelectedGame(game);
    } else {
      Alert.alert('Coming Soon', `${game} tournaments will be available soon.`);
    }
  };

  const handleBackToGames = () => {
    setShowBgmiCards(false);
    setSelectedGame('');
    setSeason('1');
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
          <Text style={styles.backToBgmiText}>Battlegrounds Mobile India</Text>
        </TouchableOpacity>
      )}

      {/* Events Row (Events + Season) */}
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
        showsVerticalScrollIndicator={false} // 👈 Hides scrollbar
      >
        {showBgmiCards ? (
          <>
            {bgmiCategories.map((category) => (
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
                    <TouchableOpacity key={map} style={styles.mapCard}>
                      <Text style={styles.mapCardText}>{map}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </>
        ) : (
          games.map((game) => (
            <TouchableOpacity
              key={`${selectedTab}-${game}`}
              style={styles.gameCard}
              onPress={() => handleCardPress(game)}
            >
              <Text style={styles.gameCardText}>{game}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5a623',
    padding: 20,
  },
  backButton: { marginRight: 10, paddingTop: 45 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#000', paddingTop: 45 },

  eventsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 20,
    gap: 150,
  },

  eventsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },

  seasonDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 28,
  },

  seasonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
  },

  backToBgmiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    marginLeft: 20,
    marginBottom: 10,
  },

  backToBgmiText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#007aff',
  },

  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    paddingBottom: 5,
  },

  tabButton: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  tabText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
  },

  tabTextSelected: {
    color: '#000',
  },

  smallUnderline: {
    marginTop: 4,
    height: 4.5,
    width: 45,
    borderRadius: 2,
    backgroundColor: 'red',
  },

  cardsContainer: {
    padding: 16,
  },

  gameCard: {
    marginTop: 15,
    backgroundColor: '#fff',
    padding: 50,
    borderRadius: 18,
    marginBottom: 22,
    alignSelf: 'center',
    width: '78%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 0.4,
    elevation: 2,
  },

  gameCardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },

  mapCard: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 40,
    paddingHorizontal: 50,
    borderRadius: 12,
    marginBottom: 18,
    alignItems: 'center',
    borderColor: '#bbb',
    borderWidth: 0.5,
    width: '65%',
  },

  mapCardText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },

  categorySection: {
    marginBottom: 30,
  },

  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 1,
    marginLeft: 36,
    marginTop: 15,
  },

  mapCardRow: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 20,
  },
});
