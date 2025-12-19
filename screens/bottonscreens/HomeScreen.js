import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { wp, hp, rf, rs, isTablet } from '../../utils/responsive';

const imageSources = [
  { source: require('../../assets/images/bgmilogo.png'), game: 'bgmi' },
  { source: require('../../assets/images/freefirelogo.png'), game: 'freefirelogo' },
  { source: require('../../assets/images/callofduty.png'), game: 'callofduty' },
  { source: require('../../assets/images/valorant.png'), game: 'valorant' },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning! Welcome to EsportsIndia 👋";
  if (hour >= 12 && hour < 17) return "Good Afternoon! Welcome to EsportsIndia 👋";
  if (hour >= 17 && hour < 24) return "Good Evening! Welcome to EsportsIndia 👋";
  return "Good Night! 🌃 Welcome to EsportsIndia 👋";
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGreeting, setShowGreeting] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const tablet = isTablet();

  useEffect(() => {
    // Greeting fade out after 5 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }).start(() => setShowGreeting(false));
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const gameData = [
    {
      title: "Battle Grounds Mobile India",
      summary: "Experience intense battle action with realistic mechanics and immersive environments.",
      gameFeatures: ["Esports", "Tournaments"],
      gamingModes: ["Solo", "Duo", "Squad"],
    },
    {
      title: "Free Fire",
      summary: "Fast-paced survival shooter with quick matches and diverse maps.",
      gameFeatures: ["Esports", "Tournaments"],
      gamingModes: ["Solo", "Duo", "Squad"],
    },
    {
      title: "Call of Duty",
      summary: "Iconic FPS gameplay with multiple modes and realistic action.",
      gameFeatures: ["Esports", "Tournaments"],
      gamingModes: ["Solo", "Duo", "Squad"],
    },
    {
      title: "Valorant",
      summary: "Tactical 5v5 shooter blending precision gunplay with unique agent abilities.",
      gameFeatures: ["Esports", "Tournaments"],
      gamingModes: ["Solo", "Duo", "Squad"],
    }
  ];

  const handleScroll = (event) => {
    const bannerWidth = tablet ? wp(85) + wp(10) : wp(90) + wp(10); // width + margin
    const index = Math.round(event.nativeEvent.contentOffset.x / bannerWidth);
    setCurrentIndex(index);
  };

  const handleImageClick = (game) => {
    switch (game) {
      case 'bgmi':
        navigation.navigate('Aboutbgmi');
        break;
      case 'callofduty':
        navigation.navigate('Aboutcallofduty');
        break;
      default:
        break;
    }
  };

  return (
    <LinearGradient colors={['#141E30', '#243B55']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
            <Text style={styles.headerText}>EsportsIndia</Text>
          </View>
        </View>

        {/* Full width line below header */}
        <View style={styles.headerLine} />

        {/* Greeting */}
        {showGreeting && (
          <Animated.View style={{ opacity: fadeAnim, marginVertical: 10, alignItems: 'center' }}>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
          </Animated.View>
        )}

        <ScrollView
          style={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Thumbnails */}
          <View style={styles.aboutContainer}>
            {imageSources.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleImageClick(item.game)}
                style={styles.aboutSection}
              >
                <Animated.Image
                  source={item.source}
                  style={styles.image}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Game Banners */}
          <FlatList
            data={gameData}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Animated.View style={[styles.banner, { width: tablet ? wp(85) : wp(90) }]}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.summary}</Text>

                <View style={styles.rowContainer}>
                  {/* Game Features */}
                  <View style={styles.column}>
                    <Text style={styles.sectionTitle}>Game Features</Text>
                    {item.gameFeatures.map((feature, i) => (
                      <View key={i} style={styles.dotRow}>
                        <View style={styles.dotPoint} />
                        <Text style={styles.dotText}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Gaming Modes */}
                  <View style={styles.column}>
                    <Text style={styles.sectionTitle}>Gaming Modes</Text>
                    <View style={styles.modesWrapper}>
                      {item.gamingModes.map((mode, i) => (
                        <View
                          key={i}
                          style={[
                            styles.modeDotRow,
                            mode === 'Squad' ? { flexBasis: '100%' } : { flexBasis: '48%' },
                          ]}
                        >
                          <View style={styles.dotPoint} />
                          <Text style={styles.dotText}>{mode}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </Animated.View>
            )}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false, listener: handleScroll }
            )}
          />

          {/* Pagination */}
          <View style={styles.pagination}>
            {gameData.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, currentIndex === index && styles.activeDot]}
              />
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(5),
  },
  headerLine: {
    height: 1,
    width: wp(100),
    backgroundColor: '#FFD700',
    marginVertical: hp(0.6),
  },
  greetingText: {
    fontSize: rf(14),
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    paddingHorizontal: wp(4),
  },
  banner: {
    backgroundColor: '#1F2A38',
    borderRadius: rs(10),
    marginHorizontal: wp(5),
    padding: rs(15),
    marginBottom: hp(2),
  },
  title: {
    fontSize: rf(18),
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: hp(1),
  },
  description: {
    fontSize: rf(14),
    color: '#DDD',
    marginBottom: hp(2),
    lineHeight: rf(20),
  },
  sectionTitle: {
    fontSize: rf(16),
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: hp(1),
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp(1.2),
    marginBottom: hp(2.5),
  },
  dot: {
    width: rs(8),
    height: rs(8),
    borderRadius: rs(4),
    backgroundColor: '#ccc',
    marginHorizontal: wp(1),
  },
  activeDot: {
    backgroundColor: '#FFD700',
    width: rs(10),
    height: rs(10),
  },
  scrollViewContent: {
    marginTop: hp(1.2),
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: hp(2.5),
  },
  logo: {
    width: rs(50),
    height: rs(50),
    borderRadius: rs(25),
    marginRight: wp(2.5),
  },
  headerText: {
    fontSize: rf(24),
    fontWeight: 'bold',
    color: '#FFF',
  },
  aboutContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: wp(2.5),
    marginVertical: hp(1.5),
  },
  aboutSection: {
    width: wp(48),
    height: hp(18),
    borderRadius: rs(12),
    overflow: 'hidden',
    marginBottom: hp(1.2),
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: rs(8),
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: hp(1.2),
  },
  column: {
    width: wp(48),
    marginBottom: hp(1.2),
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.7),
  },
  dotPoint: {
    width: rs(6),
    height: rs(6),
    borderRadius: rs(3),
    backgroundColor: '#FFD700',
    marginRight: wp(2),
  },
  dotText: {
    fontSize: rf(14),
    color: '#FFF',
    flex: 1,
  },
  modesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: hp(0.6),
  },
  modeDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.7),
    width: wp(48),
  },
});
