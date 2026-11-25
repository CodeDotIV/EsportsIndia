import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Modal,
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
import PublicProfileCard from '../../components/PublicProfileCard';
import {
  getTeamFilterOptions,
  listRegisteredPlayers,
  searchTeams,
} from '../../services/userProfile';

export default function ExploreScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Public Profiles');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [filters, setFilters] = useState({ game: '', teamType: '', state: '', zone: '' });
  const [draftFilters, setDraftFilters] = useState({ game: '', teamType: '', state: '', zone: '' });
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    games: [],
    states: [],
    teamTypes: [],
    zones: [],
  });
  const [filterOptionsLoading, setFilterOptionsLoading] = useState(false);
  const [filterOptionsError, setFilterOptionsError] = useState('');
  const normalizedQuery = query.trim();
  const hasFilters = Boolean(filters.game || filters.teamType || filters.state || filters.zone);

  useEffect(() => {
    if (!filtersVisible) return undefined;

    let active = true;
    setFilterOptionsLoading(true);
    setFilterOptionsError('');
    getTeamFilterOptions()
      .then((options) => {
        if (active) setFilterOptions(options);
      })
      .catch((error) => {
        console.error('Failed to load team filter options:', error);
        if (active) {
          setFilterOptionsError(
            error?.code === 'PGRST202'
              ? 'Explore filters are not set up. Apply the public-profile search migration in Supabase.'
              : 'Filter options are unavailable. Check your connection and Supabase setup.'
          );
        }
      })
      .finally(() => {
        if (active) setFilterOptionsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [filtersVisible]);

  useEffect(() => {
    const showProfiles = selectedTab === 'Public Profiles';
    if (!showProfiles && !normalizedQuery && !hasFilters) {
      setTeams([]);
      setPlayers([]);
      setSearching(false);
      setSearchError('');
      return undefined;
    }

    let active = true;
    setTeams([]);
    setPlayers([]);
    setSearching(true);
    setSearchError('');
    const searchTimeout = setTimeout(async () => {
      try {
        const results = showProfiles
          ? await listRegisteredPlayers(normalizedQuery, filters)
          : await searchTeams(normalizedQuery, filters);
        if (active && showProfiles) setPlayers(results);
        if (active && !showProfiles) setTeams(results);
      } catch (error) {
        console.error('Failed to search Explore results:', error);
        if (active) {
          setTeams([]);
          setPlayers([]);
          setSearchError(
            error?.code === 'PGRST202'
              ? 'Public profiles are not set up. Apply the public-profile search migration in Supabase and refresh the schema cache.'
              : 'Explore is unavailable. Check your connection and Supabase setup.'
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
  }, [normalizedQuery, filters, hasFilters, selectedTab]);

  const renderFilterGroup = (title, options, field) => (
    <View style={styles.filterGroup}>
      <Text style={styles.filterGroupTitle}>{title}</Text>
      <View style={styles.filterOptions}>
        {options.length === 0 ? (
          <Text style={styles.noFilterOptions}>No saved {title.toLowerCase()} options.</Text>
        ) : (
          options.map((option) => {
            const selected = draftFilters[field] === option;
            return (
              <TouchableOpacity
                key={option}
                style={[styles.filterOption, selected && styles.filterOptionSelected]}
                onPress={() => setDraftFilters((current) => ({
                  ...current,
                  [field]: selected ? '' : option,
                }))}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <Text style={[styles.filterOptionText, selected && styles.filterOptionTextSelected]}>
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </View>
  );

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
          placeholder={selectedTab === 'Public Profiles' ? 'Search players' : 'Search teams'}
          placeholderTextColor="#9CA3AF"
          returnKeyType="search"
          accessibilityLabel={
            selectedTab === 'Public Profiles' ? 'Search public profiles' : 'Search teams'
          }
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
        <TouchableOpacity
          onPress={() => {
            setDraftFilters(filters);
            setFiltersVisible(true);
          }}
          style={styles.filterButton}
          accessibilityRole="button"
          accessibilityLabel={`Filter ${selectedTab.toLowerCase()}`}
        >
          <Ionicons name="options-outline" size={20} color={hasFilters ? '#FFD700' : '#9CA3AF'} />
        </TouchableOpacity>
      </View>
      <View style={styles.categoryTabs}>
        {['Public Profiles', 'Teams'].map((tab) => {
          const isSelected = selectedTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.categoryButton, isSelected && styles.categoryButtonSelected]}
              onPress={() => setSelectedTab(tab)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
            >
              <Text style={[styles.categoryLabel, isSelected && styles.categoryLabelSelected]}>
                {tab}
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
              Searching {selectedTab === 'Public Profiles' ? 'public profiles' : 'teams'}...
            </Text>
          </View>
        )}
        {searchError ? (
          <Text style={styles.emptyMessage}>{searchError}</Text>
        ) : (
          selectedTab === 'Public Profiles' ? (
            players.map((player, index) => (
              <PublicProfileCard
                key={`${player.display_name || 'player'}-${index}`}
                profile={player}
              />
            ))
          ) : teams.map((teamName) => (
            <View key={teamName.toLowerCase()} style={styles.resultRow}>
              <Ionicons name="people-outline" size={20} color="#FFD700" />
              <Text style={styles.resultTitle}>{teamName}</Text>
            </View>
          ))
        )}
        {!searching && !searchError && selectedTab === 'Public Profiles' && players.length === 0 && (
          <Text style={styles.emptyMessage}>No public profiles found.</Text>
        )}
        {!searching &&
          !searchError &&
          selectedTab === 'Teams' &&
          (normalizedQuery || hasFilters) &&
          teams.length === 0 && (
            <Text style={styles.emptyMessage}>No teams found.</Text>
        )}
      </ScrollView>
      <Modal
        visible={filtersVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFiltersVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalDismissArea}
            activeOpacity={1}
            onPress={() => setFiltersVisible(false)}
            accessibilityLabel="Close filters"
          />
          <View style={styles.filterModal}>
            <View style={styles.filterModalHeader}>
              <Text style={styles.filterModalTitle}>
                Filter {selectedTab === 'Public Profiles' ? 'public profiles' : 'teams'}
              </Text>
              <TouchableOpacity
                onPress={() => setFiltersVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Close filters"
              >
                <Ionicons name="close" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.filterModalContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {filterOptionsLoading ? (
                <ActivityIndicator color="#FFD700" style={styles.filterOptionsLoader} />
              ) : filterOptionsError ? (
                <Text style={styles.filterOptionsError}>{filterOptionsError}</Text>
              ) : (
                <>
                  {renderFilterGroup('Game', filterOptions.games, 'game')}
                  {renderFilterGroup(
                    'Team Type',
                    filterOptions.teamTypes.length
                      ? filterOptions.teamTypes
                      : ['Squad', 'Duo', 'Solo'],
                    'teamType'
                  )}
                  {renderFilterGroup('State', filterOptions.states, 'state')}
                  {renderFilterGroup(
                    'Zone',
                    filterOptions.zones.length
                      ? filterOptions.zones
                      : ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4'],
                    'zone'
                  )}
                </>
              )}
            </ScrollView>
            <View style={styles.filterModalActions}>
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() =>
                  setDraftFilters({ game: '', teamType: '', state: '', zone: '' })
                }
                accessibilityRole="button"
              >
                <Text style={styles.clearFiltersText}>Clear all</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyFiltersButton}
                onPress={() => {
                  setFilters(draftFilters);
                  setFiltersVisible(false);
                }}
                accessibilityRole="button"
              >
                <Text style={styles.applyFiltersText}>Apply filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  filterButton: {
    padding: wp(1),
  },
  categoryTabs: {
    flexDirection: 'row',
    marginHorizontal: wp(5),
    marginTop: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#2A3441',
  },
  categoryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: wp(5),
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  modalDismissArea: {
    ...StyleSheet.absoluteFillObject,
  },
  filterModal: {
    width: '100%',
    maxHeight: '80%',
    alignSelf: 'center',
    padding: wp(5),
    backgroundColor: '#1A1F2E',
    borderWidth: 1,
    borderColor: '#2A3441',
    borderRadius: 16,
  },
  filterModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  filterModalTitle: {
    color: '#FFFFFF',
    fontSize: rf(18),
    fontWeight: '700',
  },
  filterModalContent: {
    flexShrink: 1,
  },
  filterOptionsLoader: {
    marginVertical: hp(4),
  },
  filterOptionsError: {
    color: '#FCA5A5',
    fontSize: rf(13),
    marginVertical: hp(2),
  },
  filterGroup: {
    marginTop: hp(1.5),
  },
  filterGroupTitle: {
    color: '#FFFFFF',
    fontSize: rf(14),
    fontWeight: '600',
    marginBottom: hp(0.8),
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
  },
  filterOption: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderWidth: 1,
    borderColor: '#3A4555',
    borderRadius: 18,
  },
  filterOptionSelected: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  filterOptionText: {
    color: '#D1D5DB',
    fontSize: rf(12),
  },
  filterOptionTextSelected: {
    color: '#141E30',
    fontWeight: '600',
  },
  noFilterOptions: {
    color: '#9CA3AF',
    fontSize: rf(12),
  },
  filterModalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: wp(3),
    marginTop: hp(2),
  },
  clearFiltersButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: hp(1.2),
  },
  clearFiltersText: {
    color: '#D1D5DB',
    fontSize: rf(13),
    fontWeight: '600',
  },
  applyFiltersButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: hp(1.2),
    backgroundColor: '#FFD700',
    borderRadius: 22,
  },
  applyFiltersText: {
    color: '#141E30',
    fontSize: rf(13),
    fontWeight: '700',
  },
});
