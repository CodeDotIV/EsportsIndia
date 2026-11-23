import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { hp, rf, wp } from '../../utils/responsive';
import { searchTeams } from '../../services/userProfile';

export default function ExploreScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [teams, setTeams] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const normalizedQuery = query.trim();

  useEffect(() => {
    if (!normalizedQuery) {
      setTeams([]);
      setSearching(false);
      setSearchError('');
      return undefined;
    }

    let active = true;
    setTeams([]);
    setSearching(true);
    setSearchError('');
    const searchTimeout = setTimeout(async () => {
      try {
        const results = await searchTeams(normalizedQuery);
        if (active) setTeams(results);
      } catch (error) {
        console.error('Failed to search teams:', error);
        if (active) {
          setTeams([]);
          setSearchError('Team search is unavailable. Check your connection and Supabase setup.');
        }
      } finally {
        if (active) setSearching(false);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(searchTimeout);
    };
  }, [normalizedQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Back to Home"
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.heading}>Explore</Text>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search teams"
          placeholderTextColor="#9CA3AF"
          returnKeyType="search"
          accessibilityLabel="Search teams"
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => setQuery('')}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        style={styles.results}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {searching && (
          <View style={styles.statusRow}>
            <ActivityIndicator color="#FFD700" />
            <Text style={styles.statusMessage}>Searching teams...</Text>
          </View>
        )}
        {searchError ? (
          <Text style={styles.emptyMessage}>{searchError}</Text>
        ) : (
          teams.map((teamName) => (
            <View key={teamName.toLowerCase()} style={styles.resultRow}>
              <Ionicons name="people-outline" size={20} color="#FFD700" />
              <Text style={styles.resultTitle}>{teamName}</Text>
            </View>
          ))
        )}
        {normalizedQuery && !searching && !searchError && teams.length === 0 && (
          <Text style={styles.emptyMessage}>No teams found.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141E30',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.5),
  },
  backButton: {
    marginRight: wp(2),
    padding: wp(1),
  },
  heading: {
    color: '#FFFFFF',
    fontSize: rf(18),
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginHorizontal: wp(5),
    marginTop: hp(1),
    paddingHorizontal: wp(3),
    minHeight: 46,
    backgroundColor: '#1A1F2E',
    borderWidth: 1,
    borderColor: '#2A3441',
    borderRadius: 23,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: '#FFFFFF',
    fontSize: rf(14),
    paddingVertical: hp(1),
    outlineStyle: 'none',
  },
  results: {
    flex: 1,
    marginHorizontal: wp(5),
    marginTop: hp(1),
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
    paddingVertical: hp(1.5),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2A3441',
  },
  resultTitle: {
    color: '#FFFFFF',
    fontSize: rf(15),
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(2),
    marginTop: hp(3),
  },
  statusMessage: {
    color: '#9CA3AF',
    fontSize: rf(14),
  },
  emptyMessage: {
    color: '#9CA3AF',
    fontSize: rf(14),
    textAlign: 'center',
    marginTop: hp(3),
  },
});
