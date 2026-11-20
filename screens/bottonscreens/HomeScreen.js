
import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { wp, hp, rf, rs } from '../../utils/responsive';

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

export default function HomeScreen() {
  const navigation = useNavigation();
  const [greeting] = useState(getGreeting());

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

      </View>

      <View style={styles.divider} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Featured Games */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Games</Text>

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

  section: {
    marginBottom: hp(2.5),
    paddingHorizontal: wp(4),
  },

  sectionTitle: {
    fontSize: rf(19),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp(1.5),
    paddingLeft: wp(1),
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
