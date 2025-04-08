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
        <Text style={styles.headerText}>Winners </Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
       
 
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
