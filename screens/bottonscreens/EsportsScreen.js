import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { wp, hp, rf, rs } from '../../utils/responsive';

const games = [
  { 
    id: '1', 
    name: 'BGMI', 
    shortName: 'BGMI',
    image: require('../../assets/images/bgmilogo.png'), 
    screen: 'Esportsarena',
    available: true,
  },
  { 
    id: '2', 
    name: 'Call of Duty', 
    shortName: 'COD',
    image: require('../../assets/images/callofduty.png'), 
    screen: 'Callofduty',
    available: false,
  },
  { 
    id: '3', 
    name: 'FreeFire', 
    shortName: 'FF',
    image: require('../../assets/images/freefirelogo.png'), 
    screen: 'Freefire',
    available: false,
  },
  { 
    id: '4', 
    name: 'Valorant', 
    shortName: 'VAL',
    image: require('../../assets/images/valorant.png'), 
    screen: 'valorant',
    available: false,
  },
];

export default function EsportsScreen() {
  const navigation = useNavigation();

  const handlePress = (screen, name, available) => {
    if (!available) {
      Alert.alert('Coming Soon', `${name} will be available soon!`);
      return;
    }
    navigation.navigate(screen);
  };

  const renderItem = ({ item }) => {
    const isBGMI = item.id === '1';
    return (
      <TouchableOpacity 
        style={styles.gameCard} 
        onPress={() => handlePress(item.screen, item.name, item.available)}
        activeOpacity={0.8}
      >
        <View style={styles.gameCardInner}>
          <View style={[
            styles.gameImageContainer,
            isBGMI && styles.gameImageContainerBlack
          ]}>
            <Image source={item.image} style={styles.gameImage} resizeMode="contain" />
            {!item.available && (
              <View style={styles.comingSoonOverlay}>
                <Text style={styles.comingSoonText}>Coming Soon</Text>
              </View>
            )}
            {item.available && (
              <View style={styles.availableBadge}>
                <View style={styles.availableDot} />
                <Text style={styles.availableText}>Available</Text>
              </View>
            )}
          </View>
          <View style={styles.gameCardInfo}>
            <Text style={styles.gameName}>{item.name}</Text>
            <View style={styles.gameCardFooter}>
              <View style={styles.gameTag}>
                <Ionicons name="trophy" size={rs(14)} color="#FFD700" />
                <Text style={styles.gameTagText}>Esports</Text>
              </View>
              <Ionicons 
                name={item.available ? "arrow-forward-circle" : "lock-closed"} 
                size={rs(20)} 
                color={item.available ? "#FFD700" : "#9CA3AF"} 
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Esports</Text>
      </View>
      <View style={styles.headerLine} />

      {/* Game Grid */}
      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        key="two-column"
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
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
    backgroundColor: '',
    padding: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
    paddingTop: 40,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
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
  flatList: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
    paddingBottom: hp(4),
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: wp(1),
  },
  gameCard: {
    width: '48%',
    marginBottom: hp(2),
    height: hp(28), // Fixed height for all cards
  },
  gameCardInner: {
    backgroundColor: '#1A1F2E',
    borderRadius: rs(16),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A3441',
    elevation: 4,
    //shadowColor: '#000',
    //shadowOffset: { width: 0, height: 2 },
    //shadowOpacity: 0.3,
    //shadowRadius: 4,
    height: '100%', // Ensure inner card takes full height
    flexDirection: 'column',
  },
  gameImageContainer: {
    width: '100%',
    height: hp(16), // Fixed image container height
    backgroundColor: '#0F1419',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameImageContainerBlack: {
    backgroundColor: '#000000',
  },
  gameImage: {
    height: '80%',
    width: '80%',
  },
  comingSoonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: rf(12),
    fontWeight: 'bold',
    color: '#FFD700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  availableBadge: {
    position: 'absolute',
    top: wp(2),
    right: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.9)',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.4),
    borderRadius: rs(6),
  },
  availableDot: {
    width: rs(6),
    height: rs(6),
    borderRadius: rs(3),
    backgroundColor: '#FFFFFF',
    marginRight: wp(1),
  },
  availableText: {
    fontSize: rf(9),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  gameCardInfo: {
    padding: wp(3),
    flex: 1, // Take remaining space
    justifyContent: 'space-between', // Distribute content evenly
  },
  gameName: {
    fontSize: rf(14),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp(1),
    textAlign: 'left',
    minHeight: hp(4), // Fixed minimum height for name
  },
  gameCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto', // Push footer to bottom
  },
  gameTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A3441',
    paddingVertical: hp(0.4),
    paddingHorizontal: wp(2),
    borderRadius: rs(6),
  },
  gameTagText: {
    fontSize: rf(10),
    color: '#FFD700',
    fontWeight: '600',
    marginLeft: wp(1),
  },
});
