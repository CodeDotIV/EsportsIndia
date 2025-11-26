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
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email & password");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", `Welcome ${userCredential.user.email}`);
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={{ flex: 1, opacity:5  }}>
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
            <MaskedView maskElement={<Text style={styles.title}>EsportsIndia</Text>}>
              <LinearGradient
                colors={["#FF9933", "#FFFFFF", "#138808"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={[styles.title, { opacity: 0 }]}>EsportsIndia</Text>
              </LinearGradient>
            </MaskedView>

            <Text style={styles.subtitle}>Level Up Your Gaming Journey</Text>
          </View>

          <View style={styles.form}>
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

            <TouchableOpacity onPress={handleEmailLogin} style={styles.loginBtn}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("ForgotPasswordScreen")}>
              <Text style={styles.link}>Forgot Password?</Text>
            </TouchableOpacity>

            <View style={styles.signupRow}>
              <Text style={{ color: "#ddd" }}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignUpScreen")}>
                <Text style={styles.signupText}>Sign Up</Text>
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
    marginTop: 120,
    alignItems: "center",
  },
  title: {
    fontSize: 44,
    fontWeight: "bold",
    letterSpacing: 2,
    color: "white",
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
  loginBtn: {
    backgroundColor: "#e94560",
    width: "100%",
    padding: 15,
    borderRadius: 14,
    marginTop: 10,
    alignItems: "center",
  },
  loginText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  link: {
    color: "#e94560",
    marginTop: 10,
    fontSize: 16,
  },
  signupRow: {
    flexDirection: "row",
    marginTop: 15,
  },
  signupText: {
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
