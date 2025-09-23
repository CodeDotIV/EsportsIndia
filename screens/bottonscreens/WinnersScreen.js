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
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Winners </Text>
      </View>
      <View style={styles.headerLine} />
      {/* Scrollable Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
       
 
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141E30' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '', padding: 20 },
  backButton: {  color: 'white',marginRight: 10, paddingTop: 40 },
  
  headerText: { fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    paddingTop: 38,},
  scrollView: { flex: 1 },
  card: { backgroundColor: '#FFF', margin: 15, padding: 18, paddingTop:23,borderRadius: 10 },
  label: { fontSize: 16, fontWeight: 'bold' },
  required: { color: 'red' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  point: { fontSize: 15, marginLeft: 10, marginTop: 5 },
  headerLine: {
    height: 1,
    width: '100%',
    backgroundColor: '#FFD700',
    marginVertical: 5,
  },
});

export default LearnScreen;
