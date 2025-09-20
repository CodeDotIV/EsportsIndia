import React from "react";
import { TouchableOpacity, Text, StyleSheet, Image, View } from "react-native";

export default function GoogleLoginButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.content}>
      <Image
  source={require('../assets/images/google.png')} // correct relative path
  style={styles.logo}
/>

        <Text style={styles.text}>Join or Log in with Google</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#6200EE",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 28,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 12,
    resizeMode: "contain",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
