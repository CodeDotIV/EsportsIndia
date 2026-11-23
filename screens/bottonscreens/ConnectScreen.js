import React, { useEffect, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { hp, rf, wp } from '../../utils/responsive';
import { listRegisteredPlayers } from '../../services/userProfile';

export default function ConnectScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('For you');
  const [players, setPlayers] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const normalizedQuery = query.trim();

  useEffect(() => {
    if (selectedCategory !== 'For you') {
      setPlayers([]);
      setSearching(false);
      setSearchError('');
      return undefined;
    }

    let active = true;
    setPlayers([]);
    setSearching(true);
    setSearchError('');
    const searchTimeout = setTimeout(async () => {
      try {
        const results = await listRegisteredPlayers(normalizedQuery);
        if (active) setPlayers(results);
      } catch (error) {
        console.error('Failed to load registered players:', error);
        if (active) {
          setPlayers([]);
          setSearchError(
            error?.code === 'PGRST202'
              ? 'Player directory setup is missing. Apply the registered-players migration in Supabase and refresh its schema cache.'
              : 'Player directory is unavailable. Check your connection and Supabase setup.'
          );
        }
      } finally {
        if (active) setSearching(false);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(searchTimeout);
    };
  }, [normalizedQuery, selectedCategory]);

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
        <Text style={styles.heading}>Connect</Text>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search players"
          placeholderTextColor="#9CA3AF"
          returnKeyType="search"
          accessibilityLabel="Search players"
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
      <View style={styles.categoryTabs}>
        {['For you', 'Network', 'Chats'].map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <TouchableOpacity
              key={category}
              style={[styles.categoryButton, isSelected && styles.categoryButtonSelected]}
              onPress={() => setSelectedCategory(category)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
            >
              <Text style={[styles.categoryLabel, isSelected && styles.categoryLabelSelected]}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <ScrollView
        style={styles.results}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {searching && (
          <View style={styles.statusRow}>
            <ActivityIndicator color="#FFD700" />
            <Text style={styles.statusMessage}>
              {normalizedQuery ? 'Searching players...' : 'Loading players...'}
            </Text>
          </View>
        )}
        {selectedCategory !== 'For you' && !searching ? (
          <Text style={styles.emptyMessage}>
            {selectedCategory === 'Network'
              ? 'Your network will appear here.'
              : 'Your chats will appear here.'}
          </Text>
        ) : searchError ? (
          <Text style={styles.emptyMessage}>{searchError}</Text>
        ) : (
          players.map((displayName, index) => (
            <View key={`${displayName.toLowerCase()}-${index}`} style={styles.resultRow}>
              <Ionicons name="person-outline" size={20} color="#FFD700" />
              <Text style={styles.resultTitle}>{displayName}</Text>
            </View>
          ))
        )}
        {selectedCategory === 'For you' && !searching && !searchError && players.length === 0 && (
          <Text style={styles.emptyMessage}>No registered players found.</Text>
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
  categoryTabs: {
    flexDirection: 'row',
    gap: wp(2),
    marginHorizontal: wp(5),
    marginTop: hp(1.5),
  },
  categoryButton: {
    flex: 1,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(1.5),
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  categoryButtonSelected: {
    borderBottomColor: '#FFD700',
  },
  categoryLabel: {
    color: '#D1D5DB',
    fontSize: rf(12),
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryLabelSelected: {
    color: '#FFD700',
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
