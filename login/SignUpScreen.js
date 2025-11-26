import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { Video } from "expo-av";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });

      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("Login");
    } catch (err) {
      Alert.alert("Signup Failed", err.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Video
        source={require("../assets/vedios/intro.mp4")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        isLooping
        shouldPlay
        isMuted
      />

      <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0, 0, 0, 0.80)" }]} />

      <LinearGradient colors={["#1a1a2eaa", "#16213eaa", "#0f3460aa"]} style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.innerContainer}
        >
          <View style={styles.header}>
            <MaskedView maskElement={<Text style={styles.title}>Create Account</Text>}>
              <LinearGradient
                colors={["#FF9933", "#FFFFFF", "#138808"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={[styles.title, { opacity: 0 }]}>Create Account</Text>
              </LinearGradient>
            </MaskedView>
            <Text style={styles.subtitle}>Join the EsportsIndia Community</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#aaa"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            <TextInput
              placeholder="Email"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />

            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
            />

            <TouchableOpacity onPress={handleSignup} style={styles.signupBtn}>
              <Text style={styles.signupTextBtn}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={{ color: "#ddd" }}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
                <Text style={styles.loginLink}> Login</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.footer}>© 2025 EsportsIndia. All Rights Reserved.</Text>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    marginTop: 180,
    alignItems: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#ddd",
    marginTop: 10,
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#ffffff22",
    padding: 14,
    borderRadius: 12,
    marginVertical: 10,
    color: "white",
    fontSize: 16,
  },
  signupBtn: {
    backgroundColor: "#e94560",
    width: "100%",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  signupTextBtn: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  loginRow: {
    flexDirection: "row",
    marginTop: 15,
  },
  loginLink: {
    color: "#e94560",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    marginBottom: 40,
    color: "white",
    fontSize: 14,
  },
});
