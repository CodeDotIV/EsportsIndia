import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGreeting, setShowGreeting] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scrollX = useRef(new Animated.Value(0)).current;

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
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
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
              <Animated.View style={styles.banner}>
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
    justifyContent: 'left',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerLine: {
    height: 0.2,
    width: '100%',
    backgroundColor: '#FFD700',
    marginVertical: 5,
  },
  greetingText: { fontSize: 14, fontWeight: 'bold', color: '#FFD700', textAlign: 'center' },
  banner: {
    width: width * 0.9,
    backgroundColor: '#1F2A38',
    borderRadius: 10,
    marginHorizontal: width * 0.05,
    padding: 15,
    marginBottom: 15,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 8 },
  description: { fontSize: 14, color: '#DDD', marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 8 },
  pagination: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ccc', margin: 4 },
  activeDot: { backgroundColor: '#FFD700', width: 10, height: 10 },
  scrollViewContent: { marginTop: 10 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', paddingTop: 20 },
  logo: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  aboutContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 12,
  },
  aboutSection: {
    flexBasis: '48%',
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
  },
  image: { width: '100%', height: '70%', resizeMode: 'cover', borderRadius:8,},
  rowContainer: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: 10 },
  column: { flexBasis: '48%', marginBottom: 10 },
  dotRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  dotPoint: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFD700', marginRight: 8 },
  dotText: { fontSize: 14, color: '#FFF' },
  modesWrapper: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 },
  modeDotRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
});
