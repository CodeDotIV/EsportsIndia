import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Alert, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import { useNavigation } from '@react-navigation/native';  // Import useNavigation hook

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
    navigation.navigate("Nusasquadregister", { slot: time });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Battle Grounds Mobile India</Text>
      </View>

      {/* Livik Title with Tooltip Icon */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Nusa - Squad</Text>
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
              {/* Overlay to darken/lighten the image */}
              <View style={styles.overlay} />

              {/* Time Text */}
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
    backgroundColor: '#f5f5f5', // Add a background color to ensure proper contrast
  },
  header: {
    backgroundColor: 'rgba(245, 166, 35, 0.8)',
    padding: 30,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 40,
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
    flex: 1, // Make sure grid items are flexible
    margin: 18, // Add space between grid items
    height: 100, // Set a fixed height for grid items
  },
  gridItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark overlay
    borderRadius: 8,
  },
  gridText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700', // Bright gold for better contrast
    position: 'absolute', // Ensures text is above the overlay
  },
});

export default Livik;
