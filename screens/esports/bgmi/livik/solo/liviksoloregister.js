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
  Platform,
  Modal,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { Linking } from "react-native";
 
 
// UPI Payment Constants
const UPI_ID = "7569950013@ybl";
const UPI_NAME = "Esports Registration";
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxiNUlvS0J_AziIyPFTBGWm-VbOB7L84O5F-D5CgCZB5GVpIyMOlvQNa9aRRO_mKg46vQ/exec";

const RegistrationForm = ({ route }) => {
  const navigation = useNavigation();
  const { slot } = route.params;

  const today = new Date();
  const formattedToday = `${today
    .getDate()
    .toString()
    .padStart(2, "0")}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getFullYear()}`;

  const [form, setForm] = useState({
    mode: "Nusa - Solo",
    slot: slot,
    date: formattedToday,
    SelectTeamslot: "",
    player1: "",
    gameId: "",
    mobileNumber: "",
    aadhaarNumber: "",
    payment: "1",
  });

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const teamSlots = Array.from({ length: 25 }, (_, i) => `Team ${i + 1}`);

  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: typeof value === "string" ? value.trim() : value,
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
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
    if (!form.SelectTeamslot) return "Please select a team slot.";
    if (!/^\d{10}$/.test(form.mobileNumber))
      return "Enter a valid 10-digit Mobile Number.";
    if (!/^\d{12}$/.test(form.aadhaarNumber))
      return "Enter a valid 12-digit Aadhaar Number.";
    return null;
  };

  const initiateUPIPayment = async () => {
    const url = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
      UPI_NAME
    )}&mc=&tid=${Date.now()}&tr=TRX${Date.now()}&tn=Game Registration&am=${
      form.payment
    }&cu=INR`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        Alert.alert("UPI Payment", "Please complete the payment in your UPI app.");
      } else {
        Alert.alert(
          "Error",
          "Unable to open UPI payment. Make sure you have UPI apps installed."
        );
      }
    } catch (error) {
      console.error("UPI Error:", error);
      Alert.alert("Error", "Failed to initiate UPI payment.");
    }
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
      const result = JSON.parse(resultText);

      if (result.success) {
        Alert.alert("Success", "Data saved successfully!");
        setForm({
          mode: "Nusa - Solo",
          slot: slot,
          date: formattedToday,
          SelectTeamslot: "",
          player1: "",
          gameId: "",
          mobileNumber: "",
          aadhaarNumber: "",
          payment: "1",
        });
        initiateUPIPayment(); // Trigger UPI after saving
      } else {
        Alert.alert("Error", result.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Network or server issue.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (slot) => {
    setSelectedSlot(slot);
    handleChange("SelectTeamslot", slot);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Register</Text>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Mode & Slot */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mode</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={form.mode}
            editable={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Slot</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={form.slot}
            editable={false}
          />
        </View>

        {/* Select Date */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(!showDatePicker)}
            style={styles.datePicker}
          >
            <Text style={styles.dateText}>{form.date}</Text>
            <Ionicons name="calendar" size={20} color="#333" />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={handleDateChange}
            />
          )}
        </View>

        

        {/* Player Details */}
        {["player1", "gameId", "mobileNumber", "aadhaarNumber"].map((key) => (
          <View key={key} style={styles.inputContainer}>
            <Text style={styles.label}>
              {key.replace(/([A-Z])/g, " $1").toLowerCase()}
            </Text>
            <TextInput
              style={styles.input}
              value={form[key]}
              keyboardType={
                ["mobileNumber", "aadhaarNumber"].includes(key)
                  ? "numeric"
                  : "default"
              }
              onChangeText={(text) => handleChange(key, text)}
              placeholder={`Enter ${key.replace(/([A-Z])/g, " $1")}`}
            />
          </View>
        ))}

        {/* Payment Label */}
        <View style={styles.inputContainer}>
  <Text style={styles.label}>Payment Options</Text>
  <View style={styles.upiContainer}>
    {[
      {
        name: "Google Pay",
        icon:  require('../../../../../assets/images/gpay.png'),
       
      },
      {
        name: "PhonePe",
        icon:  require('../../../../../assets/images/phonepe.png'),
      },
      {
        name: "Paytm",
        icon:  require('../../../../../assets/images/paytm.png'),
      },
      {
        name: "BHIM",
        icon:  require('../../../../../assets/images/bhim.png'),
      },
    ].map((app) => (
      <TouchableOpacity
        key={app.name}
        onPress={initiateUPIPayment}
        style={styles.upiIconContainer}
      >
        <Image source={app.icon} style={styles.upiIcon} />
        <Text style={styles.upiText}>{app.name}</Text>
      </TouchableOpacity>
    ))}
  </View>
</View>


        {/* Submit Button */}
        {loading ? (
          <ActivityIndicator size="large" color="#f5a623" />
        ) : (
          <Button title="Submit & Pay" onPress={handleSubmit} />
        )}
      </ScrollView>

      {/* Team Slot Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.dropdown}>
            <FlatList
              data={teamSlots}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
 


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  upiContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  upiIconContainer: {
    alignItems: "center",
    marginHorizontal: 5,
  },
  upiIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  upiText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5a623",
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    flex: 1,
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "white",
    width: "100%",
  },
  disabledInput: {
    backgroundColor: "#e0e0e0",
    color: "#666",
  },
  datePicker: {
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
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "white",
    width: "100%",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
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
    maxHeight: 300,
    borderRadius: 8,
    padding: 10,
    elevation: 5,
  },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
  },
});

export default RegistrationForm;
