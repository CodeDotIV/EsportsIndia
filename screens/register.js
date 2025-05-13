import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const RegistrationForm = ({ navigation }) => {
  const [form, setForm] = useState({
    mode: '',
    teamLead: {
      name: '',
      gameId: '',
      mobileNumber: '',
      email: '',
    },
    teamMember2: {
      name: '',
      gameId: '',
      mobileNumber: '',
    },
    teamMember3: {
      name: '',
      gameId: '',
      mobileNumber: '',
    },
    teamMember4: {
      name: '',
      gameId: '',
      mobileNumber: '',
      email: '',
    },
  });

  const [expandedSections, setExpandedSections] = useState({
    teamMember2: false,
    teamMember3: false,
    teamMember4: false,
  });

  useEffect(() => {
    if (form.mode === 'auto') {
      setForm((prev) => ({
        ...prev,
        teamLead: {
          ...prev.teamLead,
          mobileNumber: '9999999999',
        },
      }));
    }
  }, [form.mode]);

  const handleChange = (section, field, value) => {
    if (section === 'mode') {
      setForm({ ...form, [section]: value });
    } else {
      setForm({
        ...form,
        [section]: {
          ...form[section],
          [field]: value,
        },
      });
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderPlayerFields = (label, section, fields, isCollapsible = false) => (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => isCollapsible && toggleSection(section)}
        activeOpacity={0.7}
      >
        <Text style={styles.sectionTitle}>{label}</Text>
        {isCollapsible && (
          <Ionicons
            name={expandedSections[section] ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="black"
          />
        )}
      </TouchableOpacity>

      {!isCollapsible || expandedSections[section] ? (
        fields.map((field) => (
          <View key={`${section}-${field}`} style={styles.inputContainer}>
            <Text style={styles.label}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </Text>
            <TextInput
              style={styles.input}
              value={form[section][field] || ''}
              onChangeText={(value) => handleChange(section, field, value)}
              placeholder={`Enter ${label} ${field}`}
            />
          </View>
        ))
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Team Registration</Text>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mode</Text>
          <TextInput
            style={styles.input}
            value={form.mode}
            onChangeText={(value) => handleChange('mode', null, value)}
            placeholder="Enter Mode (e.g. auto)"
          />
        </View>

        {renderPlayerFields('Team Lead', 'teamLead', ['name', 'gameId', 'mobileNumber', 'email'])}
        {renderPlayerFields('Team Member 2', 'teamMember2', ['name', 'gameId', 'mobileNumber'], true)}
        {renderPlayerFields('Team Member 3', 'teamMember3', ['name', 'gameId', 'mobileNumber'], true)}
        {renderPlayerFields('Team Member 4', 'teamMember4', ['name', 'gameId', 'mobileNumber', 'email'], true)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#f5f5f5', padding: 0 
  },
  header: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f5a623', 
    padding: 20 ,
  },
  backButton: {
    marginRight: 10, paddingTop:38,
  },
  title: {
    fontSize: 18, fontWeight: 'bold', color: '#000' ,paddingTop:38
  },
  form: {
    flex: 1,
    paddingHorizontal: 30,
    marginTop: 15,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
  },
});

export default RegistrationForm;
