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
  const [showBgmiCards, setShowBgmiCards] = useState(false);
  const tabs = ['Active', 'Upcoming', 'Past'];

  const handleCardPress = (game) => {
    if (game === 'Battlegrounds Mobile India') {
      setShowBgmiCards((prev) => !prev);
    } else {
      Alert.alert('Coming Soon', `${game} tournaments will be available soon.`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Tournaments</Text>
      </View>

      {/* Events Title */}
      <Text style={styles.eventsTitle}>Events</Text>

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

      {/* Game Cards */}
      <ScrollView contentContainerStyle={styles.cardsContainer}>
        {games.map((game) => (
          <View key={`${selectedTab}-${game}`}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleCardPress(game)}
            >
              <Text style={styles.cardText}>{game}</Text>
            </TouchableOpacity>

            {/* Show BGMI Category Cards */}
            {game === 'Battlegrounds Mobile India' && showBgmiCards && (
              <View style={styles.bgmiCardContainer}>
                {bgmiCategories.map((section) => (
                  <View key={section.category} style={styles.bgmiSection}>
                    <Text style={styles.bgmiCategory}>{section.category}</Text>
                    {section.maps.map((map) => (
                      <View key={map} style={styles.bgmiCard}>
                        <Text style={styles.bgmiCardText}>{map}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
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
  backButton: { marginRight: 10, paddingTop: 28 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#000', paddingTop: 25 },

  eventsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginLeft: 20,
  },

  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 42,
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

  card: {
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
    borderWidth: 0.2,
  },

  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },

  bgmiCardContainer: {
    paddingLeft: 25,
    paddingTop: 10,
    paddingBottom: 20,
  },

  bgmiSection: {
    marginBottom: 16,
  },

  bgmiCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },

  bgmiCard: {
    backgroundColor: '#eaeaea',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginVertical: 4,
    marginLeft: 10,
    alignSelf: 'flex-start',
  },

  bgmiCardText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
  },
});
