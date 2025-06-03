import React from "react";
import {
  View, Text, StyleSheet, FlatList,
  Pressable, Alert, Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </Pressable>
        <Text style={styles.headerText}>Battle Grounds Mobile India</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{mode}</Text>
        <Pressable onPress={handlePress}>
          <Ionicons name="information-circle-outline" size={18} color="black" style={styles.tooltipIcon} />
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <Pressable
            style={styles.gridItem}
            onPress={() => navigation.navigate(item.screen, { mode, team: item.name })}
          >
            <Image source={item.image} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    backgroundColor: '#f5a623',
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backButton: { position: 'absolute', left: 20, top: 45, zIndex: 10 },
  headerText: {
    fontSize: 22, fontWeight: 'bold', color: '#000', marginTop: 40,
  },
  titleContainer: {
    flexDirection: "row", alignItems: "center",
    marginLeft: 30, marginTop: 20, marginBottom: 10,
  },
  title: {
    fontSize: 24, fontWeight: 'bold',
    fontFamily: 'sans-serif-black', color: '#333',
  },
  tooltipIcon: { marginLeft: 5, alignSelf: "center" },
  grid: { paddingTop: 10, paddingHorizontal: 20, alignItems: "center" },
  gridItem: { marginBottom: 20, alignItems: 'center' },
  image: {
    width: 200, height: 120, borderRadius: 12,
    resizeMode: "cover", margin: 18,
  },
  name: {
    fontSize: 18, fontWeight: 'bold',
    color: 'black', marginTop: 8, textAlign: 'center',
  },
});

export default Erangelultimatearena;
