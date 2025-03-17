import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Livik = () => {
  const navigation = useNavigation();  

  const items = [
    { id: '1', name: 'Solo', image: require('../../../../assets/images/livik.png'), screen: 'Liviksolo' },  
    { id: '2', name: 'Duo', image: require('../../../../assets/images/livik.png'), screen: 'Livikduo' },  
    { id: '3', name: 'Squad', image: require('../../../../assets/images/livik.png'), screen: 'Liviksquad' },  
  ];

  const handlePress = () => {
    Alert.alert(
      "Note : ", 
      "1. Mention one point\n2. Mention another point\n3. Add more points as needed",
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Battle Grounds Mobile India</Text>
      </View>

      {/* Title & Tooltip */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Livik</Text>
        <Pressable onPress={handlePress}>
          <Ionicons name="information-circle-outline" size={18} color="black" style={styles.tooltipIcon} />
        </Pressable>
      </View>

      {/* Grid List */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <Pressable 
            style={styles.gridItem}
            onPress={() => navigation.navigate(item.screen, { mode: item.name })}
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
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5a623',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 40,
    zIndex: 10,
  },
  headerText: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginTop: 20,
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
    fontFamily: 'sans-serif-black',
    color: '#333',
  },
  tooltipIcon: {
    marginLeft: 5,
    alignSelf: "center",
  },
  grid: {
    paddingTop: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  gridItem: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 120,
    borderRadius: 12,
    resizeMode: "cover",
    margin: 18,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 8,  
    textAlign: 'center',
  },
});

export default Livik;
