import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import { wp, hp, rf, rs } from '../../utils/responsive';

const classicStream = {
  id: 1,
  title: "Tournament's Live",
  game: 'Esports India',
  thumbnail: require('../../assets/images/bgmilogo.png'),
  streamUrl: 'https://youtube.com/live/V3gOwW93VoA?feature=share',
  platform: 'youtube',
};

export default function LiveScreen() {
  const [activeSection, setActiveSection] = useState('classic');

  const getYouTubeEmbedUrl = (url) => {
    let videoId = null;
    if (url.includes('youtube.com/live/')) {
      videoId = url.split('youtube.com/live/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`;
    }
    return null;
  };

  const openExternalLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', `Cannot open this URL: ${url}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open link');
    }
  };

  const handlePlayInApp = async (stream) => {
    const embedUrl = getYouTubeEmbedUrl(stream.streamUrl);
    if (embedUrl) {
      try {
        await WebBrowser.openBrowserAsync(embedUrl, {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
          enableBarCollapsing: false,
          showTitle: false,
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to open video player');
      }
    } else {
      openExternalLink(stream.streamUrl);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.backButton}>
          <Ionicons name="radio" size={24} color="white" />
        </View>
        <Text style={styles.headerText}>Live & Streams</Text>
      </View>
      <View style={styles.headerLine} />

      {/* Section Switch Bar */}
      <View style={styles.switchBar}>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[
              styles.switchOption,
              activeSection === 'classic' && styles.switchOptionActive
            ]}
            onPress={() => setActiveSection('classic')}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.switchText,
              activeSection === 'classic' && styles.switchTextActive
            ]}>
              Classic
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.switchOption,
              activeSection === 'tdm' && styles.switchOptionActive
            ]}
            onPress={() => setActiveSection('tdm')}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.switchText,
              activeSection === 'tdm' && styles.switchTextActive
            ]}>
              TDM's
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content based on active section */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeSection === 'classic' ? (
          <View style={styles.classicContent}>
            {/* Tournament Header */}
            <View style={styles.tournamentHeader}>
              <Ionicons name="trophy" size={rs(24)} color="#FFD700" />
              <Text style={styles.tournamentHeaderText}>Live Tournament</Text>
            </View>

            {/* Classic Stream Card */}
            <TouchableOpacity
              style={styles.streamCard}
              activeOpacity={0.8}
              onPress={() => openExternalLink(classicStream.streamUrl)}
            >
              <View style={styles.streamThumbnailContainer}>
                <Image 
                  source={classicStream.thumbnail} 
                  style={styles.streamThumbnail}
                  resizeMode="cover"
                />
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
                <View style={styles.playIconOverlay}>
                  <View style={styles.playIconCircle}>
                    <Ionicons name="play" size={rs(32)} color="#FFFFFF" />
                  </View>
                </View>
              </View>
              <View style={styles.streamInfo}>
                <View style={styles.titleRow}>
                  <Text style={styles.streamTitle}>{classicStream.title}</Text>
                  <View style={styles.gameTag}>
                    <Ionicons name="logo-youtube" size={rs(14)} color="#FF0000" />
                    <Text style={styles.gameTagText}>{classicStream.game}</Text>
                  </View>
                </View>
                <View style={styles.streamDescription}>
                  <Ionicons name="calendar-outline" size={rs(14)} color="#9CA3AF" />
                  <Text style={styles.descriptionText}>Watch live tournament matches</Text>
                </View>
                <TouchableOpacity
                  style={styles.watchButton}
                  onPress={() => openExternalLink(classicStream.streamUrl)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="play-circle" size={rs(20)} color="#000000" />
                  <Text style={styles.watchButtonText}>Watch Now</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* Tournament Info Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="information-circle" size={rs(20)} color="#FFD700" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoTitle}>Tournament Information</Text>
                  <Text style={styles.infoText}>
                    Join us for exciting live tournament matches. Watch top players compete in real-time.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.sectionContent}>
            <Ionicons name="people-outline" size={rs(64)} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>TDM Mode</Text>
            <Text style={styles.emptySubtitle}>
              Team Deathmatch streams will appear here
            </Text>
          </View>
        )}
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
    backgroundColor: '',
    padding: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    color: 'white',
    marginRight: 10,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    paddingTop: 38,
    marginLeft: wp(2),
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    paddingTop: 38,
  },
  headerLine: {
    height: 1,
    width: '100%',
    backgroundColor: '#FFD700',
    marginVertical: 5,
  },
  switchBar: {
    backgroundColor: '#141E30',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#2A3441',
  },
  switchContainer: {
    flexDirection: 'row',
    backgroundColor: '#2A3441',
    borderRadius: rs(10),
    padding: wp(0.5),
    position: 'relative',
  },
  switchOption: {
    flex: 1,
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4),
    borderRadius: rs(8),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  switchOptionActive: {
    backgroundColor: '#FFD700',
  },
  switchText: {
    fontSize: rf(15),
    fontWeight: '600',
    color: '#9CA3AF',
  },
  switchTextActive: {
    color: '#000000',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: hp(4),
  },
  classicContent: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  tournamentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
    paddingBottom: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#2A3441',
  },
  tournamentHeaderText: {
    fontSize: rf(20),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: wp(2),
  },
  streamCard: {
    backgroundColor: '#1A1F2E',
    borderRadius: rs(12),
    marginBottom: hp(2),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A3441',
    elevation: 3,
    //shadowColor: '#000',
    //shadowOffset: { width: 0, height: 2 },
    //shadowOpacity: 0.25,
    //shadowRadius: 3,
  },
  streamThumbnailContainer: {
    width: '100%',
    height: hp(20),
    position: 'relative',
  },
  streamThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0F1419',
  },
  liveBadge: {
    position: 'absolute',
    top: wp(3),
    left: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: rs(4),
    zIndex: 2,
  },
  liveDot: {
    width: rs(6),
    height: rs(6),
    borderRadius: rs(3),
    backgroundColor: '#FFF',
    marginRight: wp(1),
  },
  liveText: {
    fontSize: rf(10),
    fontWeight: 'bold',
    color: '#FFF',
  },
  viewersBadge: {
    position: 'absolute',
    top: wp(3),
    right: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.4),
    borderRadius: rs(4),
    zIndex: 2,
  },
  viewersText: {
    fontSize: rf(10),
    color: '#FFF',
    marginLeft: wp(1),
    fontWeight: '600',
  },
  playIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  playIconCircle: {
    width: rs(70),
    height: rs(70),
    borderRadius: rs(35),
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  streamInfo: {
    padding: wp(4),
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  streamTitle: {
    fontSize: rf(20),
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: wp(2),
  },
  streamMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  streamerName: {
    fontSize: rf(12),
    color: '#9CA3AF',
    marginLeft: wp(1),
    marginRight: wp(2),
  },
  gameTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A3441',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: rs(6),
    borderWidth: 1,
    borderColor: '#3A4451',
  },
  gameTagText: {
    fontSize: rf(12),
    color: '#FFD700',
    fontWeight: '600',
    marginLeft: wp(1),
  },
  streamDescription: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
    backgroundColor: '#2A3441',
    borderRadius: rs(8),
  },
  descriptionText: {
    fontSize: rf(13),
    color: '#D1D5DB',
    marginLeft: wp(2),
    flex: 1,
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(8),
    borderRadius: rs(10),
    marginTop: hp(0.5),
  },
  watchButtonText: {
    fontSize: rf(16),
    color: '#000000',
    fontWeight: 'bold',
    marginLeft: wp(2),
  },
  infoCard: {
    backgroundColor: '#1A1F2E',
    borderRadius: rs(12),
    padding: wp(4),
    marginTop: hp(2),
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
    marginLeft: wp(2),
  },
  infoTitle: {
    fontSize: rf(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp(0.8),
  },
  infoText: {
    fontSize: rf(13),
    color: '#D1D5DB',
    lineHeight: rf(20),
  },
  streamActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp(1),
    paddingTop: hp(1),
    borderTopWidth: 1,
    borderTopColor: '#2A3441',
  },
  actionButtonFull: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A3441',
    paddingHorizontal: wp(12),
    paddingVertical: hp(0.8),
    borderRadius: rs(10),
    justifyContent: 'center',
  },
  actionButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A3441',
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.8),
    borderRadius: rs(8),
    flex: 1,
    marginHorizontal: wp(1),
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: rf(16),
    color: '#FFD700',
    marginLeft: wp(2),
    fontWeight: 'bold',
  },
  sectionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(10),
    paddingHorizontal: wp(5),
    minHeight: hp(60),
  },
  emptyTitle: {
    fontSize: rf(24),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: hp(3),
    marginBottom: hp(1),
  },
  emptySubtitle: {
    fontSize: rf(14),
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: rf(20),
  },
});
