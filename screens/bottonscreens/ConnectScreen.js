
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  useWindowDimensions,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { hp, rf, wp } from '../../utils/responsive';
import { Alert } from '../../components/AppDialog.js';
import { Linking } from 'react-native';

import {
  getConnectionRequests,
  getConnectionProfiles,
  respondToConnectionRequest,
  removePlayerConnection,
  blockPlayer,
  setPlayerFavourite,
  setPlayerNotificationsMuted,
  reportPlayer,
  getPlayerConnectionPreferences,
} from '../../services/connections';

import {
  getOrCreatePrivateChat,
  getChatMessages,
  sendChatMessage,
  markChatMessagesAsRead,
  subscribeToChatMessages,
  unsubscribeFromChat,
} from '../../services/chat';

const STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
];

const ZONES = ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4'];

export default function ConnectScreen() {
  const navigation = useNavigation();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const [activeTab, setActiveTab] = useState('personal');
  const [selectedState, setSelectedState] = useState(null);
  const [statePickerVisible, setStatePickerVisible] = useState(false);

  const [query, setQuery] = useState('');
  const [personalFilter, setPersonalFilter] = useState('all');
  const [notificationVisible, setNotificationVisible] = useState(false);

  const [requests, setRequests] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState(null);

  // Prevent duplicate network requests and unnecessary full-screen loading.
  const hasLoadedNetworkRef = useRef(false);
  const isLoadingNetworkRef = useRef(false);
  const pendingNetworkRefreshRef = useRef(false);
  const loadNetworkRef = useRef(null);

  // Player menu
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [preferences, setPreferences] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingPlayerAction, setPendingPlayerAction] = useState(null);
  const [playerActionError, setPlayerActionError] = useState('');

  // Report modal
  const [reportVisible, setReportVisible] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  // Personal chat
  const [chatVisible, setChatVisible] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [chatRoomId, setChatRoomId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [messageSending, setMessageSending] = useState(false);
  const [chatError, setChatError] = useState('');

  // Optimized Connect screen loading
  const loadNetwork = useCallback(async (showLoading = true) => {
    if (isLoadingNetworkRef.current) {
      pendingNetworkRefreshRef.current = true;
      return;
    }

    isLoadingNetworkRef.current = true;

    try {
      if (showLoading && !hasLoadedNetworkRef.current) {
        setLoading(true);
      }

      const { requireSupabase } = require('../../services/supabase');
      const supabase = requireSupabase();

      // Fetch the logged-in user only once.
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        setCurrentUserId(null);
        setRequests([]);
        setProfiles([]);
        setPreferences({});
        hasLoadedNetworkRef.current = true;
        return;
      }

      setCurrentUserId(user.id);

      // Pass user ID to avoid another auth.getUser() call.
      const requestResult = await getConnectionRequests(user.id);

      const requestRows = Array.isArray(requestResult)
        ? requestResult
        : requestResult?.data || [];

      setRequests(requestRows);

      const ids = [
        ...new Set(
          requestRows
            .flatMap((request) => [
              request.requester_id,
              request.receiver_id,
            ])
            .filter(Boolean)
        ),
      ];

      const otherUserIds = ids.filter((id) => id !== user.id);

      if (otherUserIds.length === 0) {
        setProfiles([]);
        setPreferences({});
        hasLoadedNetworkRef.current = true;
        return;
      }

      // Load profiles and preferences at the same time.
      const [profileResult, preferenceRows] = await Promise.all([
        getConnectionProfiles(otherUserIds),
        getPlayerConnectionPreferences(otherUserIds, user.id),
      ]);

      const profileRows = Array.isArray(profileResult)
        ? profileResult
        : profileResult?.data || [];

      const preferenceMap = {};

      (preferenceRows || []).forEach((item) => {
        preferenceMap[item.connected_user_id] = item;
      });

      setProfiles(profileRows);
      setPreferences(preferenceMap);

      hasLoadedNetworkRef.current = true;
    } catch (error) {
      console.error('Connect screen load error:', error);

      Alert.alert(
        'Unable to load',
        error?.message || 'Could not load your connections.'
      );
    } finally {
      isLoadingNetworkRef.current = false;
      setLoading(false);

      if (pendingNetworkRefreshRef.current) {
        pendingNetworkRefreshRef.current = false;
        void loadNetworkRef.current?.(false);
      }
    }
  }, []);

  useEffect(() => {
    loadNetworkRef.current = loadNetwork;
  }, [loadNetwork]);

  useFocusEffect(
    useCallback(() => {
      // First visit shows loader; later visits refresh in background.
      loadNetwork(true);
    }, [loadNetwork])
  );

  const profileMap = useMemo(() => {
    const map = {};

    profiles.forEach((profile) => {
      const id =
        profile.user_id ||
        profile.id ||
        profile.profile_id;

      if (id) map[id] = profile;
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

  const getPlayerName = (profile) =>
    profile?.full_name ||
    profile?.display_name ||
    profile?.name ||
    'Player';

  const incomingRequests = useMemo(
    () =>
      requests.filter(
        (request) =>
          request.status === 'pending' &&
          request.receiver_id === currentUserId
      ),
    [requests, currentUserId]
  );

  useEffect(() => {
    navigation.setOptions({
      tabBarBadge: incomingRequests.length
        ? incomingRequests.length > 9
          ? '9+'
          : incomingRequests.length
        : undefined,
      tabBarBadgeStyle: {
        backgroundColor: '#EF4444',
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
        minWidth: 18,
        height: 18,
        lineHeight: 18,
      },
    });
  }, [incomingRequests.length, navigation]);

  const acceptedConnections = useMemo(
    () => requests.filter((request) => request.status === 'accepted'),
    [requests]
  );

  const searchTerm = query.trim().toLowerCase();

  const filteredAccepted = useMemo(
    () =>
      acceptedConnections.filter((request) => {
        const profile = getProfile(request);
        const userId = getOtherUserId(request);
        const playerPreferences = preferences[userId] || {};

        if (!profile) return false;

        if (personalFilter === 'favorites' && !playerPreferences.is_favourite) {
          return false;
        }

        if (
          personalFilter === 'muted' &&
          !playerPreferences.notifications_muted
        ) {
          return false;
        }

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
      }),
    [
      acceptedConnections,
      searchTerm,
      profileMap,
      currentUserId,
      preferences,
      personalFilter,
    ]
  );

  const handleRequestResponse = async (requestId, accept) => {
    try {
      setRespondingId(requestId);

      await respondToConnectionRequest(requestId, accept);
      await loadNetwork(false);
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

  const updatePreference = (userId, changes) => {
    setPreferences((previous) => ({
      ...previous,
      [userId]: {
        ...previous[userId],
        connected_user_id: userId,
        ...changes,
      },
    }));
  };

  const closePlayerMenu = () => {
    setMenuVisible(false);
    setPendingPlayerAction(null);
    setPlayerActionError('');
  };

  const requestPlayerAction = (action) => {
    if (!selectedPlayer || actionLoading) return;

    setPendingPlayerAction(action);
    setPlayerActionError('');
  };

  const handleFavourite = async () => {
    if (!selectedPlayer || actionLoading) return;

    const userId = selectedPlayer.userId;
    const nextValue = !preferences[userId]?.is_favourite;

    try {
      setActionLoading(true);

      await setPlayerFavourite(userId, nextValue);
      updatePreference(userId, { is_favourite: nextValue });
      closePlayerMenu();
    } catch (error) {
      Alert.alert('Error', error?.message || 'Unable to update favourite.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMute = async () => {
    if (!selectedPlayer || actionLoading) return;

    const userId = selectedPlayer.userId;
    const nextValue = !preferences[userId]?.notifications_muted;

    try {
      setActionLoading(true);

      await setPlayerNotificationsMuted(userId, nextValue);

      updatePreference(userId, {
        notifications_muted: nextValue,
      });

      closePlayerMenu();
    } catch (error) {
      Alert.alert(
        'Error',
        error?.message || 'Unable to update notifications.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveConnection = async () => {
    if (!selectedPlayer || actionLoading) return;
    const targetUserId = selectedPlayer.userId;

    try {
      setActionLoading(true);
      setPlayerActionError('');

      await removePlayerConnection(targetUserId);

      setRequests((previous) =>
        previous.filter(
          (request) =>
            request.status !== 'accepted' ||
            !(
              (request.requester_id === currentUserId &&
                request.receiver_id === targetUserId) ||
              (request.receiver_id === currentUserId &&
                request.requester_id === targetUserId)
            )
        )
      );
      setProfiles((previous) =>
        previous.filter(
          (profile) =>
            (profile.user_id || profile.id || profile.profile_id) !==
            targetUserId
        )
      );
      setPreferences((previous) => {
        const next = { ...previous };
        delete next[targetUserId];
        return next;
      });
      closePlayerMenu();
      setSelectedPlayer(null);

      await loadNetwork(false);
    } catch (error) {
      console.error('Remove connection error:', error);
      setPlayerActionError(
        error?.message || 'Unable to remove connection.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlockPlayer = async () => {
    if (!selectedPlayer || actionLoading) return;
    const targetUserId = selectedPlayer.userId;

    try {
      setActionLoading(true);
      setPlayerActionError('');

      await blockPlayer(targetUserId);

      closePlayerMenu();
      setSelectedPlayer(null);

      await loadNetwork(false);
    } catch (error) {
      console.error('Block player error:', error);
      setPlayerActionError(error?.message || 'Unable to block player.');
    } finally {
      setActionLoading(false);
    }
  };

  const openReportModal = () => {
    closePlayerMenu();
    setReportReason('');
    setReportDetails('');
    setReportVisible(true);
  };

  const submitPlayerReport = async () => {
    if (!selectedPlayer || actionLoading) return;

    if (!reportReason) {
      Alert.alert('Select a reason', 'Please select a report reason.');
      return;
    }

    try {
      setActionLoading(true);

      await reportPlayer(
        selectedPlayer.userId,
        reportReason,
        reportDetails
      );

      setReportVisible(false);
      setSelectedPlayer(null);
      setReportReason('');
      setReportDetails('');
    } catch (error) {
      Alert.alert(
        'Error',
        error?.message || 'Unable to submit report.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Open personal chat UI
  const openPersonalChat = (request) => {
    const profile = getProfile(request);
    const userId = getOtherUserId(request);

    setActiveChat({
      type: 'personal',
      id: userId,
      name: getPlayerName(profile),
      subtitle: [profile?.game, profile?.team_type]
        .filter(Boolean)
        .join(' · '),
    });
    setSelectedPlayer({ userId, request, profile });

    setChatRoomId(null);
    setChatMessages([]);
    setMessageText('');
    setChatError('');
    setChatVisible(true);
  };

  // Community UI preview
  const openCommunityChat = (name, subtitle, id) => {
    setActiveChat({
      type: 'community',
      id,
      name,
      subtitle,
    });

    setMessageText('');
    setChatVisible(true);
  };

  // Load private conversation and subscribe to new messages
  useEffect(() => {
    if (
      !chatVisible ||
      !activeChat ||
      activeChat.type !== 'personal' ||
      !activeChat.id ||
      !currentUserId
    ) {
      return;
    }

    let mounted = true;
    let channel = null;

    const initializeChat = async () => {
      try {
        setChatLoading(true);
        setChatError('');
        setChatMessages([]);

        const roomId = await getOrCreatePrivateChat(activeChat.id);

        if (!mounted) return;

        setChatRoomId(roomId);

        channel = subscribeToChatMessages(roomId, async (newMessage) => {
          if (!mounted) return;

          setChatMessages((previous) => {
            const alreadyExists = previous.some(
              (message) => message.id === newMessage.id
            );

            if (alreadyExists) return previous;

            return [...previous, newMessage].sort(
              (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            );
          });

          if (newMessage.sender_id !== currentUserId) {
            try {
              await markChatMessagesAsRead(roomId);
            } catch (error) {
              console.log('Mark message read error:', error.message);
            }
          }
        });

        const existingMessages = await getChatMessages(roomId);

        if (!mounted) return;

        setChatMessages((previous) => {
          const combined = [...existingMessages];

          previous.forEach((message) => {
            if (!combined.some((item) => item.id === message.id)) {
              combined.push(message);
            }
          });

          return combined.sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );
        });

        await markChatMessagesAsRead(roomId);
      } catch (error) {
        console.error('Chat initialization error:', error);

        if (mounted) {
          setChatError(
            error?.message || 'Unable to open this conversation.'
          );
        }
      } finally {
        if (mounted) setChatLoading(false);
      }
    };

    initializeChat();

    return () => {
      mounted = false;

      if (channel) {
        unsubscribeFromChat(channel).catch((error) => {
          console.log('Chat unsubscribe error:', error.message);
        });
      }
    };
  }, [
    chatVisible,
    activeChat?.id,
    activeChat?.type,
    currentUserId,
  ]);

  // Send a personal message
  const handleSendMessage = async () => {
    const content = messageText.trim();

    if (!content || !chatRoomId || messageSending) return;

    try {
      setMessageSending(true);

      const sentMessage = await sendChatMessage(chatRoomId, content);

      setChatMessages((previous) => {
        if (previous.some((message) => message.id === sentMessage.id)) {
          return previous;
        }

        return [...previous, sentMessage].sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        );
      });

      setMessageText('');
    } catch (error) {
      console.error('Send message error:', error);

      Alert.alert(
        'Message not sent',
        error?.message || 'Unable to send your message.'
      );
    } finally {
      setMessageSending(false);
    }
  };

  const renderPlayer = (profile, isFavourite = false) => {
    const name = getPlayerName(profile);

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
          <View style={styles.playerNameRow}>
            <Text style={styles.playerName} numberOfLines={1}>
              {name}
            </Text>
            {isFavourite && (
              <Ionicons name="star" size={rf(13)} color="#FFD700" />
            )}
          </View>

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

  // Personal chat list
  const renderPersonalChats = () => {
    if (loading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.emptyText}>Loading personal chats...</Text>
        </View>
      );
    }

    if (!filteredAccepted.length) {
      return (
        <View style={styles.centerContent}>
          <Ionicons name="chatbubbles-outline" size={42} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>
            {personalFilter === 'favorites'
              ? 'No favorite chats'
              : personalFilter === 'muted'
                ? 'No muted chats'
                : 'No personal chats yet'}
          </Text>
          <Text style={styles.emptyText}>
            {personalFilter === 'favorites'
              ? 'Add connections to favorites to see them here.'
              : personalFilter === 'muted'
                ? 'Muted connections will appear here.'
                : 'Your accepted connections will appear here.'}
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
        {filteredAccepted.map((request) => {
          const userId = getOtherUserId(request);
          const playerPreferences = preferences[userId] || {};

          return (
            <TouchableOpacity
              style={styles.playerCard}
              key={request.id}
              onPress={() => openPersonalChat(request)}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel={`Open chat with ${getPlayerName(getProfile(request))}`}
              accessibilityHint="Opens this conversation"
            >
              <View style={styles.playerCardTop}>
                {renderPlayer(
                  getProfile(request),
                  playerPreferences.is_favourite
                )}
                {playerPreferences.notifications_muted && (
                  <Ionicons
                    name="notifications-off"
                    size={rf(17)}
                    color="#9CA3AF"
                  />
                )}
                <View style={styles.chatIndicator}>
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={rf(17)}
                    color="#FFD700"
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  // Community list
  const renderCommunityHeader = () => (
    <View style={styles.communityIntro}>
      <TouchableOpacity
        style={styles.communityChannel}
        onPress={() =>
          openCommunityChat(
            'India Community',
            'National gaming community',
            'india'
          )
        }
      >
        <View style={styles.channelIcon}>
          <Ionicons name="globe-outline" size={rf(23)} color="#FFD700" />
        </View>

        <View style={styles.channelInfo}>
          <Text style={styles.channelName}>India Community</Text>
          <Text style={styles.channelDescription}>
            Connect with gamers from across India
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={rf(19)} color="#9CA3AF" />
      </TouchableOpacity>

      <Text style={styles.sectionHeading}>State Communities</Text>

      <TouchableOpacity
        style={styles.stateSelector}
        onPress={() => setStatePickerVisible(true)}
      >
        <Ionicons name="map-outline" size={rf(20)} color="#FFD700" />

        <Text style={styles.stateSelectorText}>
          {selectedState || 'Select your state'}
        </Text>

        <Ionicons name="chevron-down" size={rf(19)} color="#9CA3AF" />
      </TouchableOpacity>

      {selectedState && (
        <View style={styles.zoneSection}>
          <Text style={styles.sectionHeading}>
            {selectedState} Zones
          </Text>

          <Text style={styles.zoneDescription}>
            Choose a regional channel to open its community.
          </Text>

          {ZONES.map((zone) => (
            <TouchableOpacity
              key={zone}
              style={styles.communityChannel}
              onPress={() =>
                openCommunityChat(
                  `${selectedState} - ${zone}`,
                  `${selectedState} regional gaming community`,
                  `${selectedState}-${zone}`
                )
              }
            >
              <View style={styles.zoneIcon}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={rf(21)}
                  color="#FFD700"
                />
              </View>

              <View style={styles.channelInfo}>
                <Text style={styles.channelName}>{zone}</Text>
                <Text style={styles.channelDescription}>
                  {selectedState} regional players
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={rf(19)}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.communityFootnote}>
        Community channels are currently a UI preview. They are not
        connected to realtime messaging yet.
      </Text>
    </View>
  );

  const openPlayerMenu = () => {
    setPendingPlayerAction(null);
    setPlayerActionError('');
    setMenuVisible(true);
  };

  const renderMenuItem = (
    icon,
    title,
    onPress,
    color = '#FFFFFF'
  ) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      disabled={actionLoading}
    >
      <Ionicons name={icon} size={rf(19)} color={color} />
      <Text style={[styles.menuItemText, { color }]}>{title}</Text>
    </TouchableOpacity>
  );

  const renderPlayerMenu = () => {
    if (!selectedPlayer) return null;

    const userId = selectedPlayer.userId;

    const isFavourite = !!preferences[userId]?.is_favourite;
    const isMuted = !!preferences[userId]?.notifications_muted;
    const isBlocking = pendingPlayerAction === 'block';

    if (pendingPlayerAction) {
      return (
        <View
          style={[
            styles.menuModal,
            styles.playerMenuPopover,
            {
              width: Math.min(280, Math.max(0, windowWidth - 24)),
              maxHeight: Math.max(0, windowHeight - 24),
            },
          ]}
        >
          <View style={styles.playerActionContent}>
            <Text style={styles.playerActionTitle}>
              {isBlocking ? 'Block player?' : 'Remove connection?'}
            </Text>
            <Text style={styles.playerActionDescription}>
              {isBlocking
                ? 'This player will be blocked and removed from your connections.'
                : 'This player will be removed from your connections.'}
            </Text>

            {!!playerActionError && (
              <Text style={styles.playerActionError}>
                {playerActionError}
              </Text>
            )}

            <View style={styles.playerActionButtons}>
              <TouchableOpacity
                style={styles.playerActionCancelButton}
                onPress={() => {
                  setPendingPlayerAction(null);
                  setPlayerActionError('');
                }}
                disabled={actionLoading}
              >
                <Text style={styles.playerActionCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.playerActionConfirmButton}
                onPress={
                  isBlocking ? handleBlockPlayer : handleRemoveConnection
                }
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.playerActionConfirmText}>
                    {isBlocking ? 'Block' : 'Remove'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.menuModal,
          styles.playerMenuPopover,
          {
            width: Math.min(280, Math.max(0, windowWidth - 24)),
            maxHeight: Math.max(0, windowHeight - 24),
          },
        ]}
      >
        {renderMenuItem(
          isFavourite ? 'star' : 'star-outline',
          isFavourite ? 'Remove favourite' : 'Add to favourites',
          handleFavourite,
          '#00A884'
        )}

        {renderMenuItem(
          isMuted ? 'notifications' : 'notifications-off-outline',
          isMuted ? 'Unmute notifications' : 'Mute notifications',
          handleMute
        )}

        <View style={styles.menuDivider} />

        {renderMenuItem(
          'person-remove-outline',
          'Remove connection',
          () => requestPlayerAction('remove'),
          '#E9EDEF'
        )}

        {renderMenuItem(
          'ban-outline',
          'Block player',
          () => requestPlayerAction('block'),
          '#F87171'
        )}

        {renderMenuItem(
          'flag-outline',
          'Report player',
          openReportModal,
          '#F87171'
        )}

        {actionLoading && (
          <ActivityIndicator
            size="small"
            color="#00A884"
            style={styles.menuLoader}
          />
        )}
      </View>
    );
  };

  const reportReasons = [
    'Harassment or bullying',
    'Abusive language',
    'Fake profile or impersonation',
    'Spam or unwanted messages',
    'Cheating or unfair play',
    'Inappropriate content',
    'Other',
  ];

  const renderReportModal = () => {
    if (!reportVisible) return null;

    return (
      <View style={styles.chatDialogOverlay}>
        <TouchableOpacity
          style={styles.modalDismissArea}
          activeOpacity={1}
          onPress={() => setReportVisible(false)}
        />

        <View style={styles.reportModal}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Report player</Text>

            <TouchableOpacity
              onPress={() => setReportVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.reportLabel}>
            Why are you reporting this player?
          </Text>

          <ScrollView
            style={styles.reportReasonsList}
            showsVerticalScrollIndicator={false}
          >
            {reportReasons.map((reason) => {
              const selected = reportReason === reason;

              return (
                <TouchableOpacity
                  key={reason}
                  style={[
                    styles.reasonOption,
                    selected && styles.reasonOptionSelected,
                  ]}
                  onPress={() => setReportReason(reason)}
                >
                  <Ionicons
                    name={
                      selected
                        ? 'radio-button-on'
                        : 'radio-button-off'
                    }
                    size={rf(18)}
                    color={selected ? '#FFD700' : '#9CA3AF'}
                  />

                  <Text
                    style={[
                      styles.reasonText,
                      selected && styles.reasonTextSelected,
                    ]}
                  >
                    {reason}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={styles.reportLabel}>
            Additional details (optional)
          </Text>

          <TextInput
            style={styles.reportInput}
            value={reportDetails}
            onChangeText={setReportDetails}
            placeholder="Describe what happened..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={500}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[
              styles.submitReportButton,
              (!reportReason || actionLoading) && styles.disabledButton,
            ]}
            onPress={submitPlayerReport}
            disabled={!reportReason || actionLoading}
          >
            {actionLoading ? (
              <ActivityIndicator color="#141E30" />
            ) : (
              <Text style={styles.submitReportText}>
                Submit report
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
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

            <TouchableOpacity
              onPress={() => setNotificationVisible(false)}
            >
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
              <Text style={styles.emptyText}>
                No new notifications
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.notificationList}
              showsVerticalScrollIndicator={false}
            >
              {incomingRequests.map((request) => (
                <View style={styles.notificationItem} key={request.id}>
                  <Text style={styles.notificationMessage}>
                    {getPlayerName(getProfile(request))} sent you a
                    connection request.
                  </Text>

                  <View style={styles.requestActions}>
                    <TouchableOpacity
                      style={styles.declineButton}
                      disabled={respondingId === request.id}
                      onPress={() =>
                        handleRequestResponse(request.id, false)
                      }
                    >
                      <Text style={styles.declineText}>Decline</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.acceptButton}
                      disabled={respondingId === request.id}
                      onPress={() =>
                        handleRequestResponse(request.id, true)
                      }
                    >
                      {respondingId === request.id ? (
                        <ActivityIndicator color="#141E30" size="small" />
                      ) : (
                        <Text style={styles.acceptText}>Accept</Text>
                      )}
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

  // State selector
  const renderStatePicker = () => (
    <Modal
      visible={statePickerVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setStatePickerVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalDismissArea}
          activeOpacity={1}
          onPress={() => setStatePickerVisible(false)}
        />

        <View style={styles.statePickerModal}>
          <View style={styles.menuHeader}>
            <View>
              <Text style={styles.menuTitle}>Select your state</Text>
              <Text style={styles.menuSubtitle}>
                Choose a state to view its four zones
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setStatePickerVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {STATES.map((state) => (
              <TouchableOpacity
                key={state}
                style={[
                  styles.stateOption,
                  selectedState === state && styles.stateOptionSelected,
                ]}
                onPress={() => {
                  setSelectedState(state);
                  setStatePickerVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.stateOptionText,
                    selectedState === state && styles.stateOptionTextSelected,
                  ]}
                >
                  {state}
                </Text>

                {selectedState === state && (
                  <Ionicons
                    name="checkmark-circle"
                    color="#FFD700"
                    size={20}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Personal chat modal
  const renderChatModal = () => (
    <Modal
      visible={chatVisible}
      animationType="slide"
      onRequestClose={() => {
        closePlayerMenu();
        setReportVisible(false);
        setChatVisible(false);
      }}
    >
      <SafeAreaView style={styles.chatScreen}>
        <View
          style={[
            styles.chatHeader,
            menuVisible && styles.chatHeaderWithMenu,
          ]}
        >
          <TouchableOpacity
            style={styles.chatBackButton}
            onPress={() => {
              closePlayerMenu();
              setReportVisible(false);
              setChatVisible(false);
            }}
          >
            <Ionicons name="chevron-back" size={25} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.chatHeaderAvatar}>
            <Ionicons name="person" color="#E9EDEF" size={21} />
          </View>

          <View style={styles.chatHeaderInfo}>
            <Text style={styles.chatHeaderName} numberOfLines={1}>
              {activeChat?.name || 'Chat'}
            </Text>

            <Text style={styles.chatHeaderSubtitle} numberOfLines={1}>
              {activeChat?.subtitle || 'EsportsIndia'}
            </Text>
          </View>

          {activeChat?.type === 'personal' && (
            <View style={styles.playerOptionsAnchor}>
              <TouchableOpacity
                style={styles.chatHeaderAction}
                onPress={openPlayerMenu}
                accessibilityRole="button"
                accessibilityLabel="Player options"
              >
                <Ionicons
                  name="ellipsis-vertical"
                  color="#E9EDEF"
                  size={21}
                />
              </TouchableOpacity>

              {menuVisible && renderPlayerMenu()}
            </View>
          )}
        </View>

        {chatLoading && (
          <View style={styles.chatStatus}>
            <ActivityIndicator color="#FFD700" />
            <Text style={styles.chatStatusText}>
              Opening conversation...
            </Text>
          </View>
        )}

        {!!chatError && (
          <View style={styles.chatErrorBox}>
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color="#F87171"
            />
            <Text style={styles.chatErrorText}>{chatError}</Text>
            <TouchableOpacity
              onPress={() => {
                setChatVisible(false);
                setChatRoomId(null);
                setTimeout(() => setChatVisible(true), 150);
              }}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView
          style={styles.chatMessagesArea}
          contentContainerStyle={styles.chatMessagesContent}
          showsVerticalScrollIndicator={false}
        >
          {!chatLoading &&
            !chatError &&
            chatMessages.length === 0 && (
              <View style={styles.chatEmptyArea}>
                <View style={styles.chatEmptyIcon}>
                  <Ionicons
                    name="chatbubbles"
                    size={35}
                    color="#00A884"
                  />
                </View>

                <Text style={styles.chatEmptyTitle}>
                  Start chatting with {activeChat?.name || 'your connection'}
                </Text>

                <Text style={styles.chatEmptyDescription}>
                  Send your first message and start the conversation.
                </Text>
              </View>
            )}

          {chatMessages.map((message) => {
            const isMine = message.sender_id === currentUserId;

            return (
              <View
                key={message.id}
                style={[
                  styles.messageRow,
                  isMine
                    ? styles.myMessageRow
                    : styles.theirMessageRow,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isMine
                      ? styles.myMessageBubble
                      : styles.theirMessageBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageBubbleText,
                      isMine
                        ? styles.myMessageText
                        : styles.theirMessageText,
                    ]}
                  >
                    {message.content}
                  </Text>

                  <Text
                    style={[
                      styles.messageTime,
                      isMine
                        ? styles.myMessageTime
                        : styles.theirMessageTime,
                    ]}
                  >
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.messageComposer}>
          <TextInput
            style={styles.messageInput}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Message"
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={5000}
            editable={!chatError}
            selectionColor="#FFD700"
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!messageText.trim() ||
                messageSending ||
                chatLoading ||
                !!chatError ||
                !chatRoomId) && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={
              !messageText.trim() ||
              messageSending ||
              chatLoading ||
              !!chatError ||
              !chatRoomId
            }
          >
            {messageSending ? (
              <ActivityIndicator color="#141E30" size="small" />
            ) : (
              <Ionicons name="send" size={18} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>

        {menuVisible && (
          <TouchableOpacity
            style={styles.playerMenuBackdrop}
            activeOpacity={1}
            onPress={closePlayerMenu}
          />
        )}

        {renderReportModal()}
      </SafeAreaView>
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
          <Ionicons
            name="notifications-outline"
            size={22}
            color="#FFD700"
          />

          {incomingRequests.length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {incomingRequests.length > 9
                  ? '9+'
                  : incomingRequests.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.mainTabs}>
        <TouchableOpacity
          style={[
            styles.mainTab,
            activeTab === 'community' && styles.mainTabActive,
          ]}
          onPress={() => {
            setActiveTab('community');
            setQuery('');
          }}
        >
          <Ionicons
            name="people-outline"
            size={rf(14)}
            color={activeTab === 'community' ? '#141E30' : '#9CA3AF'}
          />
          <Text
            style={[
              styles.mainTabText,
              activeTab === 'community' && styles.mainTabTextActive,
            ]}
          >
            Community
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.mainTab,
            activeTab === 'personal' && styles.mainTabActive,
          ]}
          onPress={() => {
            setActiveTab('personal');
            setQuery('');
          }}
        >
          <Ionicons
            name="chatbubbles-outline"
            size={rf(14)}
            color={activeTab === 'personal' ? '#141E30' : '#9CA3AF'}
          />
          <Text
            style={[
              styles.mainTabText,
              activeTab === 'personal' && styles.mainTabTextActive,
            ]}
          >
            Personal
          </Text>

          {incomingRequests.length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>
                {incomingRequests.length > 9 ? '9+' : incomingRequests.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {activeTab === 'personal' && (
        <>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" />

            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Search personal chats"
              placeholderTextColor="#9CA3AF"
              returnKeyType="search"
              accessibilityLabel="Search personal chats"
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

          <View style={styles.personalFilters}>
            {[
              { key: 'all', label: 'All', icon: 'apps-outline' },
              { key: 'favorites', label: 'Favorites', icon: 'star-outline' },
              { key: 'muted', label: 'Muted', icon: 'notifications-off-outline' },
            ].map((filter) => {
              const isActive = personalFilter === filter.key;

              return (
                <TouchableOpacity
                  key={filter.key}
                  style={[
                    styles.personalFilterButton,
                    isActive && styles.personalFilterButtonActive,
                  ]}
                  onPress={() => setPersonalFilter(filter.key)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={filter.label}
                >
                  <Ionicons
                    name={filter.icon}
                    size={rf(12)}
                    color={isActive ? '#141E30' : '#9CA3AF'}
                  />
                  <Text
                    style={[
                      styles.personalFilterText,
                      isActive && styles.personalFilterTextActive,
                    ]}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      <View style={styles.results}>
        {activeTab === 'personal' ? (
          renderPersonalChats()
        ) : (
          <ScrollView
            style={styles.results}
            contentContainerStyle={styles.resultsContent}
            showsVerticalScrollIndicator={false}
          >
            {renderCommunityHeader()}
          </ScrollView>
        )}
      </View>

      {renderNotifications()}
      {renderStatePicker()}
      {renderChatModal()}
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
  mainTabs: {
    flexDirection: 'row',
    marginHorizontal: wp(5),
    marginTop: hp(1),
    marginBottom: hp(1),
    padding: 4,
    backgroundColor: '#1A1F2E',
    borderWidth: 1,
    borderColor: '#2A3441',
    borderRadius: 25,
  },
  mainTab: {
    flex: 1,
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(1.5),
    borderRadius: 22,
  },
  mainTabActive: {
    backgroundColor: '#FFD700',
  },
  mainTabText: {
    color: '#9CA3AF',
    fontSize: rf(14),
    fontWeight: '700',
  },
  mainTabTextActive: {
    color: '#141E30',
  },
  tabBadge: {
    minWidth: 17,
    height: 17,
    paddingHorizontal: 3,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginHorizontal: wp(5),
    marginTop: hp(1),
    marginBottom: hp(1),
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
  },
  personalFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp(5),
    paddingLeft: wp(1),
    marginTop: hp(-0.6),
    marginBottom: hp(0.5),
    gap: wp(1),
  },
  personalFilterButton: {
    minHeight: 26,
    paddingHorizontal: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(0.5),
    borderWidth: 1,
    borderColor: '#2A3441',
    borderRadius: 13,
    backgroundColor: '#1A1F2E',
  },
  personalFilterButtonActive: {
    borderColor: '#FFD700',
    backgroundColor: '#FFD700',
  },
  personalFilterText: {
    color: '#9CA3AF',
    fontSize: rf(10),
    fontWeight: '700',
  },
  personalFilterTextActive: {
    color: '#141E30',
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
    borderColor: '#344256',
    borderRadius: 16,
    padding: wp(3.5),
    marginBottom: hp(1.2),
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.18)',
    elevation: 3,
  },
  playerCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  chatIndicator: {
    width: wp(10),
    height: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(5),
    backgroundColor: '#2A3441',
  },
  playerRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  playerAvatar: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    backgroundColor: '#242C3A',
    borderWidth: 1,
    borderColor: '#5B5125',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: wp(3),
  },
  playerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
  },
  playerName: {
    flexShrink: 1,
    color: '#FFFFFF',
    fontSize: rf(15),
    fontWeight: '700',
  },
  playerDetails: {
    color: '#FFD700',
    fontSize: rf(12),
    marginTop: hp(0.3),
  },
  playerLocation: {
    color: '#9CA3AF',
    fontSize: rf(11),
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
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 18,
  },
  acceptText: {
    color: '#141E30',
    fontSize: rf(11),
    fontWeight: '700',
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

  // Community
  communityIntro: {
    paddingBottom: hp(2),
  },
  sectionHeading: {
    color: '#FFFFFF',
    fontSize: rf(14),
    fontWeight: '800',
    marginTop: hp(1),
    marginBottom: hp(1),
  },
  communityChannel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1F2E',
    borderWidth: 1,
    borderColor: '#2A3441',
    borderRadius: 12,
    padding: wp(3),
    marginBottom: hp(1),
  },
  channelIcon: {
    width: wp(12),
    height: wp(12),
    borderRadius: 12,
    backgroundColor: '#2A3441',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneIcon: {
    width: wp(12),
    height: wp(12),
    borderRadius: 12,
    backgroundColor: '#2A3441',
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelInfo: {
    flex: 1,
    marginLeft: wp(3),
  },
  channelName: {
    color: '#FFFFFF',
    fontSize: rf(13),
    fontWeight: '700',
  },
  channelDescription: {
    color: '#9CA3AF',
    fontSize: rf(10),
    marginTop: hp(0.4),
  },
  stateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
    backgroundColor: '#1A1F2E',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 12,
    paddingHorizontal: wp(4),
    minHeight: hp(6.5),
  },
  stateSelectorText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: rf(13),
    fontWeight: '600',
  },
  zoneSection: {
    marginTop: hp(1.5),
  },
  zoneDescription: {
    color: '#9CA3AF',
    fontSize: rf(11),
    marginBottom: hp(1),
  },
  communityFootnote: {
    color: '#64748B',
    fontSize: rf(10),
    lineHeight: rf(15),
    textAlign: 'center',
    marginTop: hp(2),
    paddingHorizontal: wp(3),
  },

  // Modals
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: wp(5),
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  modalDismissArea: {
    ...StyleSheet.absoluteFillObject,
  },
  chatDialogOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(5),
    backgroundColor: 'rgba(0, 0, 0, 0.68)',
    zIndex: 50,
    elevation: 50,
  },
  playerMenuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 10,
    elevation: 10,
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
  menuModal: {
    width: '100%',
    maxWidth: 280,
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    backgroundColor: '#233138',
    borderWidth: 1,
    borderColor: '#36454F',
    borderRadius: 12,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  menuHeaderInfo: {
    flex: 1,
    minWidth: 0,
  },
  menuTitle: {
    color: '#FFFFFF',
    fontSize: rf(17),
    fontWeight: '700',
  },
  menuSubtitle: {
    color: '#9CA3AF',
    fontSize: rf(12),
    marginTop: hp(0.4),
  },
  closeButton: {
    padding: wp(1),
  },
  playerMenuPopover: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 8,
    alignSelf: 'auto',
    zIndex: 40,
    elevation: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 42,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  menuItemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#36454F',
    marginVertical: 3,
    marginHorizontal: 8,
  },
  playerActionContent: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  playerActionTitle: {
    color: '#E9EDEF',
    fontSize: 15,
    fontWeight: '600',
  },
  playerActionDescription: {
    color: '#B8C2C8',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  playerActionError: {
    color: '#FCA5A5',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 8,
  },
  playerActionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
  playerActionCancelButton: {
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#2A3942',
    borderRadius: 18,
  },
  playerActionCancelText: {
    color: '#E9EDEF',
    fontSize: 12,
    fontWeight: '600',
  },
  playerActionConfirmButton: {
    minWidth: 72,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#B42332',
    borderRadius: 18,
  },
  playerActionConfirmText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  menuLoader: {
    marginTop: hp(1),
  },
  reportModal: {
    width: '100%',
    maxWidth: 460,
    maxHeight: '88%',
    alignSelf: 'center',
    padding: wp(5),
    backgroundColor: '#202C33',
    borderWidth: 1,
    borderColor: '#36454F',
    borderRadius: 16,
  },
  reportLabel: {
    color: '#E9EDEF',
    fontSize: rf(12),
    fontWeight: '600',
    marginTop: hp(1),
    marginBottom: hp(0.8),
  },
  reportReasonsList: {
    maxHeight: hp(28),
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
    borderRadius: 8,
    marginBottom: hp(0.3),
  },
  reasonOptionSelected: {
    backgroundColor: '#2A3942',
  },
  reasonText: {
    color: '#E9EDEF',
    fontSize: rf(12),
    marginLeft: wp(2),
  },
  reasonTextSelected: {
    color: '#00A884',
    fontWeight: '700',
  },
  reportInput: {
    minHeight: hp(10),
    maxHeight: hp(16),
    color: '#E9EDEF',
    fontSize: rf(12),
    backgroundColor: '#0B141A',
    borderWidth: 1,
    borderColor: '#36454F',
    borderRadius: 9,
    padding: wp(3),
    marginTop: hp(0.5),
  },
  submitReportButton: {
    minHeight: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00A884',
    borderRadius: 22,
    marginTop: hp(2),
  },
  submitReportText: {
    color: '#FFFFFF',
    fontSize: rf(13),
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.5,
  },

  // State picker
  statePickerModal: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '82%',
    alignSelf: 'center',
    padding: wp(5),
    backgroundColor: '#1A1F2E',
    borderWidth: 1,
    borderColor: '#2A3441',
    borderRadius: 16,
  },
  stateOption: {
    minHeight: hp(5.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
    borderBottomWidth: 1,
    borderBottomColor: '#2A3441',
  },
  stateOptionSelected: {
    backgroundColor: '#2A3441',
  },
  stateOptionText: {
    color: '#D1D5DB',
    fontSize: rf(12),
  },
  stateOptionTextSelected: {
    color: '#FFD700',
    fontWeight: '700',
  },

  // Chat screen
  chatScreen: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#0B141A',
  },
  chatHeaderWithMenu: {
    zIndex: 20,
    elevation: 20,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#2A3942',
    backgroundColor: '#202C33',
  },
  chatBackButton: {
    padding: wp(1),
    marginRight: wp(2),
  },
  chatHeaderAvatar: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    backgroundColor: '#075E54',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatHeaderInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: wp(3),
  },
  chatHeaderName: {
    color: '#E9EDEF',
    fontSize: rf(14),
    fontWeight: '700',
  },
  chatHeaderSubtitle: {
    color: '#8696A0',
    fontSize: rf(10),
    marginTop: 2,
  },
  chatHeaderAction: {
    padding: wp(2),
  },
  playerOptionsAnchor: {
    position: 'relative',
    zIndex: 30,
    elevation: 30,
  },
  chatStatus: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(1.5),
    gap: wp(2),
  },
  chatStatusText: {
    color: '#8696A0',
    fontSize: rf(11),
  },
  chatErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    margin: wp(3),
    padding: wp(3),
    backgroundColor: '#38232B',
    borderRadius: 10,
  },
  chatErrorText: {
    flex: 1,
    color: '#FCA5A5',
    fontSize: rf(11),
  },
  retryText: {
    color: '#FFD700',
    fontWeight: '700',
    fontSize: rf(11),
  },
  chatMessagesArea: {
    flex: 1,
    backgroundColor: '#0B141A',
  },
  chatMessagesContent: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  chatEmptyArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(10),
  },
  chatEmptyIcon: {
    width: wp(19),
    height: wp(19),
    borderRadius: wp(9.5),
    backgroundColor: '#202C33',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
  },
  chatEmptyTitle: {
    color: '#E9EDEF',
    fontSize: rf(16),
    fontWeight: '700',
    textAlign: 'center',
  },
  chatEmptyDescription: {
    color: '#8696A0',
    fontSize: rf(12),
    lineHeight: rf(18),
    textAlign: 'center',
    marginTop: hp(1),
  },
  messageRow: {
    width: '100%',
    marginBottom: hp(1),
    flexDirection: 'row',
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  theirMessageRow: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '82%',
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(1),
    borderRadius: 12,
  },
  myMessageBubble: {
    backgroundColor: '#005C4B',
    borderBottomRightRadius: 3,
  },
  theirMessageBubble: {
    backgroundColor: '#202C33',
    borderBottomLeftRadius: 3,
  },
  messageBubbleText: {
    fontSize: rf(13),
    lineHeight: rf(19),
  },
  myMessageText: {
    color: '#E9EDEF',
  },
  theirMessageText: {
    color: '#E9EDEF',
  },
  messageTime: {
    fontSize: rf(9),
    textAlign: 'right',
    marginTop: hp(0.5),
  },
  myMessageTime: {
    color: '#B7D7D1',
  },
  theirMessageTime: {
    color: '#8696A0',
  },
  messageComposer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    backgroundColor: '#202C33',
  },
  messageInput: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    minHeight: hp(5),
    maxHeight: hp(12),
    color: '#E9EDEF',
    backgroundColor: '#2A3942',
    borderRadius: 22,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    fontSize: rf(12),
  },
  sendButton: {
    width: wp(10),
    height: wp(10),
    flexShrink: 0,
    borderRadius: wp(5),
    backgroundColor: '#00A884',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.45,
  },
});
