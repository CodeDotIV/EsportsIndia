
import React, { useCallback, useMemo, useState } from 'react';
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { hp, rf, wp } from '../../utils/responsive';
import { Alert } from '../../components/AppDialog.js';

import {
  getConnectionRequests,
  getConnectionProfiles,
  respondToConnectionRequest,
} from '../../services/connections';

export default function ConnectScreen() {
  const navigation = useNavigation();

  const [query, setQuery] = useState('');

  const [notificationVisible, setNotificationVisible] = useState(false);

  const [requests, setRequests] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState(null);

  // Load connection requests and their public profiles.
  const loadNetwork = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);

      const requestResult = await getConnectionRequests();

      const requestRows = Array.isArray(requestResult)
        ? requestResult
        : requestResult?.data || [];

      setRequests(requestRows);

      // Find the signed-in user's ID from the connection request participants.
      // The service query returns only the current user's requests.
      const ids = [
        ...new Set(
          requestRows.flatMap((request) => [
            request.requester_id,
            request.receiver_id,
          ]).filter(Boolean)
        ),
      ];

      // Determine the current user from the Supabase session.
      // getConnectionRequests is expected to be scoped to the signed-in user.
      const { requireSupabase } = require('../../services/supabase');
      const supabase = requireSupabase();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        setCurrentUserId(null);
        setRequests([]);
        setProfiles([]);
        return;
      }

      setCurrentUserId(user.id);

      const otherUserIds = ids.filter((id) => id !== user.id);

      if (otherUserIds.length === 0) {
        setProfiles([]);
        return;
      }

      const profileResult = await getConnectionProfiles(otherUserIds);

      const profileRows = Array.isArray(profileResult)
        ? profileResult
        : profileResult?.data || [];

      setProfiles(profileRows);
    } catch (error) {
      console.error('Connect screen load error:', error);

      Alert.alert(
        'Unable to load',
        error?.message || 'Could not load your connections.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNetwork();
    }, [loadNetwork])
  );

  const profileMap = useMemo(() => {
    const map = {};

    profiles.forEach((profile) => {
      map[profile.user_id] = profile;
    });

    return map;
  }, [profiles]);

  const getOtherUserId = (request) => {
    return request.requester_id === currentUserId
      ? request.receiver_id
      : request.requester_id;
  };

  const getProfile = (request) => {
    return profileMap[getOtherUserId(request)] || null;
  };

  const incomingRequests = useMemo(
    () =>
      requests.filter(
        (request) =>
          request.status === 'pending' &&
          request.receiver_id === currentUserId
      ),
    [requests, currentUserId]
  );

  const acceptedConnections = useMemo(
    () => requests.filter((request) => request.status === 'accepted'),
    [requests]
  );

  const searchTerm = query.trim().toLowerCase();
  const filteredAccepted = acceptedConnections.filter((request) => {
    const profile = getProfile(request);
    if (!profile) return false;
    if (!searchTerm) return true;

    return [
      profile.full_name,
      profile.display_name,
      profile.name,
      profile.game,
      profile.team_name,
      profile.team_type,
      profile.state,
      profile.zone,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm);
  });

  const handleRequestResponse = async (requestId, accept) => {
    try {
      setRespondingId(requestId);

      await respondToConnectionRequest(requestId, accept);

      await loadNetwork(false);

      Alert.alert(
        accept ? 'Request accepted' : 'Request declined',
        accept
          ? 'You are now connected.'
          : 'The connection request was declined.'
      );
    } catch (error) {
      console.error('Connection response error:', error);

      Alert.alert(
        'Error',
        error?.message || 'Unable to update connection request.'
      );
    } finally {
      setRespondingId(null);
    }
  };

  const renderPlayer = (profile) => {
    const name =
      profile?.full_name ||
      profile?.display_name ||
      profile?.name ||
      'Player';

    const details = [
      profile?.game,
      profile?.team_type,
    ].filter(Boolean).join(' · ');

    const location = [
      profile?.state,
      profile?.zone,
    ].filter(Boolean).join(' · ');

    return (
      <View style={styles.playerRow}>
        <View style={styles.playerAvatar}>
          <Ionicons name="person" size={rf(21)} color="#FFD700" />
        </View>

        <View style={styles.playerInfo}>
          <Text style={styles.playerName} numberOfLines={1}>
            {name}
          </Text>

          {!!details && (
            <Text style={styles.playerDetails} numberOfLines={1}>
              {details}
            </Text>
          )}

          {!!location && (
            <Text style={styles.playerLocation} numberOfLines={1}>
              {location}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderChats = () => {
    if (loading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.emptyText}>Loading chats...</Text>
        </View>
      );
    }

    if (!filteredAccepted.length) {
      return (
        <View style={styles.centerContent}>
          <Ionicons name="chatbubbles-outline" size={42} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No chats yet</Text>
          <Text style={styles.emptyText}>
            Your accepted connections will appear here.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.results}
        contentContainerStyle={styles.resultsContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredAccepted.map((request) => (
          <View style={styles.playerCard} key={request.id}>
            {renderPlayer(getProfile(request))}

            <View style={styles.chatActions}>
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() =>
                  Alert.alert(
                    'Chat',
                    'Messaging has not been connected yet.'
                  )
                }
                accessibilityRole="button"
                accessibilityLabel="Chat with connection"
              >
                <Ionicons name="chatbubble-outline" size={rf(16)} color="#141E30" />
                <Text style={styles.chatButtonText}>Chat</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.callButton}
                onPress={() =>
                  Alert.alert(
                    'Calls coming soon',
                    'Voice calling will be available later.'
                  )
                }
                accessibilityRole="button"
                accessibilityLabel="Call connection"
              >
                <Ionicons name="call-outline" size={rf(16)} color="#FFFFFF" />
                <Text style={styles.callButtonText}>Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderNotifications = () => (
    <Modal
      visible={notificationVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setNotificationVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalDismissArea}
          activeOpacity={1}
          onPress={() => setNotificationVisible(false)}
        />

        <View style={styles.filterModal}>
          <View style={styles.filterModalHeader}>
            <Text style={styles.filterModalTitle}>Notifications</Text>

            <TouchableOpacity onPress={() => setNotificationVisible(false)}>
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {incomingRequests.length === 0 ? (
            <View style={styles.notificationEmpty}>
              <Ionicons
                name="notifications-off-outline"
                size={34}
                color="#9CA3AF"
              />
              <Text style={styles.emptyText}>No new notifications</Text>
            </View>
          ) : (
            <ScrollView
              style={styles.notificationList}
              showsVerticalScrollIndicator={false}
            >
              {incomingRequests.map((request) => (
                <View style={styles.notificationItem} key={request.id}>
                  <Text style={styles.notificationMessage}>
                    {getProfile(request)?.full_name ||
                      getProfile(request)?.name ||
                      'A player'}{' '}
                    sent you a connection request.
                  </Text>

                  <View style={styles.requestActions}>
                    <TouchableOpacity
                      style={styles.declineButton}
                      disabled={respondingId === request.id}
                      onPress={() => handleRequestResponse(request.id, false)}
                    >
                      <Text style={styles.declineText}>Decline</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.acceptButton}
                      disabled={respondingId === request.id}
                      onPress={() => handleRequestResponse(request.id, true)}
                    >
                      <Text style={styles.acceptText}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
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

        <Text style={styles.heading}>Connect</Text>

        <TouchableOpacity
          style={styles.notificationsButton}
          onPress={() => {
            setNotificationVisible(true);
            loadNetwork(false);
          }}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
        >
          <Ionicons name="notifications-outline" size={22} color="#FFD700" />

          {incomingRequests.length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {incomingRequests.length > 9 ? '9+' : incomingRequests.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF" />

        <TextInput
          style={[styles.searchInput, { outlineStyle: 'none' }]}
          value={query}
          onChangeText={setQuery}
          placeholder="Search chats"
          placeholderTextColor="#9CA3AF"
          returnKeyType="search"
          accessibilityLabel="Search chats"
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

      <View style={styles.results}>{renderChats()}</View>

      {renderNotifications()}
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
  notificationsButton: {
    marginLeft: 'auto',
    padding: wp(1),
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
  },
  resultsContent: {
    paddingHorizontal: wp(5),
    paddingTop: hp(1.5),
    paddingBottom: hp(3),
  },
  playerCard: {
    backgroundColor: '#1A1F2E',
    borderWidth: 1,
    borderColor: '#2A3441',
    borderRadius: 12,
    padding: wp(3),
    marginBottom: hp(1),
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerAvatar: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    backgroundColor: '#2A3441',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: wp(3),
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: rf(13),
    fontWeight: '700',
  },
  playerDetails: {
    color: '#FFD700',
    fontSize: rf(11),
    marginTop: hp(0.3),
  },
  playerLocation: {
    color: '#9CA3AF',
    fontSize: rf(10),
    marginTop: hp(0.3),
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: wp(2),
    marginTop: hp(1.2),
  },
  declineButton: {
    minWidth: wp(21),
    paddingVertical: hp(0.8),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#596273',
    borderRadius: 18,
  },
  declineText: {
    color: '#D1D5DB',
    fontSize: rf(11),
    fontWeight: '600',
  },
  acceptButton: {
    minWidth: wp(21),
    paddingVertical: hp(0.8),
    alignItems: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 18,
  },
  acceptText: {
    color: '#141E30',
    fontSize: rf(11),
    fontWeight: '700',
  },
  chatActions: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    gap: wp(2),
    marginTop: hp(1),
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 18,
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.8),
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A3441',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 18,
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.8),
  },
  chatButtonText: {
    color: '#141E30',
    fontSize: rf(11),
    fontWeight: '700',
    marginLeft: wp(1),
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: rf(11),
    fontWeight: '700',
    marginLeft: wp(1),
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(10),
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: rf(15),
    fontWeight: '700',
    marginTop: hp(1.5),
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: rf(12),
    textAlign: 'center',
    marginTop: hp(1),
    lineHeight: rf(18),
  },
  notificationBadge: {
    position: 'absolute',
    top: -3,
    right: -4,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 3,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  notificationEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(4),
  },
  notificationList: {
    flexShrink: 1,
  },
  notificationItem: {
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#2A3441',
  },
  notificationMessage: {
    color: '#FFFFFF',
    fontSize: rf(12),
    lineHeight: rf(18),
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
    maxWidth: 480,
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
});
