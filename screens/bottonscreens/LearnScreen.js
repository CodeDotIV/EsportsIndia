import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const LearnScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header Section with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Rules & Regulations</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Rules & Regulations Card */}
        <View style={styles.card}>
          <Text style={styles.label}>
            Note: <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.point}>• Ensure fair play at all times.</Text>
          <Text style={styles.point}>• Follow official game rules.</Text>
          <Text style={styles.point}>• No offensive language or behavior.</Text>
          <Text style={styles.point}>• Maintain a professional attitude.</Text>
          <Text style={styles.point}>• Respect referees and moderators.</Text>
          <Text style={styles.point}>• Do not share personal details.</Text>
          <Text style={styles.point}>• Avoid any form of cheating.</Text>
          <Text style={styles.point}>• Follow event timing strictly.</Text>
          <Text style={styles.point}>• Report misconduct immediately.</Text>
          <Text style={styles.point}>• Have fun and enjoy the experience.</Text>
        </View>

        {/* Rules Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Rules</Text>
          <Text style={styles.point}>• No cheating, hacking, or exploiting bugs.</Text>
          <Text style={styles.point}>• Players must use registered accounts.</Text>
          <Text style={styles.point}>• Toxic behavior will result in penalties.</Text>
          <Text style={styles.point}>• Teamwork is essential in squad-based games.</Text>
          <Text style={styles.point}>• Do not engage in account boosting.</Text>
          <Text style={styles.point}>• Keep language clean and respectful.</Text>
          <Text style={styles.point}>• Respect all opponents and teammates.</Text>
          <Text style={styles.point}>• No unauthorized software allowed.</Text>
          <Text style={styles.point}>• Follow all in-game policies.</Text>
          <Text style={styles.point}>• Breaking rules can result in disqualification.</Text>
        </View>

        {/* Guidelines Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Guidelines</Text>
          <Text style={styles.point}>• Stay updated with tournament schedules.</Text>
          <Text style={styles.point}>• Always communicate clearly with teammates.</Text>
          <Text style={styles.point}>• Respect game organizers and moderators.</Text>
          <Text style={styles.point}>• Use only verified communication channels.</Text>
          <Text style={styles.point}>• Be prepared and test your setup before matches.</Text>
          <Text style={styles.point}>• Do not manipulate game settings unfairly.</Text>
          <Text style={styles.point}>• Report any rule violations responsibly.</Text>
          <Text style={styles.point}>• Be aware of all game updates and patches.</Text>
          <Text style={styles.point}>• Ensure a stable internet connection.</Text>
          <Text style={styles.point}>• Maintain sportsmanship even in tough situations.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 0 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f5a623', 
    padding: 20 ,
  },
  backButton: { marginRight: 10,paddingTop:25, },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#000' ,paddingTop:23,},
  scrollView: { flex: 1 },
  card: { backgroundColor: '#FFF', margin: 15, padding: 18, paddingTop:23,borderRadius: 10 },
  label: { fontSize: 16, fontWeight: 'bold' },
  required: { color: 'red' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  point: { fontSize: 15, marginLeft: 10, marginTop: 5 },
});

export default LearnScreen;
