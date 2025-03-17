import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const SignUpScreen = ({ route }) => {
  const navigation = useNavigation();
  const { slot } = route?.params || {}; 

  const [name, setName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [mobile, setMobile] = useState("");
  const [gameId, setGameId] = useState("");
  const [date, setDate] = useState("");
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    setDate(currentDate);
  }, []);

  const mode = "Livik - Solo";

  const handleSubmit = async () => {
    if (!name || !aadhaar || !mobile || !gameId) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    const formData = {
      data: [{ name, aadhaar, mobile, gameId, slot, mode, date }],
    };

    try {
      const response = await fetch("https://sheetdb.io/api/v1/58bnq7mlldrtf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Alert.alert("Success", "Form submitted successfully!");
        setName(""); setAadhaar(""); setMobile(""); setGameId("");
      } else {
        Alert.alert("Error", "Submission failed");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Register</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {[{ label: "Slot", value: slot, editable: false },
          { label: "Mode", value: mode, editable: false },
          { label: "Date", value: date, editable: false },
          { label: "Name", placeholder: "Enter Name", value: name, setter: setName },
          { label: "Aadhaar Number", placeholder: "Enter Aadhaar Number", value: aadhaar, setter: setAadhaar },
          { label: "Mobile WhatsApp Number", placeholder: "Enter Mobile Number", value: mobile, setter: setMobile, keyboardType: "phone-pad" },
          { label: "Game ID", placeholder: "Enter Game ID", value: gameId, setter: setGameId },
        ].map((item, index) => (
          <View key={index} style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>{item.label}</Text>
              {item.label === "Aadhaar Number" && (
                <TouchableOpacity onPress={() => setTooltipVisible(true)}>
                  <Ionicons name="information-circle-outline" size={18} color="#555" />
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              style={[styles.input, item.editable === false && { backgroundColor: "#ddd", color: "#000" }]}
              placeholder={item.placeholder}
              value={item.value}
              onChangeText={item.setter}
              keyboardType={item.keyboardType}
              editable={item.editable !== false}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        transparent={true}
        animationType="fade"
        visible={tooltipVisible}
        onRequestClose={() => setTooltipVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.tooltipContainer}>
            <Text style={styles.tooltipText}>Aadhaar information will be updated here.</Text>
            <TouchableOpacity onPress={() => setTooltipVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 166, 35, 0.8)',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: { position: 'absolute', left: 15, top: 55, zIndex: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginLeft: 40 },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 },
  inputContainer: { marginBottom: 15 },
  labelContainer: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 14, fontWeight: "bold", color: "#333", marginBottom: 5, marginRight: 5 },
  input: { width: "100%", padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, backgroundColor: "#fff" },
  submitButton: { backgroundColor:"#B5B5B5", padding: 12, alignItems: "center", borderRadius: 8, marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  tooltipContainer: { backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' },
  tooltipText: { fontSize: 16, marginBottom: 10 },
  closeButton: { color: 'blue', fontSize: 16 },
});

export default SignUpScreen;
