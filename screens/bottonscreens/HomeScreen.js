
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { wp, hp, rf, rs } from '../../utils/responsive';
import { getItem } from '../../utils/storageHelper';

const { width } = Dimensions.get('window');

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 24) return 'Good Evening';
  return 'Good Night';
};

const gameData = [
  {
    id: 1,
    title: 'BGMI',
    image: require('../../assets/images/bgmi.png'),
    navigation: 'Aboutbgmi',
    description: 'Experience intense battle action with realistic mechanics and immersive environments.',
  },
  {
    id: 2,
    title: 'Free Fire',
    image: require('../../assets/images/freefire.png'),
    navigation: 'Aboutfreefire',
    description: 'Fast-paced survival shooter with quick matches and diverse maps.',
  },
  {
    id: 3,
    title: 'Call of Duty',
    image: require('../../assets/images/callofduty.png'),
    navigation: 'Aboutcallofduty',
    description: 'Iconic FPS gameplay with multiple modes and realistic action.',
  },
  {
    id: 4,
    title: 'Valorant',
    image: require('../../assets/images/valorant.png'),
    navigation: 'Aboutvalorant',
    description: 'Tactical 5v5 shooter blending precision gunplay with unique agent abilities.',
  },
];

const latestUpdates = [
  {
    id: 1,
    title: 'Tournament updates',
    description: 'Check the Esports section for upcoming tournament announcements.',
  },
  {
    id: 2,
    title: 'Community news',
    description: 'Follow EsportsIndia to stay connected with the gaming community.',
  },
];

