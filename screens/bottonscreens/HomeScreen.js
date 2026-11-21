
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { wp, hp, rf, rs } from '../../utils/responsive';

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
    image: require('../../assets/images/bgmi.jpg'),
    navigation: 'Aboutbgmi',
    description: 'Experience intense battle action with realistic mechanics and immersive environments.',
  },
  {
    id: 2,
    title: 'Free Fire',
    image: require('../../assets/images/freefire.jpg'),
    navigation: 'Aboutfreefire',
    description: 'Fast-paced survival shooter with quick matches and diverse maps.',
  },
  {
    id: 3,
    title: 'Call of Duty',
    image: require('../../assets/images/callofduty.jpg'),
    navigation: 'Aboutcallofduty',
    description: 'Iconic FPS gameplay with multiple modes and realistic action.',
  },
  {
    id: 4,
    title: 'Valorant',
    image: require('../../assets/images/valorant.jpg'),
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

export default function HomeScreen() {
  const navigation = useNavigation();

  const navigateTo = (routeName) => {
    let currentNavigation = navigation;
    while (currentNavigation) {
      const routeExists = currentNavigation
        .getState()
        ?.routeNames?.includes(routeName);

      if (routeExists) {
        currentNavigation.navigate(routeName);
        return;
      }

      currentNavigation = currentNavigation.getParent();
    }

    Alert.alert(
      'Coming soon',
      `${routeName} screen is not connected yet. Add this screen to your navigator to enable this option.`
    );
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
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="game-controller" size={rs(25)} color="#FFD700" />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.headerTitle}>EsportsIndia</Text>
        </View>
      </View>
      <View style={styles.divider} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={['#263C59', '#1A2638', '#182131']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroEyebrow}>
            <Ionicons name="sparkles" size={rs(14)} color="#FFD700" />
            <Text style={styles.heroEyebrowText}>YOUR ESPORTS HUB</Text>
          </View>
          <Text style={styles.heroTitle}>Ready to compete?</Text>
          <Text style={styles.heroDescription}>
            Discover your favorite games and find your next arena.
          </Text>
          <View style={styles.heroActions}>
            <TouchableOpacity
              style={styles.primaryAction}
              onPress={() => navigateTo('Esports')}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              <Text style={styles.primaryActionText}>Explore games</Text>
              <Ionicons name="arrow-forward" size={rs(17)} color="#141E30" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryAction}
              onPress={() => navigateTo('Tournaments')}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              <Ionicons name="trophy-outline" size={rs(17)} color="#FFD700" />
              <Text style={styles.secondaryActionText}>Tournaments</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Featured games</Text>
              <Text style={styles.sectionSubtitle}>Pick your next battleground</Text>
            </View>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => navigateTo('Esports')}
              activeOpacity={0.75}
              accessibilityRole="button"
            >
              <Text style={styles.seeAllText}>See all</Text>
              <Ionicons name="chevron-forward" size={rs(15)} color="#FFD700" />
            </TouchableOpacity>
          </View>

          <View style={styles.gamesGrid}>
            {gameData.map((game) => (
              <TouchableOpacity
                key={game.id}
                style={styles.gameCard}
                onPress={() => handleGamePress(game)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`View ${game.title} details`}
              >
                <View style={styles.gameImageContainer}>
                  <Image
                    source={game.image}
                    style={styles.gameImage}
                    resizeMode="cover"
                  />
                </View>

                <View style={styles.gameCardContent}>
                  <Text style={styles.gameCardTitle} numberOfLines={1}>
                    {game.title}
                  </Text>
                  <Text style={styles.gameCardDescription} numberOfLines={2}>
                    {game.description}
                  </Text>
                  <View style={styles.gameCardFooter}>
                    <Text style={styles.viewMoreText}>View details</Text>
                    <Ionicons name="arrow-forward" size={rs(15)} color="#FFD700" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Latest updates</Text>
              <Text style={styles.sectionSubtitle}>The community at a glance</Text>
            </View>
          </View>

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

        <View style={styles.socialSection}>
          <View style={styles.socialHeading}>
            <View style={styles.socialTitleIcon}>
              <Ionicons name="people-outline" size={rs(19)} color="#FFD700" />
            </View>
            <View style={styles.socialHeadingText}>
              <Text style={styles.socialTitle}>Join the community</Text>
              <Text style={styles.socialSubtitle}>Follow EsportsIndia for the latest.</Text>
            </View>
          </View>

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
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.4),
  },
  logoContainer: {
    width: rs(46),
    height: rs(46),
    borderRadius: rs(15),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
    backgroundColor: '#202D42',
    borderWidth: 1,
    borderColor: '#34445C',
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: rf(13),
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: rf(20),
    fontWeight: 'bold',
    color: 'white',
  },
  divider: {
    height: 1,
    backgroundColor: '#2A3441',
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(4),
  },
  heroCard: {
    width: '100%',
    maxWidth: 760,
    borderRadius: rs(18),
    borderWidth: 1,
    borderColor: '#354761',
    padding: wp(5),
    marginBottom: hp(3),
    overflow: 'hidden',
  },
  heroEyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  heroEyebrowText: {
    color: '#FFD700',
    fontSize: rf(11),
    fontWeight: '700',
    letterSpacing: 1,
    marginLeft: wp(1.5),
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: rf(27),
    fontWeight: '800',
    marginBottom: hp(0.6),
  },
  heroDescription: {
    color: '#C4CEDB',
    fontSize: rf(14),
    lineHeight: rf(20),
    maxWidth: 420,
    marginBottom: hp(2),
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  primaryAction: {
    minHeight: rs(44),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    borderRadius: rs(10),
    paddingHorizontal: wp(4),
    marginRight: wp(2.5),
    marginBottom: hp(0.5),
  },
  primaryActionText: {
    color: '#141E30',
    fontSize: rf(13),
    fontWeight: '700',
    marginRight: wp(2),
  },
  secondaryAction: {
    minHeight: rs(44),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: rs(10),
    borderWidth: 1,
    borderColor: '#64748B',
    paddingHorizontal: wp(3.5),
    marginBottom: hp(0.5),
  },
  secondaryActionText: {
    color: '#FFFFFF',
    fontSize: rf(12),
    fontWeight: '600',
    marginLeft: wp(1.5),
  },
  section: {
    width: '100%',
    maxWidth: 760,
    marginBottom: hp(2.7),
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
    marginBottom: hp(0.3),
  },
  sectionSubtitle: {
    fontSize: rf(12),
    color: '#9CA3AF',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(0.8),
    paddingLeft: wp(2),
  },
  seeAllText: {
    color: '#FFD700',
    fontSize: rf(12),
    fontWeight: '600',
    marginRight: wp(0.5),
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gameCard: {
    width: '48.5%',
    maxWidth: 360,
    backgroundColor: '#1A1F2E',
    borderRadius: rs(14),
    marginBottom: hp(1.7),
    overflow: 'hidden',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  gameImageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#0F1419',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2A3441',
  },
  gameImage: {
    width: '100%',
    height: '100%',
  },
  gameCardContent: {
    padding: wp(2.8),
    minHeight: rs(116),
  },
  gameCardTitle: {
    fontSize: rf(15),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp(0.5),
  },
  gameCardDescription: {
    fontSize: rf(12),
    color: '#9CA3AF',
    lineHeight: rf(16),
    minHeight: rf(32),
  },
  gameCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#2A3441',
    paddingTop: hp(0.8),
    marginTop: hp(0.8),
  },
  viewMoreText: {
    fontSize: rf(12),
    color: '#FFD700',
    fontWeight: '600',
  },
  updatesCard: {
    backgroundColor: '#1A1F2E',
    borderRadius: rs(14),
    paddingHorizontal: wp(3.5),
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  updateItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: hp(1.7),
  },
  updateDivider: {
    borderTopWidth: 1,
    borderTopColor: '#2A3441',
  },
  updateIcon: {
    width: rs(38),
    height: rs(38),
    borderRadius: rs(12),
    backgroundColor: '#FFD70018',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  updateTextContainer: {
    flex: 1,
    paddingTop: hp(0.2),
  },
  updateTitle: {
    color: '#FFFFFF',
    fontSize: rf(14),
    fontWeight: 'bold',
    marginBottom: hp(0.3),
  },
  updateDescription: {
    color: '#9CA3AF',
    fontSize: rf(12),
    lineHeight: rf(16),
  },
  socialSection: {
    width: '100%',
    maxWidth: 760,
    backgroundColor: '#1A1F2E',
    padding: wp(4),
    borderRadius: rs(14),
    borderWidth: 1,
    borderColor: '#2A3441',
    marginBottom: hp(1),
  },
  socialHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.7),
  },
  socialTitleIcon: {
    width: rs(42),
    height: rs(42),
    borderRadius: rs(13),
    backgroundColor: '#FFD70018',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  socialHeadingText: {
    flex: 1,
  },
  socialTitle: {
    fontSize: rf(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp(0.3),
  },
  socialSubtitle: {
    fontSize: rf(12),
    color: '#9CA3AF',
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: hp(1.5),
    borderTopWidth: 1,
    borderTopColor: '#2A3441',
  },
  socialIconButton: {
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  socialIconWrapper: {
    width: rs(42),
    height: rs(42),
    borderRadius: rs(14),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(0.7),
  },
  socialIconLabel: {
    fontSize: rf(11),
    color: '#D1D5DB',
    fontWeight: '500',
    textAlign: 'center',
  },
});
