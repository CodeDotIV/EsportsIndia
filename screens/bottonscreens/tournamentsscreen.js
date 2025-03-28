import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Updated Tournament Data
const tournaments = [
  {
    id: '1',
    name: 'TDM',
    game: 'TDM Mode',
    startDate: '2025-03-21',
    endDate: '2025-03-22',
  },
  {
    id: '2',
    name: 'Livik',
    game: 'Livik Mode',
    startDate: '2025-03-23',
    endDate: '2025-03-23',
  },
  {
    id: '3',
    name: 'Nusa',
    game: 'Nusa Mode',
    startDate: '2025-03-24',
    endDate: '2025-03-24',
  },
];

// Helper function to calculate time left
const getTimeLeft = (targetDate) => {
  const now = new Date();
  const eventDate = new Date(targetDate);
  const difference = eventDate - now;

  if (difference <= 0) return 'Event Started';

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60)) / (1000 * 60));

  return `${days}d ${hours}h ${minutes}m`;
};

// Tournament Card Component
const TournamentCard = ({ name, game, startDate, endDate }) => {
  const [countdown, setCountdown] = useState(getTimeLeft(startDate));
  const [eventEnded, setEventEnded] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      setCountdown(getTimeLeft(startDate));
      setEventEnded(new Date() > new Date(endDate));
    };

    updateCountdown(); // Ensure it updates immediately
    const timer = setInterval(updateCountdown, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, [startDate, endDate]);

  return (
    <TouchableOpacity disabled={eventEnded} style={[styles.card, eventEnded && styles.cardDisabled]}>
      <View style={styles.countdownContainer}>
        <Text style={styles.countdown}>{eventEnded ? 'Event Ended' : countdown}</Text>
      </View>
      <Text style={styles.tournamentName}>{name}</Text>
      <Text style={styles.game}>{game}</Text>
      <Text style={styles.date}>Start Date: {startDate}</Text>
      <Text style={styles.date}>End Date: {endDate}</Text>
    </TouchableOpacity>
  );
};

// Main Screen Component
export default function TournamentsScreen() {
  const navigation = useNavigation();

  // Handle Tooltip Press
  const handlePress = () => {
    Alert.alert(
      'Note : ',
      '1. TDM is a fast-paced mode\n2. Livik is a small map for quick matches\n3. Nusa is the latest map with new challenges',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
  <TouchableOpacity
    onPress={() => navigation.goBack()}
    style={styles.backButton}
  >
    <Ionicons name="chevron-back" size={24} color="black" />
  </TouchableOpacity>
  <Text style={styles.title}>Tournaments</Text>
</View>

      {/* Livik Title with Tooltip Icon */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Upcoming Events</Text>
        <Pressable onPress={handlePress}>
          <Ionicons name="information-circle-outline" size={18} color="black" style={styles.tooltipIcon} />
        </Pressable>
      </View>

      {/* Tournament List */}
      <FlatList
        data={tournaments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TournamentCard
            name={item.name}
            game={item.game}
            startDate={item.startDate}
            endDate={item.endDate}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.noEvents}>No events found.</Text>}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5a623', padding: 20 },
  backButton: { marginRight: 10, paddingTop: 28 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#000', paddingTop: 25 },
  card: { backgroundColor: '#FFF', padding: 20, margin: 10, borderRadius: 10 },
  cardDisabled: { opacity: 0.5 },
  countdownContainer: { position: 'absolute', top: 10, right: 10, backgroundColor: '#D32F2F', padding: 8, borderRadius: 8 },
  countdown: { fontSize: 12, color: '#FFF', fontWeight: 'bold' },
  tournamentName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  game: { fontSize: 14, color: '#666', marginTop: 5 },
  date: { fontSize: 14, color: '#8A0D52', marginTop: 5 },
  noEvents: { textAlign: 'center', marginTop: 50, fontSize: 18, color: '#666' },
  tooltipWrapper: {
    position: 'absolute',
    top: 0,
    right: -18, // Adjust to position it properly as superscript
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align for superscript
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    paddingTop: 25,
    position: 'relative', // Ensure relative position for superscript
  },
});
