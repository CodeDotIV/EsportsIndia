import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Animated, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const imageSources = [
  { source: require('../../assets/images/bgmilogo.png'), game: 'bgmi' },
  { source: require('../../assets/images/freefirelogo.png'), game: 'freefirelogo' },
  { source: require('../../assets/images/callofduty.png'), game: 'callofduty' },
  { source: require('../../assets/images/valorant.png'), game: 'callofduty' },
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
  const fadeAnim = useRef(new Animated.Value(1)).current; // opacity value

  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000, // fade out duration
        useNativeDriver: true,
      }).start(() => setShowGreeting(false));
    }, 3000); // wait 3 sec before fading

    return () => clearTimeout(timer);
  }, []);

  const gameData = [
    {
      title: "Battle Grounds Mobile India",
      description: "Experience intense battle action, realistic gameplay mechanics, and an immersive environment.",
      gameFeatures: "Realistic gameplay, immersive environments.",
      multiplayerMode: "Team up with friends and compete.",
    },
    {
      title: "Freefire",
      description: "Realistic first-person shooter action.",
      gameFeatures: "Various weapons, maps, and modes.",
      multiplayerMode: "Competitive and co-op play.",
    },
    {
      title: "CallofDuty",
      description: "Realistic first-person shooter action.",
      gameFeatures: "Various weapons, maps, and modes.",
      multiplayerMode: "Competitive and co-op play.",
    },
    {
      title: "Valorant",
      description: "Realistic first-person shooter action.",
      gameFeatures: "Various weapons, maps, and modes.",
      multiplayerMode: "Competitive and co-op play.",
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
          <Text style={styles.headerText}>EsportsIndia</Text>
        </View>
      </View>

      {/* Greeting with fade animation */}
      {showGreeting && (
        <Animated.View style={[styles.greetingContainer, { opacity: fadeAnim }]}>
          <Text style={styles.greetingText}>{getGreeting()}</Text>
        </Animated.View>
      )}

      {/* Content */}
      <ScrollView style={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        {/* Game Thumbnails */}
        <View style={styles.aboutContainer}>
          {imageSources.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleImageClick(item.game)}
              style={styles.aboutSection}
            >
              <Image source={item.source} style={styles.image} />
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
            <View style={styles.banner}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <View style={styles.gameFeatureContainer}>
                <Text style={styles.sectionTitle}>Game Features</Text>
                <Text style={styles.sectionContent}>{item.gameFeatures}</Text>
              </View>
              <View style={styles.gameFeatureContainer}>
                <Text style={styles.sectionTitle}>Multiplayer Mode</Text>
                <Text style={styles.sectionContent}>{item.multiplayerMode}</Text>
              </View>
            </View>
          )}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false, listener: handleScroll }
          )}
        />

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {gameData.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>

        <View style={styles.banner1}></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5a623',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 30,
    zIndex: 1000,
  },
  greetingContainer: {
    marginTop: 0,
    marginLeft: 20,
    width: 600,
    maxWidth: 650,
    marginBottom: -210,
  },
  greetingText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'blue',
    margin: 90,
    marginTop: 110,
  },
  banner1: {
    width: width * 0.9,
    backgroundColor: '#f5a623',
    borderRadius: 10,
    marginHorizontal: width * 0.05,
    paddingHorizontal: 20,
    paddingVertical: 120,
    marginTop: 20,
  },
  banner: {
    width: width * 0.9,
    backgroundColor: '#f5a623',
    borderRadius: 10,
    marginHorizontal: width * 0.05,
    paddingHorizontal: 20,
    paddingVertical: 55,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  sectionContent: {
    fontSize: 14,
    color: '#555',
  },
  gameFeatureContainer: {
    marginBottom: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#f5a623',
    width: 10,
    height: 10,
  },
  scrollViewContent: {
    marginTop: 140,
    backgroundColor: '#fff',
  },
  logoContainer: {
    flexDirection: 'row',
    marginTop: 50,
    marginRight: 120,
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 40,
    marginRight: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  aboutContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
    marginBottom: 20,
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  aboutSection: {
    height: 150,
    width: '48%',
    paddingTop: 40,
    borderRadius: 18,
    padding: 10,
    marginVertical: -10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
});
