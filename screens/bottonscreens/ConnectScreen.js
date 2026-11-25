import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { hp, rf, wp } from '../../utils/responsive';

const filterOptions = {
  game: ['BGMI', 'FreeFire', 'Call of Duty', 'Valorant'],
  teamType: ['Solo', 'Duo', 'Squad'],
  zone: ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4'],
};

export default function ConnectScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Network');
  const [filters, setFilters] = useState({ game: '', teamType: '', state: '', zone: '' });
  const [draftFilters, setDraftFilters] = useState({ game: '', teamType: '', state: '', zone: '' });
  const [filtersVisible, setFiltersVisible] = useState(false);
  const hasFilters = Boolean(filters.game || filters.teamType || filters.state || filters.zone);

  const renderFilterGroup = (title, options, field) => (
    <View style={styles.filterGroup}>
      <Text style={styles.filterGroupTitle}>{title}</Text>
      <View style={styles.filterOptions}>
        {options.map((option) => {
          const selected = draftFilters[field] === option;
          return (
            <TouchableOpacity
              key={option}
              style={[styles.filterOption, selected && styles.filterOptionSelected]}
              onPress={() => setDraftFilters((current) => ({
                ...current,
                [field]: selected ? '' : option,
              }))}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <Text style={[styles.filterOptionText, selected && styles.filterOptionTextSelected]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Back to Home"
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.heading}>Connect</Text>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          style={[styles.searchInput, { outlineStyle: 'none' }]}
          value={query}
          onChangeText={setQuery}
          placeholder={selectedCategory === 'Network' ? 'Search connected players' : 'Search chats'}
          placeholderTextColor="#9CA3AF"
          returnKeyType="search"
          accessibilityLabel={
            selectedCategory === 'Network' ? 'Search connected players' : 'Search chats'
          }
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => setQuery('')}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
        {selectedCategory === 'Network' && (
          <TouchableOpacity
            onPress={() => {
              setDraftFilters(filters);
              setFiltersVisible(true);
            }}
            style={styles.filterButton}
            accessibilityRole="button"
            accessibilityLabel="Filter connected players"
          >
            <Ionicons name="options-outline" size={20} color={hasFilters ? '#FFD700' : '#9CA3AF'} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.categoryTabs}>
        {['Network', 'Chats'].map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <TouchableOpacity
              key={category}
              style={[styles.categoryButton, isSelected && styles.categoryButtonSelected]}
              onPress={() => setSelectedCategory(category)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
            >
              <Text style={[styles.categoryLabel, isSelected && styles.categoryLabelSelected]}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.results} />
      <Modal
        visible={filtersVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFiltersVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalDismissArea}
            activeOpacity={1}
            onPress={() => setFiltersVisible(false)}
            accessibilityLabel="Close filters"
          />
          <View style={styles.filterModal}>
            <View style={styles.filterModalHeader}>
              <Text style={styles.filterModalTitle}>Filter connected players</Text>
              <TouchableOpacity
                onPress={() => setFiltersVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Close filters"
              >
                <Ionicons name="close" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.filterModalContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {renderFilterGroup('Game', filterOptions.game, 'game')}
              {renderFilterGroup('Team Type', filterOptions.teamType, 'teamType')}
              <View style={styles.filterGroup}>
                <Text style={styles.filterGroupTitle}>State</Text>
                <TextInput
                  style={styles.stateInput}
                  value={draftFilters.state}
                  onChangeText={(state) => setDraftFilters((current) => ({ ...current, state }))}
                  placeholder="Enter a state"
                  placeholderTextColor="#9CA3AF"
                  accessibilityLabel="Filter by state"
                />
              </View>
              {renderFilterGroup('Zone', filterOptions.zone, 'zone')}
            </ScrollView>
            <View style={styles.filterModalActions}>
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => setDraftFilters({ game: '', teamType: '', state: '', zone: '' })}
                accessibilityRole="button"
              >
                <Text style={styles.clearFiltersText}>Clear all</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyFiltersButton}
                onPress={() => {
                  setFilters(draftFilters);
                  setFiltersVisible(false);
                }}
                accessibilityRole="button"
              >
                <Text style={styles.applyFiltersText}>Apply filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141E30',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.5),
  },
  backButton: {
    marginRight: wp(2),
    padding: wp(1),
  },
  heading: {
    color: '#FFFFFF',
    fontSize: rf(18),
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginHorizontal: wp(5),
    marginTop: hp(1),
    paddingHorizontal: wp(3),
    minHeight: 46,
    backgroundColor: '#1A1F2E',
    borderWidth: 1,
    borderColor: '#2A3441',
    borderRadius: 23,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: '#FFFFFF',
    fontSize: rf(14),
    paddingVertical: hp(1),
    outlineStyle: 'none',
  },
  filterButton: {
    padding: wp(1),
  },
  categoryTabs: {
    flexDirection: 'row',
    gap: wp(2),
    marginHorizontal: wp(5),
    marginTop: hp(1.5),
  },
  categoryButton: {
    flex: 1,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(1.5),
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  categoryButtonSelected: {
    borderBottomColor: '#FFD700',
  },
  categoryLabel: {
    color: '#D1D5DB',
    fontSize: rf(12),
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryLabelSelected: {
    color: '#FFD700',
  },
  results: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: wp(5),
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  modalDismissArea: {
    ...StyleSheet.absoluteFillObject,
  },
  filterModal: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '80%',
    alignSelf: 'center',
    padding: wp(5),
    backgroundColor: '#1A1F2E',
    borderWidth: 1,
    borderColor: '#2A3441',
    borderRadius: 16,
  },
  filterModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  filterModalTitle: {
    color: '#FFFFFF',
    fontSize: rf(18),
    fontWeight: '700',
  },
  filterModalContent: {
    flexShrink: 1,
  },
  filterGroup: {
    marginTop: hp(1.5),
  },
  filterGroupTitle: {
    color: '#FFFFFF',
    fontSize: rf(14),
    fontWeight: '600',
    marginBottom: hp(0.8),
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
  },
  filterOption: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderWidth: 1,
    borderColor: '#3A4555',
    borderRadius: 18,
  },
  filterOptionSelected: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  filterOptionText: {
    color: '#D1D5DB',
    fontSize: rf(12),
  },
  filterOptionTextSelected: {
    color: '#141E30',
    fontWeight: '600',
  },
  stateInput: {
    minHeight: 44,
    paddingHorizontal: wp(3),
    borderWidth: 1,
    borderColor: '#3A4555',
    borderRadius: 10,
    color: '#FFFFFF',
    fontSize: rf(13),
  },
  filterModalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: wp(3),
    marginTop: hp(2),
  },
  clearFiltersButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: hp(1.2),
  },
  clearFiltersText: {
    color: '#D1D5DB',
    fontSize: rf(13),
    fontWeight: '600',
  },
  applyFiltersButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: hp(1.2),
    backgroundColor: '#FFD700',
    borderRadius: 22,
  },
  applyFiltersText: {
    color: '#141E30',
    fontSize: rf(13),
    fontWeight: '700',
  },
});
