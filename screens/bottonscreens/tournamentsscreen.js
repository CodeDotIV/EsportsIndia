import React, { useRef, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, Animated, ImageBackground, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const CARD_WIDTH = (screenWidth - 48) / 2; // 16px padding * 2 + 8px spacing
const CARD_HEIGHT = 100;

const games = [
  {
    id: '1',
    name: 'Battle grounds mobile india',
    sections: [
      { id: '1.1', name: 'Pro', image: require('../../assets/images/bgmilogo.png') },
      { id: '1.2', name: 'TDM', image: require('../../assets/images/bgmilogo.png') },
      { id: '1.3', name: 'Mini Classic', image: require('../../assets/images/bgmilogo.png') },
      { id: '1.4', name: 'Classic', image: require('../../assets/images/bgmilogo.png') },
    ]
  },
  {
    id: '2',
    name: 'FreeFire',
    sections: [
      { id: '2.1', name: 'Pro', image: require('../../assets/images/freefirelogo.png') },
      { id: '2.2', name: 'TDM', image: require('../../assets/images/freefirelogo.png') },
      { id: '2.3', name: 'Mini Classic', image: require('../../assets/images/freefirelogo.png') },
      { id: '2.4', name: 'Classic', image: require('../../assets/images/freefirelogo.png') },
    ]
  },
  {
    id: '3',
    name: 'Call of Duty',
    sections: [
      { id: '3.1', name: 'Pro', image: require('../../assets/images/callofduty.png') },
      { id: '3.2', name: 'TDM', image: require('../../assets/images/callofduty.png') },
      { id: '3.3', name: 'Mini Classic', image: require('../../assets/images/callofduty.png') },
      { id: '3.4', name: 'Classic', image: require('../../assets/images/callofduty.png') },
    ]
  },
];

export default function TournamentsScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderGame = ({ item: game }) => (
    <View key={game.id} style={styles.gameSection}>
      <Text style={styles.gameTitle}>{game.name}</Text>

      <FlatList
        data={game.sections}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('RegisterTournament', {
              gameName: game.name,
              section: item.name,
            })}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.cardWrapper,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              {game.name === 'FreeFire' || game.name === 'Call of Duty' ? (
                <ImageBackground
                  source={item.image}
                  style={styles.gameCard}
                  imageStyle={styles.imageStyle}
                />
              ) : (
                <View style={styles.gameCard}>
                  <Image source={item.image} style={styles.gameImage} />
                </View>
              )}
              <Text style={styles.gameName}>{item.name}</Text>
            </Animated.View>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="chevron-back" size={24} color="black" />
        <Text style={styles.title}>Tournaments</Text>
      </View>

      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={renderGame}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={<Text style={styles.title1}>Events</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5a623',
    padding: 20,
    zIndex: 1,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', paddingTop: 23 },
  listContainer: {
    paddingTop: 100,
    paddingBottom: 20,
  },
  title1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    paddingTop: 30,
    marginLeft: 24,
    marginBottom: 16,
  },
  gameSection: {
    marginBottom: 40,
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 24,
    marginBottom: 16,
    color: '#000',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    alignItems: 'center',
  },
  gameCard: {
    width: '90%',
    height: CARD_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  imageStyle: {
    borderRadius: 8,
    opacity: 0.5,
  },
  gameImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gameName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
});
