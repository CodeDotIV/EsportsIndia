import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Alert, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const Livik = () => {
  const navigation = useNavigation();

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
    navigation.navigate("Liviksoloregister", { slot: time });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </Pressable>
        <Text style={styles.headerText}>Battle Grounds Mobile India</Text>
      </View>

      {/* Livik Title with Tooltip Icon */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Livik - Solo</Text>
        <Pressable onPress={handlePress}>
          <Ionicons name="information-circle-outline" size={18} color="black" style={styles.tooltipIcon} />
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
            <ImageBackground
              source={require('../../../../../assets/images/livik.png')}
              style={styles.gridItem}
              imageStyle={{ borderRadius: 8 }}
            >
              <View style={styles.overlay} />
              <Text style={styles.gridText}>{item}</Text>
            </ImageBackground>
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 166, 35, 0.8)',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 50,
    zIndex: 10,
  },
  headerText: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 30,
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  tooltipIcon: {
    marginLeft: 5,
    marginTop: -18,
  },
  grid: {
    gap: 10,
    paddingTop: 10,
  },
  gridItemWrapper: {
    flex: 1,
    margin: 18,
    height: 100,
  },
  gridItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
  },
  gridText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    position: 'absolute',
  },
});

export default Livik;
