import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Platform,Modal,FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxiNUlvS0J_AziIyPFTBGWm-VbOB7L84O5F-D5CgCZB5GVpIyMOlvQNa9aRRO_mKg46vQ/exec";

const RegistrationForm = ({ route }) => {
  const navigation = useNavigation();
  const { slot } = route.params; // Slot date passed as prop

  const today = new Date();
  const formattedToday = `${today.getDate().toString().padStart(2, "0")}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getFullYear()}`;

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };
  const slotDate = parseDate(slot);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const teamSlots = Array.from({ length: 25 }, (_, i) => `Team ${i + 1}`);


  const openDropdown = () => {
    inputRef.current.measure((fx, fy, w, h, px, py) => {
      setDropdownPosition({ top: py + h, left: px, width: w });
      setModalVisible(true);
    });
  };

  const handleSelect = (slot) => {
    setSelectedSlot(slot);
    setModalVisible(false);
  };


  const [form, setForm] = useState({
    mode: "Nusa - Solo",
    slot: slot,
    date: formattedToday, // Moved date after slot
    SelectTeamslot: "",
    player1: "",
    gameId: "",
    mobileNumber: "",
    aadhaarNumber: "",
    payment: "",
  });

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: typeof value === "string" ? value.trim() : value,
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      if (selectedDate < today) {
        Alert.alert("Invalid Date", "You cannot select a past date.");
        return;
      }

      if (selectedDate <= slotDate) {
        Alert.alert("Invalid Date", "Selected date must be after the slot date.");
        return;
      }

      const day = selectedDate.getDate().toString().padStart(2, "0");
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      const year = selectedDate.getFullYear().toString();
      const formattedDate = `${day}-${month}-${year}`;

      handleChange("date", formattedDate);
    }
  };

  const validateForm = () => {
    if (!form.player1) return "Player 1 name is required.";
    if (!form.gameId) return "Game ID is required.";
    if (!/^\d{10}$/.test(form.mobileNumber))
      return "Enter a valid 10-digit Mobile Number.";
    if (!/^\d{12}$/.test(form.aadhaarNumber))
      return "Enter a valid 12-digit Aadhaar Number.";
    if (!/^\d+(\.\d{1,2})?$/.test(form.payment))
      return "Enter a valid payment amount.";
    return null;
  };

  const handleSubmit = async () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      Alert.alert("Validation Error", errorMessage);
      return;
    }


    

    setLoading(true);
    try {
      console.log("Submitting form:", form);

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const resultText = await response.text();
      console.log("Response text:", resultText);

      try {
        const result = JSON.parse(resultText);
        console.log("Parsed response:", result);

        if (result.success) {
          Alert.alert("Success", "Data saved successfully!");
          setForm({
            mode: "Nusa - Solo",
            slot: slot,
            date: formattedToday,
            player1: "",
            gameId: "",
            mobileNumber: "",
            aadhaarNumber: "",
            payment: "",
          });
        } else {
          Alert.alert("Error", result.message || "Something went wrong.");
        }
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        Alert.alert("Error", "Invalid server response.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Network or server issue.");
    } finally {
      setLoading(false);
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

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Mode & Slot */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mode</Text>
          <TextInput style={[styles.input, styles.disabledInput]} value={form.mode} editable={false} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Slot</Text>
          <TextInput style={[styles.input, styles.disabledInput]} value={form.slot} editable={false} />
        </View>

        {/* Select Date (Moved after Slot) */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Date</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(!showDatePicker)} style={styles.datePicker}>
            <Text style={styles.dateText}>{form.date}</Text>
            <Ionicons name="calendar" size={20} color="#333" />
          </TouchableOpacity>

          {showDatePicker && (
            <View style={styles.calendarContainer}>
              <DateTimePicker
                value={new Date(form.date)}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                minimumDate={today} // Prevents selecting past dates
                onChange={handleDateChange}
              />


              
            </View>
          )}
        </View>
        <View style={styles.inputContainer}>
      <Text style={styles.label}>Select Team Slot</Text>
      <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
        <Text style={styles.placeholder}>
          {selectedSlot ? selectedSlot : "Select a slot"}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#333" style={styles.icon} />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={() => setModalVisible(false)}>
          <View style={styles.dropdown}>
            <FlatList
              data={teamSlots}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.option} onPress={() => handleSelect(item)}>
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
        

        {["player1", "gameId", "mobileNumber", "aadhaarNumber", "payment"].map((key) => (
          <View key={key} style={styles.inputContainer}>
            <Text style={styles.label}>{key.replace(/([A-Z])/g, " $1")}</Text>
            <TextInput
              style={styles.input}
              value={form[key]}
              keyboardType={["mobileNumber", "aadhaarNumber", "payment"].includes(key) ? "numeric" : "default"}
              onChangeText={(text) => handleChange(key, text)}
              placeholder={`Enter ${key.replace(/([A-Z])/g, " $1")}`}
            />
          </View>
        ))}

        {loading ? (
          <ActivityIndicator size="large" color="#f5a623" />
        ) : (
          <Button title="Submit" onPress={handleSubmit} />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5", 
    alignItems: "center" // Ensures content is centered horizontally
  },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#f5a623", 
    paddingVertical: 15, 
    paddingHorizontal: 20 
  },
  backButton: { 
    marginRight: 10 
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#000", 
    textAlign: "center", 
    flex: 1 
  },
  form: { 
    flex: 1, 
    paddingHorizontal: 20, 
    marginTop: 10, 
    width: "100%" // Ensures it takes full width
  },
  inputContainer: { 
    marginBottom: 20 
  },
  label: { 
    fontSize: 16, 
    fontWeight: "600", 
    marginBottom: 8 
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 8, 
    padding: 10, 
    backgroundColor: "white", 
    width: "100%" 
  },
  disabledInput: { 
    backgroundColor: "#e0e0e0", 
    color: "#666" 
  },
  datePicker: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 8, 
    padding: 10, 
    backgroundColor: "white", 
    width: "100%" 
  },
  dateText: { 
    fontSize: 16, 
    color: "#333" 
  },
  calendarContainer: {
    position: "relative",
    top: 3,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 15,
    elevation: 5, // Android shadow
    zIndex: 10,
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "white",
    width: "100%",
  },
  placeholder: {
    fontSize: 16,
    color: "#999",
    flex: 1,
  },
  icon: {
    marginLeft: "auto",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  dropdown: {
    backgroundColor: "white",
    width: 250,
    maxHeight:300,
    borderRadius: 8,
    padding: 10,
    elevation: 5,
    
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
});


export default RegistrationForm;


