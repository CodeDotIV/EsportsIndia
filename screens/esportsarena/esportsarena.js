import React, { useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const livik = require('../../assets/images/livik.png');

const GameScreen = () => {
  const navigation = useNavigation();

  const arenaData = [
    { name: 'Inventory', screen: 'Inventory', image: livik },
    { name: 'Ruins', screen: 'Ruins', image: livik },
    { name: 'Town - Domination', screen: 'Town', image: livik },
    { name: 'Library', screen: 'Library', image: livik },
    { name: 'Hanger - TDM', screen: 'Hangertdm', image: livik },
    { name: 'Hanger - TGM', screen: 'Hangertgm', image: livik },
    { name: 'Hanger - Arena training', screen: 'Hangerarenatraining', image: livik },
    { name: 'Livik - Ultimate Arena', screen: 'Livikultimatearena', image: livik },
    { name: 'Erangel - Ultimate Arena', screen: 'Erangelultimatearena', image: livik },
  ];

  const handlePress = useCallback((screen, mode) => {
    navigation.navigate(screen, { mode });
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.card} onPress={() => handlePress(item.screen, item.name)}>
        <Image source={item.image} style={styles.cardImage} />
      </TouchableOpacity>
      <Text style={styles.cardText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Battle Grounds Mobile India</Text>
      </View>
      <Text style={styles.sectionTitle}>Arena</Text>
      <FlatList
        data={arenaData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5a623',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: { position: 'absolute', left: 15, top: 55, zIndex: 10 },
  headerText: {
    flex: 1, fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#000',
  },
  sectionTitle: {
    fontSize: 24, fontWeight: 'bold', marginTop: 40, marginLeft: 26, color: '#333',
  },
  grid: { gap: 10, paddingTop: 10, paddingHorizontal: 10, paddingBottom: 20 },
  cardContainer: { flex: 1, alignItems: 'center', margin: 25, flexWrap: 'wrap' },
  card: {
    width: 150, height: 100, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden',
  },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardText: {
    fontSize: 14, fontWeight: 'bold', marginTop: 12, textAlign: 'center',
  },
});

export default GameScreen;
