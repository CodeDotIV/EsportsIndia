import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Alert, ImageBackground, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import { useNavigation } from '@react-navigation/native';
import { wp, hp, rf, rs } from '../../../../../utils/responsive';

const Livik = () => {
  const navigation = useNavigation();  // Initialize navigation

  const [search, setSearch] = useState("");
  const times = Array.from({ length: 14 }, (_, i) => {
    const hours = 7 + Math.floor(i / 3);
    const minutes = (i % 3) * 20;
    return `${hours}:${minutes === 0 ? "00" : minutes} PM`;
  });

  const handlePress = () => {
    Alert.alert(
      "Note : ", 
      "1. Mention one point\n2. Mention another point\n3. Add more points as needed",
      [{ text: "OK" }]
    );
  };

  const handleSlotPress = (time) => {
    // Navigate to the Livikregister screen, passing the selected time slot
    navigation.navigate("Erangelsquadregister", { slot: time });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTitleContainer}>
            <Ionicons name="game-controller" size={rs(24)} color="#FFD700" />
            <Text style={styles.headerText} numberOfLines={1}>BGMI</Text>
          </View>
        </View>
      </View>

      {/* Livik Title with Tooltip Icon */}
      <View style={styles.titleContainer}>
        <Ionicons name="trophy" size={rs(20)} color="#FFD700" />
        <Text style={styles.title}>Erangel - Squad</Text>
        <Pressable onPress={handlePress}>
          <Ionicons name="information-circle-outline" size={rs(18)} color="#FFD700" style={styles.tooltipIcon} />
        </Pressable>
      </View>

      {/* Grid Layout */}
      <FlatList
        data={times}
        keyExtractor={(_, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleSlotPress(item)} style={styles.gridItemWrapper}>
            <View style={styles.card}>
              <ImageBackground 
                source={require('../../../../../assets/images/livik.png')} 
                style={styles.gridItem}
                imageStyle={{ borderRadius: rs(8) }}
              >
                <View style={styles.overlay} />
                <Text style={styles.gridText}>{item}</Text>
              </ImageBackground>
            </View>
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
      />
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
    justifyContent: 'center',
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
  tooltipIcon: {
    marginLeft: wp(2),
    alignSelf: "center",
  },
  grid: {
    gap: 10,
    paddingTop: hp(1),
    paddingHorizontal: wp(3),
  },
  gridItemWrapper: {
    flex: 1,
    margin: wp(3),
    height: hp(12),
  },
  card: {
    borderRadius: rs(16),
    overflow: 'hidden',
    elevation: 4,
    //shadowColor: '#000',
    //shadowOffset: { width: 0, height: 2 },
    //shadowOpacity: 0.3,
    //shadowRadius: 4,
    height: '100%',
  },
  gridItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: rs(8),
  },
  gridText: {
    fontSize: rf(18),
    fontWeight: 'bold',
    color: '#FFD700',
    position: 'absolute',
    zIndex: 1,
  },
});

export default Livik;
