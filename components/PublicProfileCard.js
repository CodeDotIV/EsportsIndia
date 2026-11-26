
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { hp, rf, wp } from '../utils/responsive';
import { Alert } from './AppDialog.js';
import {
  sendConnectionRequest,
  withdrawConnectionRequest,
} from '../services/connections';

export default function PublicProfileCard({
  profile,
  connectionStatus: initialConnectionStatus = 'none',
  onConnectionStatusChange,
}) {
  const [connectionStatus, setConnectionStatus] = useState(
    initialConnectionStatus
  );
  const [sending, setSending] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    setConnectionStatus(initialConnectionStatus || 'none');
  }, [initialConnectionStatus]);

  if (!profile) return null;

  const name =
    profile.full_name ||
    profile.display_name ||
    profile.name ||
    'Player';

  const gameDetails = [
    profile.game,
    profile.team_name,
    profile.team_type,
  ]
    .filter(Boolean)
    .join(' · ');

  const location = [
    profile.state,
    profile.zone,
  ]
    .filter(Boolean)
    .join(' · ');

  const updateConnectionStatus = (status) => {
    setConnectionStatus(status);
    onConnectionStatusChange?.(profile.user_id, status);
  };

  const handleWithdraw = async () => {
    try {
      setWithdrawing(true);
      await withdrawConnectionRequest(profile.user_id);
      updateConnectionStatus('none');
      Alert.alert('Request cancelled', `Your request to ${name} was cancelled.`);
    } catch (error) {
      console.error('Withdraw connection request error:', error);
      Alert.alert(
        'Unable to cancel request',
        error?.message || 'Please try again.'
      );
    } finally {
      setWithdrawing(false);
    }
  };

  const confirmWithdraw = () => {
    Alert.alert(
      'Cancel request?',
      `Cancel your connection request to ${name}?`,
      [
        { text: 'Keep Request', style: 'cancel' },
        { text: 'Cancel Request', style: 'destructive', onPress: handleWithdraw },
      ]
    );
  };

  const handleConnect = async () => {
    if (!profile.user_id) {
      Alert.alert('Unable to connect', 'Player ID is missing.');
      return;
    }

    if (sending || withdrawing || connectionStatus === 'pending' ||
        connectionStatus === 'accepted' ||
        connectionStatus === 'incoming' ||
        connectionStatus === 'loading' ||
        connectionStatus === 'unavailable') {
      return;
    }

    try {
      setSending(true);

      const result = await sendConnectionRequest(profile.user_id);

      const status =
        typeof result === 'string'
          ? result
          : result?.status || result?.data?.status;

      if (status === 'pending') {
        updateConnectionStatus('pending');
        Alert.alert('Request sent', `Your connection request was sent to ${name}.`);
      } else if (status === 'accepted') {
        updateConnectionStatus('accepted');
        Alert.alert('Connected', `You are already connected with ${name}.`);
      } else if (status === 'incoming') {
        updateConnectionStatus('incoming');
        Alert.alert(
          'Request received',
          `${name} has already sent you a connection request. Open Network to respond.`
        );
      } else {
        updateConnectionStatus('pending');
        Alert.alert('Request sent', 'Your connection request was submitted.');
      }
    } catch (error) {
      console.error('Connect request error:', error);
      Alert.alert(
        'Connection failed',
        error?.message || 'Unable to send connection request. Please try again.'
      );
    } finally {
      setSending(false);
    }
  };

  const getButtonLabel = () => {
    if (sending) return 'Sending...';
    if (withdrawing) return 'Cancelling...';

    switch (connectionStatus) {
      case 'pending':
        return 'Cancel Request';
      case 'accepted':
        return 'Connected';
      case 'incoming':
        return 'Respond in Network';
      case 'loading':
        return 'Checking...';
      case 'unavailable':
        return 'Status unavailable';
      default:
        return 'Connect';
    }
  };

  const getButtonIcon = () => {
    switch (connectionStatus) {
      case 'pending':
        return 'close-circle-outline';
      case 'accepted':
        return 'checkmark-circle';
      case 'incoming':
        return 'mail-outline';
      case 'loading':
        return 'sync-outline';
      case 'unavailable':
        return 'alert-circle-outline';
      default:
        return 'person-add-outline';
    }
  };

  const isDisabled =
    sending ||
    withdrawing ||
    connectionStatus === 'accepted' ||
    connectionStatus === 'incoming' ||
    connectionStatus === 'loading' ||
    connectionStatus === 'unavailable';

  return (
    <View style={styles.card}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons
            name="person"
            size={rf(25)}
            color="#A5A5B5"
          />
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>

          {!!gameDetails && (
            <Text style={styles.gameDetails} numberOfLines={1}>
              {gameDetails}
            </Text>
          )}

          {!!location && (
            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={rf(13)}
                color="#85859A"
              />
              <Text style={styles.location} numberOfLines={1}>
                {location}
              </Text>
            </View>
          )}
        </View>

      </View>

      {/* Bio */}
      {!!profile.bio && (
        <Text style={styles.bio} numberOfLines={3}>
          {profile.bio}
        </Text>
      )}

      {/* Looking For */}
      {!!profile.looking_for && (
        <View style={styles.lookingForContainer}>
          <Text style={styles.smallLabel}>LOOKING FOR</Text>
          <Text style={styles.lookingFor}>
            {profile.looking_for}
          </Text>
        </View>
      )}

      {/* Tournament Partners */}
      {profile.tournament_partners && (
        <View style={styles.tournamentRow}>
          <Ionicons
            name="trophy-outline"
            size={rf(14)}
            color="#F5C451"
          />
          <Text style={styles.tournamentText}>
            Interested in tournament partnerships
          </Text>
        </View>
      )}

      {/* Connect Button */}
      <TouchableOpacity
        style={[
          styles.connectButton,
          connectionStatus === 'accepted' && styles.connectedButton,
          connectionStatus === 'pending' && styles.pendingButton,
          connectionStatus === 'incoming' && styles.incomingButton,
          isDisabled && styles.disabledButton,
        ]}
        onPress={connectionStatus === 'pending' ? confirmWithdraw : handleConnect}
        disabled={isDisabled}
        activeOpacity={0.8}
      >
        {sending || withdrawing || connectionStatus === 'loading' ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Ionicons
            name={getButtonIcon()}
            size={rf(16)}
            color="#FFFFFF"
          />
        )}

        <Text style={styles.connectButtonText}>
          {getButtonLabel()}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#171724',
    borderRadius: wp(4),
    padding: wp(4),
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderColor: '#29293B',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(6.5),
    backgroundColor: '#29293B',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerInfo: {
    flex: 1,
    marginLeft: wp(3),
    marginRight: wp(2),
  },

  name: {
    color: '#FFFFFF',
    fontSize: rf(16),
    fontWeight: '700',
  },

  gameDetails: {
    color: '#A78BFA',
    fontSize: rf(12),
    marginTop: hp(0.3),
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(0.4),
  },

  location: {
    color: '#85859A',
    fontSize: rf(11),
    marginLeft: wp(1),
  },

  bio: {
    color: '#B5B5C5',
    fontSize: rf(12),
    lineHeight: rf(18),
    marginTop: hp(1.3),
  },

  lookingForContainer: {
    backgroundColor: '#222235',
    borderRadius: wp(2),
    padding: wp(2.5),
    marginTop: hp(1.3),
  },

  smallLabel: {
    color: '#85859A',
    fontSize: rf(9),
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: hp(0.4),
  },

  lookingFor: {
    color: '#D6D6E2',
    fontSize: rf(11),
  },

  tournamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(1.2),
  },

  tournamentText: {
    color: '#D6D6E2',
    fontSize: rf(11),
    marginLeft: wp(1.5),
  },

  connectButton: {
    backgroundColor: '#7654E8',
    minHeight: hp(5),
    borderRadius: wp(2.5),
    marginTop: hp(1.8),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp(2),
  },

  connectedButton: {
    backgroundColor: '#237A55',
  },

  pendingButton: {
    backgroundColor: '#55556A',
  },

  incomingButton: {
    backgroundColor: '#7654E8',
  },

  disabledButton: {
    opacity: 0.85,
  },

  connectButtonText: {
    color: '#FFFFFF',
    fontSize: rf(12),
    fontWeight: '700',
  },
});
