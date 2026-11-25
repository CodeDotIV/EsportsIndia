
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { hp, rf, wp } from '../utils/responsive';

export default function PublicProfileCard({ profile = {} }) {
  const name =
    profile.full_name ||
    profile.display_name ||
    profile.name ||
    'Player';

  const game = profile.game || '';
  const teamType = profile.team_type || '';
  const teamName = profile.team_name || '';

  const location = [
    profile.state,
    profile.zone,
  ].filter(Boolean).join(' · ');

  const lookingFor = profile.looking_for || '';
  const bio = profile.bio || '';

  const initial = String(name).trim().charAt(0).toUpperCase() || 'P';

  return (
    <View style={styles.card}>
      {/* Top accent */}
      <View style={styles.accentLine} />

      {/* Player header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
          <View style={styles.onlineDot} />
        </View>

        <View style={styles.playerInfo}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>

          <View style={styles.badges}>
            {game ? (
              <View style={styles.gameBadge}>
                <Ionicons
                  name="game-controller-outline"
                  size={12}
                  color="#FFD700"
                />
                <Text style={styles.gameText}>{game}</Text>
              </View>
            ) : null}

            {teamType ? (
              <View style={styles.typeBadge}>
                <Text style={styles.typeText}>{teamType}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color="#64748B"
        />
      </View>

      {/* Team information */}
      {teamName ? (
        <View style={styles.teamSection}>
          <View style={styles.sectionIcon}>
            <Ionicons
              name="people-outline"
              size={17}
              color="#FFD700"
            />
          </View>

          <View style={styles.sectionContent}>
            <Text style={styles.sectionLabel}>TEAM</Text>
            <Text style={styles.teamName} numberOfLines={1}>
              {teamName}
            </Text>
          </View>
        </View>
      ) : null}

      {/* Location */}
      {location ? (
        <View style={styles.locationRow}>
          <Ionicons
            name="location-outline"
            size={15}
            color="#94A3B8"
          />
          <Text style={styles.locationText}>{location}</Text>
        </View>
      ) : null}

      {/* Bio */}
      {bio ? (
        <View style={styles.bioContainer}>
          <Text style={styles.bioLabel}>ABOUT PLAYER</Text>
          <Text style={styles.bio}>{bio}</Text>
        </View>
      ) : null}

      {/* Footer */}
      {(lookingFor || profile.tournament_partners) ? (
        <View style={styles.footer}>
          {lookingFor ? (
            <View style={styles.lookingBadge}>
              <Ionicons
                name="search-outline"
                size={13}
                color="#CBD5E1"
              />
              <Text style={styles.lookingText} numberOfLines={1}>
                Looking for: {lookingFor}
              </Text>
            </View>
          ) : null}

          {profile.tournament_partners ? (
            <View style={styles.partnerBadge}>
              <Ionicons
                name="trophy-outline"
                size={13}
                color="#34D399"
              />
              <Text style={styles.partnerText}>
                Tournament Partner
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: hp(1.8),
    padding: wp(4),
    backgroundColor: '#1B2638',
    borderWidth: 1,
    borderColor: '#2B3A50',
    borderRadius: 16,
    overflow: 'hidden',
  },

  accentLine: {
    position: 'absolute',
    top: 0,
    left: wp(4),
    width: wp(12),
    height: 3,
    backgroundColor: '#FFD700',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },

  avatar: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(6.5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#303D52',
    borderWidth: 1.5,
    borderColor: '#FFD700',
  },

  avatarText: {
    color: '#FFD700',
    fontSize: rf(21),
    fontWeight: '800',
  },

  onlineDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#34D399',
    borderWidth: 2,
    borderColor: '#1B2638',
  },

  playerInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: wp(3),
  },

  name: {
    color: '#FFFFFF',
    fontSize: rf(17),
    fontWeight: '800',
    marginBottom: hp(0.6),
  },

  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: wp(1.5),
  },

  gameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: wp(2.2),
    paddingVertical: hp(0.4),
    backgroundColor: 'rgba(255,215,0,0.12)',
    borderRadius: 6,
  },

  gameText: {
    color: '#FFD700',
    fontSize: rf(10),
    fontWeight: '700',
  },

  typeBadge: {
    paddingHorizontal: wp(2.2),
    paddingVertical: hp(0.4),
    backgroundColor: '#29384C',
    borderRadius: 6,
  },

  typeText: {
    color: '#CBD5E1',
    fontSize: rf(10),
    fontWeight: '600',
  },

  teamSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
    backgroundColor: '#243248',
    borderRadius: 10,
    marginBottom: hp(1.2),
  },

  sectionIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,215,0,0.10)',
  },

  sectionContent: {
    flex: 1,
    marginLeft: wp(2.5),
  },

  sectionLabel: {
    color: '#94A3B8',
    fontSize: rf(9),
    fontWeight: '700',
    letterSpacing: 1,
  },

  teamName: {
    color: '#FFFFFF',
    fontSize: rf(14),
    fontWeight: '700',
    marginTop: 2,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    marginBottom: hp(1.2),
  },

  locationText: {
    color: '#A8B5C7',
    fontSize: rf(11),
  },

  bioContainer: {
    paddingTop: hp(1.2),
    borderTopWidth: 1,
    borderTopColor: '#304057',
  },

  bioLabel: {
    color: '#8292A8',
    fontSize: rf(9),
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: hp(0.5),
  },

  bio: {
    color: '#E2E8F0',
    fontSize: rf(12),
    lineHeight: rf(19),
  },

  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: wp(2),
    marginTop: hp(1.3),
  },

  lookingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.7),
    backgroundColor: '#29384C',
    borderRadius: 7,
    maxWidth: '100%',
  },

  lookingText: {
    color: '#CBD5E1',
    fontSize: rf(10),
    fontWeight: '600',
    flexShrink: 1,
  },

  partnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.7),
    backgroundColor: 'rgba(52,211,153,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.22)',
    borderRadius: 7,
  },

  partnerText: {
    color: '#34D399',
    fontSize: rf(10),
    fontWeight: '700',
  },
});
