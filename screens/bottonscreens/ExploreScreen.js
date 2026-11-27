import React, { useCallback, useEffect, useMemo } from 'react';
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { hp, rf, wp } from '../../utils/responsive';
import PublicProfileCard from '../../components/PublicProfileCard';
import {
  getTeamFilterOptions,
  listRegisteredPlayers,
  searchTeams,
} from '../../services/userProfile';
import { getConnectionOverview } from '../../services/connections';

export default function ExploreScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [connectionStatuses, setConnectionStatuses] = useState({});
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [connectionProfiles, setConnectionProfiles] = useState([]);
  const [connectionUserId, setConnectionUserId] = useState('');
  const [connectionStatusesLoading, setConnectionStatusesLoading] = useState(true);
  const [connectionStatusesError, setConnectionStatusesError] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Public Profiles');
  const [connectionTab, setConnectionTab] = useState('connected');
  const [exploreMenuVisible, setExploreMenuVisible] = useState(false);
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
  const hasFilters = Boolean(filters.game || filters.teamType);

  const loadConnectionOverview = useCallback(async (isActive = () => true) => {
    if (isActive()) {
      setConnectionStatusesLoading(true);
      setConnectionStatusesError(false);
    }

    try {
      const overview = await getConnectionOverview();
      if (!isActive()) return;

      setConnectionStatuses(overview.statuses);
      setConnectionRequests(overview.requests);
      setConnectionProfiles(overview.profiles);
      setConnectionUserId(overview.currentUserId);
    } catch (error) {
      console.error('Failed to load Explore connections:', error);
      if (isActive()) {
        setConnectionStatusesError(true);
      }
    } finally {
      if (isActive()) setConnectionStatusesLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadConnectionOverview(() => active);
      return () => {
        active = false;
      };
    }, [loadConnectionOverview])
  );

  const connectionProfilesById = useMemo(
    () =>
      connectionProfiles.reduce((map, profile) => {
        map[profile.user_id] = profile;
        return map;
      }, {}),
    [connectionProfiles]
  );
  const connectedCount = connectionRequests.filter(
    (request) => request.status === 'accepted'
  ).length;
  const publicPlayers = players.filter(
    (player) => connectionStatuses[player.user_id] !== 'accepted'
  );
  const sentRequestCount = connectionRequests.filter(
    (request) =>
      request.status === 'pending' &&
      request.requester_id === connectionUserId
  ).length;
  const visibleConnectionProfiles = useMemo(() => {
    const seen = new Set();
    const profiles = connectionRequests.reduce((matches, request) => {
      const isVisibleRequest =
        connectionTab === 'connected'
          ? request.status === 'accepted'
          : request.status === 'pending' &&
            request.requester_id === connectionUserId;
      if (!isVisibleRequest) return matches;

      const otherUserId =
        request.requester_id === connectionUserId
          ? request.receiver_id
          : request.requester_id;
      if (!otherUserId || seen.has(otherUserId)) return matches;

      seen.add(otherUserId);
      const profile = connectionProfilesById[otherUserId];
      if (profile) matches.push(profile);
      return matches;
    }, []);

    return profiles.filter((profile) => {
      const searchText = [
        profile.full_name,
        profile.display_name,
        profile.name,
        profile.game,
        profile.team_name,
        profile.team_type,
        profile.bio,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (normalizedQuery && !searchText.includes(normalizedQuery.toLowerCase())) {
        return false;
      }
      if (
        filters.game &&
        profile.game?.toLowerCase() !== filters.game.toLowerCase()
      ) return false;
      if (
        filters.teamType &&
        profile.team_type?.toLowerCase() !== filters.teamType.toLowerCase()
      ) return false;
      return true;
    });
  }, [
    connectionRequests,
    connectionTab,
    connectionUserId,
    connectionProfilesById,
    filters,
    normalizedQuery,
  ]);

  const handleConnectionStatusChange = (userId, status) => {
    if (!userId) return;
    setConnectionStatuses((current) => ({ ...current, [userId]: status }));
    loadConnectionOverview();
  };

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
    const showTeams = selectedTab === 'Teams';
    if (
      selectedTab === 'Connections' ||
      (!showProfiles && showTeams && !normalizedQuery && !hasFilters)
    ) {
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
        if (active && showTeams) setTeams(results);
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

  const searchPlaceholder =
    selectedTab === 'Public Profiles'
      ? 'Search players'
      : selectedTab === 'Teams'
        ? 'Search teams'
        : connectionTab === 'connected'
          ? 'Search connected players'
          : 'Search sent requests';
  const exploreSections = [
    { label: 'Public Profiles', tab: 'Public Profiles' },
    { label: 'Teams', tab: 'Teams' },
    {
      label: `Connected Players (${connectedCount})`,
      tab: 'Connections',
      connection: 'connected',
    },
    {
      label: `Sent Requests (${sentRequestCount})`,
      tab: 'Connections',
      connection: 'sent',
    },
  ];

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
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder={searchPlaceholder}
            placeholderTextColor="#9CA3AF"
            returnKeyType="search"
            accessibilityLabel={searchPlaceholder}
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
        <TouchableOpacity
          onPress={() => setExploreMenuVisible(true)}
          style={styles.exploreMenuButton}
          accessibilityRole="button"
          accessibilityLabel="Explore sections"
        >
          <Ionicons name="ellipsis-vertical" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.results}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {searching && selectedTab !== 'Connections' && (
          <View style={styles.statusRow}>
            <ActivityIndicator color="#FFD700" />
            <Text style={styles.statusMessage}>
              Searching {selectedTab === 'Public Profiles' ? 'public profiles' : 'teams'}...
            </Text>
          </View>
        )}
        {selectedTab === 'Connections' ? (
          connectionStatusesLoading ? (
            <View style={styles.statusRow}>
              <ActivityIndicator color="#FFD700" />
              <Text style={styles.statusMessage}>Loading connections...</Text>
            </View>
          ) : connectionStatusesError ? (
            <Text style={styles.emptyMessage}>
              Connections are unavailable. Check your connection and Supabase setup.
            </Text>
          ) : visibleConnectionProfiles.length > 0 ? (
            visibleConnectionProfiles.map((profile, index) => (
              <PublicProfileCard
                key={profile.user_id || `${profile.display_name || 'player'}-${index}`}
                profile={profile}
                connectionStatus={connectionStatuses[profile.user_id] || 'none'}
                onConnectionStatusChange={handleConnectionStatusChange}
              />
            ))
          ) : (
            <Text style={styles.emptyMessage}>
              {connectionTab === 'connected'
                ? 'No connected players found.'
                : 'No sent requests found.'}
            </Text>
          )
        ) : searchError ? (
          <Text style={styles.emptyMessage}>{searchError}</Text>
        ) : (
          selectedTab === 'Public Profiles' ? (
            publicPlayers.map((player, index) => (
              <PublicProfileCard
                key={player.user_id || `${player.display_name || 'player'}-${index}`}
                profile={player}
                connectionStatus={
                  connectionStatuses[player.user_id] ||
                  (connectionStatusesLoading
                    ? 'loading'
                    : connectionStatusesError
                      ? 'unavailable'
                      : 'none')
                }
                onConnectionStatusChange={handleConnectionStatusChange}
              />
            ))
          ) : teams.map((teamName) => (
            <View key={teamName.toLowerCase()} style={styles.resultRow}>
              <Ionicons name="people-outline" size={20} color="#FFD700" />
              <Text style={styles.resultTitle}>{teamName}</Text>
            </View>
          ))
        )}
        {!searching && !searchError && selectedTab === 'Public Profiles' && publicPlayers.length === 0 && (
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
        visible={exploreMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setExploreMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalDismissArea}
            activeOpacity={1}
            onPress={() => setExploreMenuVisible(false)}
            accessibilityLabel="Close Explore sections"
          />
          <View style={styles.exploreMenu}>
            <Text style={styles.filterModalTitle}>Explore sections</Text>
            {exploreSections.map((section) => {
              const isSelected =
                selectedTab === section.tab &&
                (!section.connection || connectionTab === section.connection);
              return (
                <TouchableOpacity
                  key={section.label}
                  style={styles.exploreMenuItem}
                  onPress={() => {
                    setSelectedTab(section.tab);
                    if (section.connection) setConnectionTab(section.connection);
                    setExploreMenuVisible(false);
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text style={[styles.exploreMenuLabel, isSelected && styles.exploreMenuLabelSelected]}>
                    {section.label}
                  </Text>
                  {isSelected && <Ionicons name="checkmark" size={20} color="#FFD700" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
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
                Filter {
                  selectedTab === 'Public Profiles'
                    ? 'public profiles'
                    : selectedTab === 'Teams'
                      ? 'teams'
                      : 'connections'
                }
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
                </>
              )}
            </ScrollView>
            <View style={styles.filterModalActions}>
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() =>
                  setDraftFilters({ game: '', teamType: '' })
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginHorizontal: wp(5),
    marginTop: hp(1),
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
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
  exploreMenuButton: {
    width: 40,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
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
  exploreMenu: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    padding: wp(5),
    backgroundColor: '#1A1F2E',
    borderWidth: 1,
    borderColor: '#2A3441',
    borderRadius: 16,
  },
  exploreMenuItem: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2A3441',
  },
  exploreMenuLabel: {
    color: '#D1D5DB',
    fontSize: rf(14),
  },
  exploreMenuLabelSelected: {
    color: '#FFD700',
    fontWeight: '600',
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
