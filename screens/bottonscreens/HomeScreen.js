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
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 24) return "Good Evening";
  return "Good Night";
};

const gameData = [
  {
    id: 1,
    title: "BGMI",
    fullTitle: "Battle Grounds Mobile India",
    image: require('../../assets/images/bgmilogo.png'),
    navigation: 'Aboutbgmi',
    description: "Experience intense battle action with realistic mechanics and immersive environments.",
  },
  {
    id: 2,
    title: "Free Fire",
    fullTitle: "Free Fire",
    image: require('../../assets/images/freefirelogo.png'),
    navigation: 'Aboutfreefire',
    description: "Fast-paced survival shooter with quick matches and diverse maps.",
  },
  {
    id: 3,
    title: "Call of Duty",
    fullTitle: "Call of Duty",
    image: require('../../assets/images/callofduty.png'),
    navigation: 'Aboutcallofduty',
    description: "Iconic FPS gameplay with multiple modes and realistic action.",
  },
  {
    id: 4,
    title: "Valorant",
    fullTitle: "Valorant",
    image: require('../../assets/images/valorant.png'),
    navigation: null,
    description: "Tactical 5v5 shooter blending precision gunplay with unique agent abilities.",
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [greeting] = useState(getGreeting());

  const handleGamePress = (game) => {
    if (game.navigation) {
      navigation.navigate(game.navigation);
    }
  };

  const handleSocialMediaPress = (platform, url) => {
    if (url) {
      const formattedUrl = url.startsWith('http') ? url : `https://${platform}.com/${url.replace('@', '')}`;
      Linking.openURL(formattedUrl).catch(() => {
        Alert.alert('Error', `Could not open ${platform}`);
      });
    }
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
      {/* Classic Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.logo} 
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>{greeting}!</Text>
            <Text style={styles.headerTitle}>EsportsIndia</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.7}
          >
            <Ionicons name="person" size={rs(28)} color="#FFD700" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Classic Divider */}
      <View style={styles.divider} />

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to EsportsIndia</Text>
          <Text style={styles.welcomeSubtitle}>
            Your ultimate destination for esports tournaments and gaming excellence
          </Text>
        </View>

        {/* Featured Games Section */}
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
                  <Text style={styles.gameCardTitle}>{game.title}</Text>
                  <Text style={styles.gameCardDescription} numberOfLines={2}>
                    {game.description}
                  </Text>
                  <View style={styles.gameCardFooter}>
                    <Text style={styles.viewMoreText}>View Details →</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('Esports')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>🎮</Text>
              <Text style={styles.actionTitle}>Esports</Text>
              <Text style={styles.actionSubtitle}>Browse Games</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('Tournaments')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>🏆</Text>
              <Text style={styles.actionTitle}>Tournaments</Text>
              <Text style={styles.actionSubtitle}>Join Now</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('Winners')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionIcon}>🥇</Text>
              <Text style={styles.actionTitle}>Winners</Text>
              <Text style={styles.actionSubtitle}>Leaderboard</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Why Choose EsportsIndia?</Text>
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>Premium esports tournaments</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>Multiple gaming modes (Solo, Duo, Squad)</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>Real-time leaderboards and rankings</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>Secure and fair gameplay</Text>
            </View>
          </View>
        </View>

        {/* Social Media Section */}
        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>Follow Us</Text>
          <Text style={styles.socialSubtitle}>Stay connected with EsportsIndia on social media</Text>
          
          <View style={styles.socialIconsContainer}>
            {socialMediaLinks.map((social) => (
              <TouchableOpacity
                key={social.id}
                style={styles.socialIconButton}
                onPress={() => handleSocialMediaPress(social.name.toLowerCase(), social.url)}
                activeOpacity={0.7}
              >
                <View style={[styles.socialIconWrapper, { backgroundColor: `${social.color}15` }]}>
                  <Ionicons 
                    name={social.icon} 
                    size={rs(28)} 
                    color={social.color}
                  />
                </View>
                <Text style={styles.socialIconLabel}>{social.name}</Text>
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
    backgroundColor: '#0F1419',
  },
  header: {
    backgroundColor: '#1A1F2E',
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    borderBottomWidth: 2,
    borderBottomColor: '#2A3441',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: rs(50),
    height: rs(50),
    borderRadius: rs(25),
    marginRight: wp(3),
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  headerTextContainer: {
    flex: 1,
    marginRight: wp(2),
  },
  profileButton: {
    width: rs(44),
    height: rs(44),
    borderRadius: rs(22),
    backgroundColor: '#2A3441',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  greeting: {
    fontSize: rf(12),
    color: '#9CA3AF',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: rf(22),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: hp(0.3),
  },
  divider: {
    height: 3,
    backgroundColor: '#FFD700',
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: hp(4),
  },
  scrollContent: {
    paddingBottom: hp(4),
  },
  welcomeSection: {
    backgroundColor: '#1A1F2E',
    paddingVertical: hp(3),
    paddingHorizontal: wp(5),
    marginBottom: hp(2),
    marginTop: hp(2),
    marginHorizontal: wp(4),
    borderRadius: rs(12),
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  welcomeTitle: {
    fontSize: rf(24),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp(1),
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: rf(14),
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: rf(20),
  },
  section: {
    marginBottom: hp(2.5),
    paddingHorizontal: wp(4),
  },
  sectionTitle: {
    fontSize: rf(20),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp(2),
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
    marginBottom: hp(2),
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  gameImageContainer: {
    width: '100%',
    height: hp(15),
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
    fontSize: rf(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp(0.8),
  },
  gameCardDescription: {
    fontSize: rf(12),
    color: '#9CA3AF',
    lineHeight: rf(16),
    marginBottom: hp(1),
  },
  gameCardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#2A3441',
    paddingTop: hp(1),
  },
  viewMoreText: {
    fontSize: rf(12),
    color: '#FFD700',
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1),
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#1A1F2E',
    borderRadius: rs(10),
    padding: wp(3),
    marginHorizontal: wp(1),
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  actionIcon: {
    fontSize: rf(32),
    marginBottom: hp(1),
  },
  actionTitle: {
    fontSize: rf(14),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp(0.5),
  },
  actionSubtitle: {
    fontSize: rf(11),
    color: '#9CA3AF',
  },
  infoSection: {
    backgroundColor: '#1A1F2E',
    marginHorizontal: wp(4),
    marginTop: hp(1),
    padding: wp(5),
    borderRadius: rs(10),
    borderWidth: 1,
    borderColor: '#2A3441',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  infoTitle: {
    fontSize: rf(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp(2),
  },
  infoList: {
    marginTop: hp(0.5),
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp(1.2),
  },
  infoBullet: {
    fontSize: rf(16),
    color: '#FFD700',
    fontWeight: 'bold',
    marginRight: wp(2),
    marginTop: hp(0.2),
  },
  infoText: {
    flex: 1,
    fontSize: rf(14),
    color: '#D1D5DB',
    lineHeight: rf(20),
  },
  socialSection: {
    backgroundColor: '#1A1F2E',
    marginHorizontal: wp(4),
    marginTop: hp(1),
    padding: wp(5),
    borderRadius: rs(10),
    borderWidth: 1,
    borderColor: '#2A3441',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  socialTitle: {
    fontSize: rf(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp(0.5),
    textAlign: 'center',
  },
  socialSubtitle: {
    fontSize: rf(12),
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: hp(2.5),
  },
  socialIconsContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(2),
  },
  socialIconButton: {
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  socialIconWrapper: {
    width: rs(60),
    height: rs(60),
    borderRadius: rs(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(0.8),
    borderWidth: 2,
    borderColor: 'transparent',
  },
  socialIconLabel: {
    fontSize: rf(11),
    color: '#D1D5DB',
    fontWeight: '500',
    textAlign: 'center',
  },
});
