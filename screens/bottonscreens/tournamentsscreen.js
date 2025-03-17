import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Tournament Data
const tournaments = [
  {
    id: '1',
    name: 'Battle Grounds Mobile India',
    game: 'Battle Grounds Mobile India',
    startDate: '2025-02-01',
    endDate: '2025-03-10',
  },
  {
    id: '2',
    name: 'FreeFire',
    game: 'FreeFire',
    startDate: '2025-03-11',
    endDate: '2025-03-11',
  },
  {
    id: '3',
    name: 'Call of Duty',
    game: 'Call of Duty',
    startDate: '2025-03-20',
    endDate: '2025-03-30',
  },
  {
    id: '4',
    name: 'CS2 Invitational',
    game: 'CS2 Invitational',
    startDate: '2025-03-25',
    endDate: '2025-04-05',
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
    const timer = setInterval(updateCountdown, 10); // Update every second

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
  const [filterStatus, setFilterStatus] = useState(2); // 1: upcoming, 2: active, 3: past
  const [filterGame, setFilterGame] = useState('');

  const filterTournaments = () => {
    const now = new Date();
    return tournaments.filter((tournament) => {
      const start = new Date(tournament.startDate);
      const end = new Date(tournament.endDate);

      let statusMatch = false;
      if (filterStatus === 3 && now > end) statusMatch = true;
      if (filterStatus === 2 && now >= start && now <= end) statusMatch = true;
      if (filterStatus === 1 && now < start) statusMatch = true;

      const gameMatch = filterGame
        ? tournament.game.toLowerCase().includes(filterGame.toLowerCase())
        : true;

      return statusMatch && gameMatch;
    });
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Tournaments</Text>
      </View>

      {/* Filter Section */}
      <View style={styles.filterCard}>
        <Text style={styles.filterTitle}>Filters</Text>

        {/* Event Status Filter */}
        <View style={styles.filterRow}>
          {[
            { id: 1, label: 'Upcoming' },
            { id: 2, label: 'Active' },
            { id: 3, label: 'Past' },
          ].map((status) => (
            <TouchableOpacity
              key={status.id}
              style={[styles.filterButton, filterStatus === status.id && styles.activeFilter]}
              onPress={() => setFilterStatus(status.id)}
            >
              <Text style={styles.filterButtonText}>{status.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tournament List */}
      <FlatList
        data={filterTournaments()}
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
  backButton: { marginRight: 10 , paddingTop:28},
  title: { fontSize: 22, fontWeight: 'bold', color: '#000',paddingTop:25, },
  filterCard: { backgroundColor: '#fff', padding: 20, borderRadius: 10 },
  filterTitle: { fontSize: 20, fontWeight: 'bold' },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  filterLabel: { fontSize: 16, fontWeight: 'bold', marginRight: 10 },
  filterButton: { backgroundColor: '#ccc', padding: 8, margin: 5, borderRadius: 10 },
  activeFilter: { backgroundColor: '#f5a623' },
  filterButtonText: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#FFF', padding: 20, margin: 10, borderRadius: 10 },
  cardDisabled: { opacity: 0.5 },
  countdownContainer: { position: 'absolute', top: 10, right: 10, backgroundColor: '#D32F2F', padding: 8, borderRadius: 8 },
  countdown: { fontSize: 14, color: '#FFF', fontWeight: 'bold' },
  tournamentName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  game: { fontSize: 14, color: '#666', marginTop: 5 },
  date: { fontSize: 14, color: '#8A0D52', marginTop: 5 },
  noEvents: { textAlign: 'center', marginTop: 50, fontSize: 18, color: '#666' },
});
