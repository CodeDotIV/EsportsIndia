import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Alert, SafeAreaView, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { wp, hp, rf, rs, isTablet } from '../../utils/responsive';

const games = [
  { id: '1', name: 'Battle Grounds Mobile India', image: require('../../assets/images/bgmilogo.png'), screen: 'Esportsarena' },
  { id: '2', name: 'Call of Duty', image: require('../../assets/images/callofduty.png'), screen: 'Callofduty' },
  { id: '3', name: 'FreeFire', image: require('../../assets/images/freefirelogo.png'), screen: 'Freefire' },
  { id: '4', name: 'Valorant', image: require('../../assets/images/valorant.png'), screen: 'valorant' },
];

export default function EsportsScreen() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const tablet = isTablet();

  const handlePress = (screen, name) => {
    if (screen === 'Freefire' || screen === 'Callofduty' || screen === 'valorant') {
      Alert.alert('Coming Soon', `${name} will be available soon!`);
      return;
    }
    navigation.navigate(screen);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.gameContainer} onPress={() => handlePress(item.screen, item.name)}>
      <Image source={item.image} style={styles.gameImage} />
      <Text style={styles.gameName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Esports</Text>
      </View>
      <View style={styles.headerLine} />

      {/* Game Grid */}
      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}               // Keep static to avoid errors
        key="two-column"             // Forces FlatList to render properly
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={{ justifyContent: 'space-around', marginBottom: 20 }}
      />
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
    backgroundColor: 'transparent',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
  },
  backButton: {
    marginRight: wp(2.5),
  },
  title: {
    fontSize: rf(18),
    fontWeight: 'bold',
    color: 'white',
  },
  listContent: {
    paddingVertical: hp(2.5),
    paddingHorizontal: wp(2.5),
  },
  gameContainer: {
    alignItems: 'center',
    width: wp(45),
    marginVertical: hp(2.2),
  },
  gameImage: {
    height: hp(15),
    width: '100%',
    borderRadius: rs(18),
    resizeMode: 'cover',
  },
  gameName: {
    fontSize: rf(14),
    fontWeight: 'bold',
    marginTop: hp(3),
    color: '#FFF',
    textAlign: 'center',
    paddingHorizontal: wp(2),
  },
  headerLine: {
    height: 1,
    width: wp(100),
    backgroundColor: '#FFD700',
    marginVertical: hp(0.6),
  },
});
