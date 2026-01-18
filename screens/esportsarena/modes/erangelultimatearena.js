import React from "react";
import {
  View, Text, StyleSheet, FlatList,
  Pressable, Alert, Image, SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { wp, hp, rf, rs } from '../../../utils/responsive';

const Erangelultimatearena = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { mode } = route.params || {};

  const items = [
    { id: '1', name: 'Solo', image: require('../../../assets/images/livik.png'), screen: 'Register' },
    { id: '2', name: 'Duo', image: require('../../../assets/images/livik.png'), screen: 'Register' },
    { id: '3', name: 'Squad', image: require('../../../assets/images/livik.png'), screen: 'Register' },
  ];

  const handlePress = () => {
    Alert.alert(
      "Note:",
      "1. Mention one point\n2. Mention another point\n3. Add more points as needed",
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={rs(28)} color="#FFD700" />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Ionicons name="game-controller" size={rs(24)} color="#FFD700" />
            <Text style={styles.headerText} numberOfLines={1}>BGMI</Text>
          </View>
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Ionicons name="trophy" size={rs(20)} color="#FFD700" />
        <Text style={styles.title}>{mode}</Text>
        <Pressable onPress={handlePress}>
          <Ionicons name="information-circle-outline" size={rs(18)} color="#FFD700" style={styles.tooltipIcon} />
        </Pressable>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.grid}
          style={styles.flatList}
          renderItem={({ item }) => (
            <Pressable
              style={styles.gridItem}
              onPress={() => navigation.navigate(item.screen, { mode, team: item.name })}
            >
              <View style={styles.card}>
                <Image source={item.image} style={styles.image} />
                <Text style={styles.name}>{item.name}</Text>
              </View>
            </Pressable>
          )}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          bounces={true}
        />
      </View>
    </SafeAreaView>
  );
};

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
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: wp(3),
    padding: wp(1),
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: rf(20),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: wp(2),
    flexShrink: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: wp(5),
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  title: {
    fontSize: rf(22),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: wp(2),
  },
  tooltipIcon: { marginLeft: wp(2), alignSelf: "center" },
  listContainer: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  grid: { 
    paddingTop: hp(1), 
    paddingHorizontal: wp(3), 
    paddingBottom: hp(4),
    alignItems: "center" 
  },
  gridItem: { marginBottom: hp(2), alignItems: 'center' },
  card: {
    borderRadius: rs(16),
    overflow: 'hidden',
    elevation: 4,
    //shadowColor: '#000',
    //shadowOffset: { width: 0, height: 2 },
    //shadowOpacity: 0.3,
    //shadowRadius: 4,
  },
  image: {
    width: 200, height: 120, borderRadius: rs(12),
    resizeMode: "cover", margin: hp(2),
  },
  name: {
    fontSize: rf(16), fontWeight: 'bold',
    color: '#FFFFFF', marginTop: hp(0.5), marginBottom: hp(1.5), textAlign: 'center',
  },
});

export default Erangelultimatearena;