const membershipPlans = [
  {
    id: 'free',
    name: 'FREE',
    subtitle: 'Get started',
    icon: 'person-outline',
    color: '#9CA3AF',
  },
  {
    id: 'pro',
    name: 'PRO',
    subtitle: 'More customisation',
    icon: 'flash-outline',
    color: '#38BDF8',
  },
  {
    id: 'elite',
    name: 'ELITE',
    subtitle: 'Premium experience',
    icon: 'diamond-outline',
    color: '#FFD700',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [greeting] = useState(getGreeting());
  const [userGender, setUserGender] = useState(null);

  const loadUserGender = useCallback(async () => {
    try {
      const userData = await getItem('user');

      if (userData) {
        const user =
          typeof userData === 'string'
            ? JSON.parse(userData)
            : userData;

        setUserGender(user?.gender || null);
      }
    } catch (error) {
      console.error('Failed to load user gender:', error);
    }
  }, []);

  useEffect(() => {
    loadUserGender();
  }, [loadUserGender]);

  useFocusEffect(
    useCallback(() => {
      loadUserGender();
    }, [loadUserGender])
  );

  const getProfileIcon = () => {
    if (userGender === 'Male') {
      return 'person';
    }

    return 'person-outline';
  };

  const navigateTo = (routeName) => {
    const routeExists = navigation
      .getState()
      ?.routeNames?.includes(routeName);

    if (routeExists) {
      navigation.navigate(routeName);
    } else {
      Alert.alert(
        'Coming soon',
        `${routeName} screen is not connected yet. Add this screen to your navigator to enable this option.`
      );
    }
  };

  const handleGamePress = (game) => {
    navigateTo(game.navigation);
  };

  const handleSocialMediaPress = (url, platform) => {
    Linking.openURL(url).catch(() => {
      Alert.alert(
        'Error',
        `Could not open ${platform}. Please try again.`
      );
    });
  };

  const socialMediaLinks = [
    {
      id: 1,
      name: 'Instagram',
      icon: 'logo-instagram',
      color: '#E4405F',
      url: 'https://instagram.com/esportsindia',
    },
    {
      id: 2,
      name: 'Twitter',
      icon: 'logo-twitter',
      color: '#1DA1F2',
      url: 'https://twitter.com/esportsindia',
    },
    {
      id: 3,
      name: 'Discord',
      icon: 'logo-discord',
      color: '#5865F2',
      url: 'https://discord.gg/esportsindia',
    },
    {
      id: 4,
      name: 'YouTube',
      icon: 'logo-youtube',
      color: '#FF0000',
      url: 'https://youtube.com/@esportsindia',
    },
    {
      id: 5,
      name: 'Twitch',
      icon: 'logo-twitch',
      color: '#9146FF',
      url: 'https://twitch.tv/esportsindia',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/applogo.png')}
            style={styles.logo}
          />
        </View>

        <View style={styles.headerTextContainer}>
          <Text style={styles.greeting}>
            {greeting}!
          </Text>

          <Text style={styles.headerTitle}>
            EsportsIndia
          </Text>
        </View>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigateTo('Profile')}
          activeOpacity={0.7}
        >
          <View style={styles.profileIconContainer}>
            <Ionicons
              name={getProfileIcon()}
              size={24}
              color="white"
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            Welcome to EsportsIndia
          </Text>

          <Text style={styles.welcomeSubtitle}>
            Your ultimate destination for esports tournaments
            and gaming excellence.
          </Text>
        </View>

        {/* Featured Tournament */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Featured Tournament
            </Text>

            <TouchableOpacity
              onPress={() => navigateTo('Tournaments')}
            >
              <Text style={styles.seeAllText}>
                View all
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.tournamentCard}
            onPress={() => navigateTo('Tournaments')}
            activeOpacity={0.85}
          >
            <View style={styles.tournamentTopRow}>
              <View style={styles.tournamentTag}>
                <Text style={styles.tournamentTagText}>
                  FEATURED
                </Text>
              </View>

              <Text style={styles.tournamentGame}>
                BGMI
              </Text>
            </View>

            <Text style={styles.tournamentTitle}>
              BGMI Championship
            </Text>

            <View style={styles.prizeRow}>
              <View>
                <Text style={styles.metaLabel}>
                  Prize pool
                </Text>

                <Text style={styles.prizeValue}>
                  Prize details
                </Text>
              </View>

              <View style={styles.registrationStatus}>
                <Text style={styles.registrationStatusText}>
                  Explore tournaments
                </Text>
              </View>
            </View>

            <Text style={styles.tournamentHint}>
              Tap to view tournament details and registration.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Featured Games */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Featured Games
            </Text>

            <TouchableOpacity
              onPress={() => navigateTo('Esports')}
            >
              <Text style={styles.seeAllText}>
                View all
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gamesGrid}>
            {gameData.map((game) => (
              <TouchableOpacity
                key={game.id}
                style={styles.gameCard}
                onPress={() => handleGamePress(game)}
                activeOpacity={0.8}
              >
                <View style={styles.gameImageContainer}>
                  <Image
                    source={game.image}
                    style={styles.gameImage}
                    resizeMode="contain"
                  />
                </View>

                <View style={styles.gameCardContent}>
                  <Text style={styles.gameCardTitle}>
                    {game.title}
                  </Text>

                  <Text
                    style={styles.gameCardDescription}
                    numberOfLines={2}
                  >
                    {game.description}
                  </Text>

                  <View style={styles.gameCardFooter}>
                    <Text style={styles.viewMoreText}>
                      View Details →
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Explore */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Explore
          </Text>

          <View style={styles.exploreGrid}>
            <TouchableOpacity
              style={styles.exploreCard}
              onPress={() => navigateTo('Esports')}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.exploreIcon,
                  { backgroundColor: '#2563EB22' },
                ]}
              >
                <Ionicons
                  name="game-controller"
                  size={27}
                  color="#60A5FA"
                />
              </View>

              <Text style={styles.exploreTitle}>
                Esports
              </Text>

              <Text style={styles.exploreSubtitle}>
                Games and tournaments
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.exploreCard}
              onPress={() => navigateTo('WatchEarn')}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.exploreIcon,
                  { backgroundColor: '#16A34A22' },
                ]}
              >
                <Ionicons
                  name="play-circle"
                  size={27}
                  color="#4ADE80"
                />
              </View>

              <Text style={styles.exploreTitle}>
                Watch & Earn
              </Text>

              <Text style={styles.exploreSubtitle}>
                Earn reward coins
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.exploreCard}
              onPress={() => navigateTo('MembershipPlans')}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.exploreIcon,
                  { backgroundColor: '#D9770622' },
                ]}
              >
                <Ionicons
                  name="diamond"
                  size={27}
                  color="#FBBF24"
                />
              </View>

              <Text style={styles.exploreTitle}>
                Membership Plans
              </Text>

              <Text style={styles.exploreSubtitle}>
                Find your plan
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Membership Plans */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Choose Your Plan
            </Text>

            <TouchableOpacity
              onPress={() => navigateTo('MembershipPlans')}
            >
              <Text style={styles.seeAllText}>
                View plans
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.plansRow}>
            {membershipPlans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={styles.planCard}
                onPress={() => navigateTo('MembershipPlans')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={plan.icon}
                  size={23}
                  color={plan.color}
                />

                <Text
                  style={[
                    styles.planName,
                    { color: plan.color },
                  ]}
                >
                  {plan.name}
                </Text>

                <Text style={styles.planSubtitle}>
                  {plan.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Latest Updates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Latest Updates
          </Text>

          <View style={styles.updatesCard}>
            {latestUpdates.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.updateItem,
                  index > 0 && styles.updateDivider,
                ]}
              >
                <View style={styles.updateIcon}>
                  <Ionicons
                    name="notifications-outline"
                    size={19}
                    color="#FFD700"
                  />
                </View>

                <View style={styles.updateTextContainer}>
                  <Text style={styles.updateTitle}>
                    {item.title}
                  </Text>

                  <Text style={styles.updateDescription}>
                    {item.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Why Choose EsportsIndia */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>
            Why Choose EsportsIndia?
          </Text>

          {[
            'Premium esports tournaments',
            'Multiple gaming modes (Solo, Duo, Squad)',
            'Leaderboards and player rankings',
            'Fair play and transparent tournament rules',
          ].map((item) => (
            <View key={item} style={styles.infoItem}>
              <Text style={styles.infoBullet}>•</Text>

              <Text style={styles.infoText}>
                {item}
              </Text>
            </View>
          ))}
        </View>

        {/* Social Media */}
        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>
            Follow Us
          </Text>

          <Text style={styles.socialSubtitle}>
            Stay connected with EsportsIndia on social media.
          </Text>

          <View style={styles.socialIconsContainer}>
            {socialMediaLinks.map((social) => (
              <TouchableOpacity
                key={social.id}
                style={styles.socialIconButton}
                onPress={() =>
                  handleSocialMediaPress(
                    social.url,
                    social.name
                  )
                }
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.socialIconWrapper,
                    {
                      backgroundColor: `${social.color}15`,
                    },
                  ]}
                >
                  <Ionicons
                    name={social.icon}
                    size={rs(25)}
                    color={social.color}
                  />
                </View>

                <Text style={styles.socialIconLabel}>
                  {social.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
    paddingHorizontal: wp(4),
    paddingTop: hp(1.5),
    paddingBottom: hp(1.5),
  },

  logoContainer: {
    marginRight: wp(3),
  },

  logo: {
    width: rs(50),
    height: rs(50),
    borderRadius: rs(25),
    borderWidth: 2,
    borderColor: '#FFD700',
  },

  headerTextContainer: {
    flex: 1,
  },

  profileButton: {
    padding: 4,
  },

  profileIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'white',
  },

  greeting: {
    fontSize: rf(12),
    color: '#9CA3AF',
    fontWeight: '500',
  },

  headerTitle: {
    fontSize: rf(19),
    fontWeight: 'bold',
    color: 'white',
  },

  divider: {
    height: 2,
    backgroundColor: '#FFD700',
    width: '100%',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: hp(4),
  },

  welcomeSection: {
    backgroundColor: '#1A1F2E',
    paddingVertical: hp(2.5),
    paddingHorizontal: wp(5),
    marginTop: hp(2),
    marginBottom: hp(2),
    marginHorizontal: wp(4),
    borderRadius: rs(12),
    borderWidth: 1,
    borderColor: '#2A3441',
  },

  welcomeTitle: {
    fontSize: rf(22),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp(0.8),
    textAlign: 'center',
  },

  welcomeSubtitle: {
    fontSize: rf(13),
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: rf(19),
  },

  section: {
    marginBottom: hp(2.5),
    paddingHorizontal: wp(4),
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(1.5),
  },

  sectionTitle: {
    fontSize: rf(19),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp(1.5),
    paddingLeft: wp(1),
  },

  seeAllText: {
    color: '#FFD700',
    fontSize: rf(12),
    fontWeight: '600',
    marginBottom: hp(1.5),
  },

  tournamentCard: {
    backgroundColor: '#1A1F2E',
    padding: wp(4),
    borderRadius: rs(12),
    borderWidth: 1,
    borderColor: '#4B5563',
  },

  tournamentTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },

  tournamentTag: {
    backgroundColor: '#854D0E',
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: rs(5),
  },

  tournamentTagText: {
    color: '#FDE68A',
    fontSize: rf(9),
    fontWeight: 'bold',
  },

  tournamentGame: {
    color: '#9CA3AF',
    fontSize: rf(11),
    fontWeight: '600',
  },

  tournamentTitle: {
    color: '#FFFFFF',
    fontSize: rf(19),
    fontWeight: 'bold',
    marginBottom: hp(1.5),
  },

  prizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  metaLabel: {
    color: '#9CA3AF',
    fontSize: rf(11),
    marginBottom: 3,
  },

  prizeValue: {
    color: '#FFD700',
    fontSize: rf(16),
    fontWeight: 'bold',
  },

  registrationStatus: {
    backgroundColor: '#1D4ED8',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: rs(7),
  },

  registrationStatusText: {
    color: '#FFFFFF',
    fontSize: rf(10),
    fontWeight: '600',
  },

  tournamentHint: {
    color: '#9CA3AF',
    fontSize: rf(11),
    marginTop: hp(1.5),
  },

  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  gameCard: {
    width: (width - wp(12)) / 2,
    backgroundColor: '#1A1F2E',
    borderRadius: rs(12),
    marginBottom: hp(1.8),
    overflow: 'hidden',
    elevation: 3,
    borderWidth: 1,
    borderColor: '#2A3441',
  },

  gameImageContainer: {
    width: '100%',
    height: hp(14),
    backgroundColor: '#0F1419',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2A3441',
  },

  gameImage: {
    width: '80%',
    height: '80%',
  },

  gameCardContent: {
    padding: wp(3),
  },

  gameCardTitle: {
    fontSize: rf(15),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp(0.6),
  },

  gameCardDescription: {
    fontSize: rf(11),
    color: '#9CA3AF',
    lineHeight: rf(15),
    marginBottom: hp(1),
  },

  gameCardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#2A3441',
    paddingTop: hp(0.8),
  },

  viewMoreText: {
    fontSize: rf(11),
    color: '#FFD700',
    fontWeight: '600',
  },

  exploreGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  exploreCard: {
    width: '31.5%',
    backgroundColor: '#1A1F2E',
    borderRadius: rs(10),
    paddingVertical: hp(1.7),
    paddingHorizontal: wp(2),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3441',
  },

  exploreIcon: {
    width: rs(48),
    height: rs(48),
    borderRadius: rs(24),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(1),
  },

  exploreTitle: {
    color: '#FFFFFF',
    fontSize: rf(11),
    fontWeight: 'bold',
    textAlign: 'center',
  },

  exploreSubtitle: {
    color: '#9CA3AF',
    fontSize: rf(9),
    textAlign: 'center',
    marginTop: hp(0.5),
  },

  plansRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  planCard: {
    width: '31.5%',
    backgroundColor: '#1A1F2E',
    borderRadius: rs(10),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(2),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3441',
  },

  planName: {
    fontSize: rf(13),
    fontWeight: 'bold',
    marginTop: hp(0.6),
  },

  planSubtitle: {
    color: '#9CA3AF',
    fontSize: rf(9),
    textAlign: 'center',
    marginTop: hp(0.4),
  },

  updatesCard: {
    backgroundColor: '#1A1F2E',
    borderRadius: rs(10),
    paddingHorizontal: wp(3),
    borderWidth: 1,
    borderColor: '#2A3441',
  },

  updateItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: hp(1.5),
  },

  updateDivider: {
    borderTopWidth: 1,
    borderTopColor: '#2A3441',
  },

  updateIcon: {
    width: rs(34),
    height: rs(34),
    borderRadius: rs(17),
    backgroundColor: '#FFD70018',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },

  updateTextContainer: {
    flex: 1,
  },

  updateTitle: {
    color: '#FFFFFF',
    fontSize: rf(13),
    fontWeight: 'bold',
    marginBottom: hp(0.3),
  },

  updateDescription: {
    color: '#9CA3AF',
    fontSize: rf(11),
    lineHeight: rf(16),
  },

  infoSection: {
    backgroundColor: '#1A1F2E',
    marginHorizontal: wp(4),
    marginTop: hp(0.5),
    marginBottom: hp(2),
    padding: wp(5),
    borderRadius: rs(10),
    borderWidth: 1,
    borderColor: '#2A3441',
  },

  infoTitle: {
    fontSize: rf(17),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp(1.5),
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp(1),
  },

  infoBullet: {
    fontSize: rf(16),
    color: '#FFD700',
    fontWeight: 'bold',
    marginRight: wp(2),
  },

  infoText: {
    flex: 1,
    fontSize: rf(13),
    color: '#D1D5DB',
    lineHeight: rf(19),
  },

  socialSection: {
    backgroundColor: '#1A1F2E',
    marginHorizontal: wp(4),
    padding: wp(4),
    borderRadius: rs(10),
    borderWidth: 1,
    borderColor: '#2A3441',
  },

  socialTitle: {
    fontSize: rf(17),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp(0.5),
    textAlign: 'center',
  },

  socialSubtitle: {
    fontSize: rf(11),
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: hp(2),
  },

  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  socialIconButton: {
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },

  socialIconWrapper: {
    width: rs(48),
    height: rs(48),
    borderRadius: rs(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(0.6),
  },

  socialIconLabel: {
    fontSize: rf(9),
    color: '#D1D5DB',
    fontWeight: '500',
    textAlign: 'center',
  },
});
