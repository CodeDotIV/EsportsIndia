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
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={rs(28)} color="#FFD700" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Ionicons name="game-controller" size={rs(24)} color="#FFD700" />
            <Text style={styles.headerText} numberOfLines={1}>BGMI</Text>
          </View>
        </View>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#0F1419',
  },
  header: {
    backgroundColor: '#1A1F2E',
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    borderBottomWidth: 2,
    borderBottomColor: '#2A3441',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: wp(3),
    padding: wp(1),
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: rf(20),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: wp(2),
    flexShrink: 1,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    marginBottom: hp(2),
    padding: hp(2.5),
    marginHorizontal: wp(4),
    borderRadius: rs(12),
    elevation: 4,
    //shadowColor: '#000',
    //shadowOffset: { width: 0, height: 2 },
    //shadowOpacity: 0.3,
    //shadowRadius: 4,
  },
  label: {
    fontSize: rf(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  },
});

export default LearnScreen;
