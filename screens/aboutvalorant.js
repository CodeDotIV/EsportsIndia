import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { wp, hp, rf, rs } from '../utils/responsive';

const LearnScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Valorant</Text>
      </View>
      <View style={styles.headerLine} />

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Note Section */}
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
          <Text style={styles.point}>• Teamwork is essential in 5v5 matches.</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141E30',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '',
    padding: 20,
  },
  backButton: {
    color: 'white',
    marginRight: 10,
    paddingTop: 40,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    paddingTop: 38,
  },
  headerLine: {
    height: 1,
    width: '100%',
    backgroundColor: '#FFD700',
    marginVertical: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: hp(4),
  },
  card: {
    backgroundColor: '#1A1F2E',
    marginBottom: hp(2),
    padding: hp(2.5),
    marginHorizontal: wp(4),
    borderRadius: rs(12),
    borderWidth: 1,
    borderColor: '#2A3441',
  },
  label: {
    fontSize: rf(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: hp(1),
  },
  required: {
    color: '#FF6B6B',
  },
  sectionTitle: {
    fontSize: rf(18),
    fontWeight: 'bold',
    marginBottom: hp(1),
    color: '#FFD700',
  },
  point: {
    fontSize: rf(15),
    marginLeft: wp(2),
    marginTop: hp(0.5),
    color: '#FFFFFF',
    lineHeight: rf(22),
  },
});

export default LearnScreen;
